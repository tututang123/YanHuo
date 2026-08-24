const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(text);
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  const text = String(value).toLowerCase();
  return text === '1' || text === 'true' || text === 'yes' || text === 'on';
}

function resolveConfigPath() {
  return process.env.YANHUO_BOT_CONFIG
    ? path.resolve(process.env.YANHUO_BOT_CONFIG)
    : [
        path.resolve(process.cwd(), 'config', 'bots.json'),
        path.resolve(process.cwd(), 'yanhuo-bot', 'config', 'bots.json'),
        path.resolve(__dirname, '..', 'config', 'bots.json'),
      ].find((candidate) => fs.existsSync(candidate)) || path.resolve(__dirname, '..', 'config', 'bots.json');
}

function loadConfig() {
  const configPath = resolveConfigPath();
  if (!fs.existsSync(configPath)) {
    throw new Error(`Bot config not found: ${configPath}`);
  }

  const config = readJson(configPath);
  const repoRoot = path.resolve(process.env.YANHUO_KNOWLEDGE_ROOT || config.repoRoot || '/root/yanhuo-knowledge');
  const inboxFile = config.inboxFile || 'knowledge/40-projects/dnf-70/04-development/bot-inbox.md';
  const profiles = Array.isArray(config.profiles) ? config.profiles : [];

  if (!profiles.length) {
    throw new Error('Bot config must define at least one profile.');
  }

  return {
    configPath,
    repoRoot,
    inboxFile,
    profiles: profiles.map((profile) => ({
      name: profile.name,
      displayName: profile.displayName || profile.name,
      aliases: Array.isArray(profile.aliases) ? profile.aliases : [profile.name],
      adapter: profile.adapter || process.env.YANHUO_BOT_ADAPTER || 'dingtalk-stream',
      mode: profile.mode || process.env.YANHUO_BOT_MODE || 'codex',
      clientIdEnv: profile.clientIdEnv || 'YANHUO_DINGTALK_CLIENT_ID',
      clientSecretEnv: profile.clientSecretEnv || 'YANHUO_DINGTALK_CLIENT_SECRET',
      clientId: process.env[profile.clientIdEnv || 'YANHUO_DINGTALK_CLIENT_ID'] || '',
      clientSecret: process.env[profile.clientSecretEnv || 'YANHUO_DINGTALK_CLIENT_SECRET'] || '',
      keepAlive: Boolean(profile.keepAlive),
      debug: Boolean(profile.debug),
      codexBin: process.env.YANHUO_CODEX_BIN || profile.codexBin || 'codex',
      codexSandbox: process.env.YANHUO_CODEX_SANDBOX || profile.codexSandbox || 'workspace-write',
      codexModel: process.env.YANHUO_CODEX_MODEL || profile.codexModel || '',
      codexBypassApprovals: parseBoolean(
        process.env.YANHUO_CODEX_BYPASS_APPROVALS,
        profile.codexBypassApprovals !== undefined ? profile.codexBypassApprovals : false,
      ),
      codexExtraArgs: Array.isArray(profile.codexExtraArgs) ? profile.codexExtraArgs : [],
      allowWrite: Boolean(profile.allowWrite),
      allowGitPush: Boolean(profile.allowGitPush),
    })),
  };
}

module.exports = {
  loadConfig,
  resolveConfigPath,
};
