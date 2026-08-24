const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  const text = String(value).toLowerCase();
  return text === '1' || text === 'true' || text === 'yes' || text === 'on';
}

function quoteArg(arg) {
  const text = String(arg);
  if (!text) return "''";
  if (!/[\s"'\\]/.test(text)) return text;
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

function tailText(text, limit = 4000) {
  const value = String(text || '');
  if (value.length <= limit) return value.trim();
  return `...${value.slice(-limit).trim()}`;
}

function buildPrompt({ input, repoRoot, profile }) {
  const text = String(input && input.text ? input.text : '').trim();
  return [
    'You are Codex operating on the YanHuo knowledge repository.',
    `Repository root: ${repoRoot}`,
    `Bot profile: ${profile.name}`,
    `Source: ${input && input.source ? input.source : 'unknown'}`,
    `Sender: ${input && input.sender ? input.sender : 'unknown'}`,
    '',
    'User message:',
    text,
    '',
    'Instructions:',
    '- Treat the user message as the task to execute.',
    '- Keep changes within the repository unless the user explicitly asks otherwise.',
    '- If you change files, summarize the change clearly.',
    '- If the request is ambiguous, ask one concise follow-up question.',
    '- Reply in Chinese unless the user asks for another language.',
  ].join('\n');
}

async function runCodexTask({ input, repoRoot, profile, stateRoot }) {
  const codexBin = profile.codexBin || process.env.YANHUO_CODEX_BIN || 'codex';
  const sandbox = profile.codexSandbox || process.env.YANHUO_CODEX_SANDBOX || 'workspace-write';
  const model = profile.codexModel || process.env.YANHUO_CODEX_MODEL || '';
  const useBypass =
    profile.codexBypassApprovals !== undefined
      ? profile.codexBypassApprovals
      : parseBoolean(process.env.YANHUO_CODEX_BYPASS_APPROVALS, false);

  const sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const outputDir = path.join(stateRoot, 'codex', profile.name);
  const outputPath = path.join(outputDir, `${sessionId}.last-message.txt`);
  fs.mkdirSync(outputDir, { recursive: true });

  const args = [
    'exec',
    '--cd',
    repoRoot,
    '--sandbox',
    sandbox,
    '--skip-git-repo-check',
    '--ephemeral',
    '--output-last-message',
    outputPath,
  ];

  if (model) {
    args.push('--model', model);
  }

  if (useBypass) {
    args.push('--dangerously-bypass-approvals-and-sandbox');
  }

  if (Array.isArray(profile.codexExtraArgs)) {
    args.push(...profile.codexExtraArgs.map(String));
  }

  const prompt = buildPrompt({ input, repoRoot, profile });
  args.push(prompt);
  const command = [
    quoteArg(codexBin),
    ...args.map(quoteArg),
  ].join(' ');
  const useScript = process.platform !== 'win32';
  const execCommand = useScript ? [
    'script',
    '-qec',
    quoteArg(command),
    '/dev/null',
  ].join(' ') : command;

  const result = await new Promise((resolve) => {
    const child = spawn(useScript ? 'script' : codexBin, useScript ? ['-qec', command, '/dev/null'] : args, {
      cwd: repoRoot,
      env: {
        ...process.env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
      if (stdout.length > 12000) stdout = stdout.slice(-12000);
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
      if (stderr.length > 12000) stderr = stderr.slice(-12000);
    });

    child.on('error', (error) => {
      resolve({
        command: execCommand,
        exitCode: -1,
        stdout: tailText(stdout),
        stderr: tailText(`${stderr}\n${error.stack || error.message}`),
        lastMessage: '',
        outputPath,
      });
    });

    child.on('close', (exitCode) => {
      let lastMessage = '';
      try {
        if (fs.existsSync(outputPath)) {
          lastMessage = fs.readFileSync(outputPath, 'utf8');
        }
      } catch (error) {
        lastMessage = '';
      }

      resolve({
        command: execCommand,
        exitCode: typeof exitCode === 'number' ? exitCode : 1,
        stdout: tailText(stdout),
        stderr: tailText(stderr),
        lastMessage: tailText(lastMessage),
        outputPath,
      });
    });

  });

  return result;
}

module.exports = {
  runCodexTask,
};
