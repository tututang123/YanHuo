const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');

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

function readCodexApiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const home = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  const authPath = path.join(home, 'auth.json');
  if (!fs.existsSync(authPath)) return '';
  try {
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    return String(auth.OPENAI_API_KEY || '').trim();
  } catch (error) {
    return '';
  }
}

function postJson(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }, (response) => {
      let raw = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        raw += chunk;
      });
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode || 0,
          raw,
        });
      });
    });

    request.on('error', reject);
    request.setTimeout(90000, () => {
      request.destroy(new Error('Codex API request timed out'));
    });
    request.write(JSON.stringify(body));
    request.end();
  });
}

function collectResponseText(responseJson) {
  const parts = [];
  const output = Array.isArray(responseJson && responseJson.output) ? responseJson.output : [];
  for (const item of output) {
    if (item && item.type === 'message' && Array.isArray(item.content)) {
      for (const part of item.content) {
        if (part && typeof part.text === 'string') {
          parts.push(part.text);
        }
      }
      continue;
    }
    if (item && typeof item.text === 'string') {
      parts.push(item.text);
    }
  }
  return parts.join('\n').trim();
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
  const model = profile.codexModel || process.env.YANHUO_CODEX_MODEL || '';
  const baseUrl = process.env.YANHUO_CODEX_API_BASE_URL || 'https://api.modrouter.top/v1';
  const sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const outputDir = path.join(stateRoot, 'codex', profile.name);
  const outputPath = path.join(outputDir, `${sessionId}.last-message.txt`);
  fs.mkdirSync(outputDir, { recursive: true });

  const prompt = buildPrompt({ input, repoRoot, profile });
  const requestBody = {
    model: model || 'gpt-5.5',
    input: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    store: false,
  };
  const apiUrl = new URL('/responses', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  const apiKey = readCodexApiKey();
  const command = `POST ${apiUrl.toString()} [model=${requestBody.model}]`;

  const result = await new Promise((resolve) => {
    if (!apiKey) {
      resolve({
        command,
        exitCode: 1,
        stdout: '',
        stderr: 'Codex API key not found.',
        lastMessage: '',
        outputPath,
      });
      return;
    }

    postJson(apiUrl, requestBody, {
      Authorization: `Bearer ${apiKey}`,
    })
      .then(({ statusCode, raw }) => {
        let parsed = {};
        try {
          parsed = raw ? JSON.parse(raw) : {};
        } catch (error) {
          parsed = {};
        }
        const lastMessage = collectResponseText(parsed);
        if (lastMessage) {
          fs.writeFileSync(outputPath, `${lastMessage}\n`);
        }
        resolve({
          command,
          exitCode: statusCode >= 200 && statusCode < 300 ? 0 : 1,
          stdout: tailText(raw),
          stderr: statusCode >= 200 && statusCode < 300 ? '' : tailText(raw),
          lastMessage: tailText(lastMessage),
          outputPath,
        });
      })
      .catch((error) => {
        resolve({
          command,
          exitCode: -1,
          stdout: '',
          stderr: tailText(error.stack || error.message),
          lastMessage: '',
          outputPath,
        });
      });
  });

  return result;
}

module.exports = {
  runCodexTask,
};
