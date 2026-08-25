const { runCodexTask } = require('./codex');
const { classifyLocalRequest, formatHelp, runLocalRequest } = require('./ops');

function normalizeCommandText(text) {
  return String(text || '').replace(/\u00a0/g, ' ').trim();
}

function helpText() {
  return formatHelp();
}

function formatCodexResult(result) {
  const lines = [
    'Codex command:',
    result.command,
  ];

  if (result.exitCode === 0) {
    lines.push('');
    lines.push('Codex reply:');
    lines.push(result.lastMessage || result.stdout || '(no output)');
  } else {
    lines.push('');
    lines.push(`Codex exit code: ${result.exitCode}`);
    if (result.lastMessage) {
      lines.push('Codex reply:');
      lines.push(result.lastMessage);
    }
    if (result.stderr) {
      lines.push('');
      lines.push('Codex stderr:');
      lines.push(result.stderr);
    } else if (result.stdout) {
      lines.push('');
      lines.push('Codex stdout:');
      lines.push(result.stdout);
    }
  }

  return lines.join('\n');
}

function createRouter({ repo, profile, stateRoot }) {
  return async function route(input) {
    const text = normalizeCommandText(input.text);
    if (!text) return '';

    const localRequest = classifyLocalRequest(text);
    if (localRequest) {
      return runLocalRequest({
        request: localRequest,
        repo,
        profile,
      });
    }

    const result = await runCodexTask({
      input: {
        ...input,
        text,
      },
      repoRoot: repo.root,
      profile,
      stateRoot,
    });

    return formatCodexResult(result);
  };
}

module.exports = {
  createRouter,
  helpText,
  normalizeCommandText,
};
