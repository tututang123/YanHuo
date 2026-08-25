const { execFileSync } = require('child_process');
const os = require('os');

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = Number(bytes) || 0;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function runCommand(command, args = []) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 15000,
  }).trim();
}

function classifyLocalRequest(text) {
  const value = String(text || '').trim().toLowerCase();
  if (!value) return null;

  if (/^(help|\?)$/.test(value)) return { type: 'help' };
  if (/^repo\s+status$/.test(value)) return { type: 'repo-status' };
  if (/^repo\s+sync$/.test(value)) return { type: 'repo-sync' };
  if (/^search\s+.+/.test(value)) return { type: 'search', args: text.trim().slice(7).trim() };
  if (/^task\s+add\s+.+/.test(value)) return { type: 'task-add', args: text.trim().slice(8).trim() };

  if (/(内存|memory|ram)/.test(value)) return { type: 'memory' };
  if (/(磁盘|disk|存储|空间)/.test(value)) return { type: 'disk' };
  if (/(进程|process|cpu|负载|load)/.test(value)) return { type: 'process' };
  if (/(uptime|运行时间)/.test(value)) return { type: 'uptime' };

  return null;
}

function formatHelp() {
  return [
    'Local commands:',
    '- help',
    '- repo status',
    '- repo sync',
    '- search <text>',
    '- task add <text>',
    '- memory',
    '- disk',
    '- process',
    '- uptime',
    '',
    'Other messages still go to Codex.',
  ].join('\n');
}

function formatMemory() {
  return [
    `total: ${formatBytes(os.totalmem())}`,
    `free: ${formatBytes(os.freemem())}`,
    `used: ${formatBytes(os.totalmem() - os.freemem())}`,
    `loadavg: ${os.loadavg().map((value) => value.toFixed(2)).join(', ')}`,
  ].join('\n');
}

function formatDisk() {
  try {
    return runCommand('df', ['-h', '/']);
  } catch (error) {
    return error.message || String(error);
  }
}

function formatProcess() {
  try {
    return runCommand('ps', ['-eo', 'pid,ppid,pcpu,pmem,comm', '--sort=-pmem'])
      .split(/\r?\n/)
      .slice(0, 16)
      .join('\n');
  } catch (error) {
    return error.message || String(error);
  }
}

function formatUptime() {
  try {
    return runCommand('uptime');
  } catch (error) {
    return error.message || String(error);
  }
}

function runLocalRequest({ request, repo, profile }) {
  switch (request.type) {
    case 'help':
      return formatHelp();
    case 'repo-status': {
      const status = repo.status();
      return [
        `branch: ${status.branch}`,
        `head: ${status.head}`,
        status.dirty ? `dirty:\n${status.dirty}` : 'dirty: clean',
      ].join('\n');
    }
    case 'repo-sync':
      return repo.sync();
    case 'search': {
      if (!request.args) return 'Usage: search <text>';
      const hits = repo.search(request.args);
      if (!hits.length) return `No matches for "${request.args}".`;
      return hits.map((hit) => `${hit.file}: ${hit.line}`).join('\n');
    }
    case 'task-add': {
      if (!profile.allowWrite) return 'Write mode is disabled for this profile.';
      if (!request.args) return 'Usage: task add <text>';
      const file = repo.appendInbox({
        profile: profile.name,
        sender: 'bot',
        source: 'chat',
        command: 'task add',
        rawText: request.args,
      });
      return `Saved to ${file}`;
    }
    case 'memory':
      return formatMemory();
    case 'disk':
      return formatDisk();
    case 'process':
      return formatProcess();
    case 'uptime':
      return formatUptime();
    default:
      return '';
  }
}

module.exports = {
  classifyLocalRequest,
  runLocalRequest,
  formatHelp,
};
