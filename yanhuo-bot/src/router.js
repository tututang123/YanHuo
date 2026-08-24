const { runCodexTask } = require('./codex');

function normalizeCommandText(text) {
  return String(text || '').replace(/\u00a0/g, ' ').trim();
}

function helpText() {
  return [
    'All incoming messages are sent to Codex.',
    'Send a normal task message and I will return the current Codex command and result.',
  ].join('\n');
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
  if ((profile.mode || 'codex') === 'codex') {
    return async function route(input) {
      const text = normalizeCommandText(input.text);
      if (!text) return '';

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

  return async function route(input) {
    const text = normalizeCommandText(input.text);
    if (!text) return '';

    const [head, second, ...rest] = text.split(/\s+/);
    const args = [second, ...rest].join(' ').trim();

    if (head === 'help' || head === '?') {
      return helpText();
    }

    if (head === 'repo' && second === 'status') {
      const status = repo.status();
      return [
        `branch: ${status.branch}`,
        `head: ${status.head}`,
        status.dirty ? 'dirty:\n' + status.dirty : 'dirty: clean',
      ].join('\n');
    }

    if (head === 'repo' && second === 'sync') {
      return repo.sync();
    }

    if (head === 'search') {
      if (!args) return 'Usage: search <text>';
      const hits = repo.search(args);
      if (!hits.length) return `No matches for "${args}".`;
      return hits.map((hit) => `${hit.file}: ${hit.line}`).join('\n');
    }

    if (head === 'task' && second === 'add') {
      if (!profile.allowWrite) {
        return 'Write mode is disabled for this profile.';
      }
      if (!args) return 'Usage: task add <text>';
      const file = repo.appendInbox({
        profile: profile.name,
        sender: input.sender,
        source: input.source,
        command: 'task add',
        rawText: args,
      });
      return `Saved to ${file}`;
    }

    return helpText();
  };
}

module.exports = {
  createRouter,
  helpText,
  normalizeCommandText,
};
