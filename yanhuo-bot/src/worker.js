require('dotenv').config();

const { loadConfig } = require('./config');
const { startProfile } = require('./platform');

async function main() {
  const config = loadConfig();
  const profileName = process.env.YANHUO_BOT_PROFILE || config.profiles[0].name;
  const profile = config.profiles.find((item) => item.name === profileName);

  if (!profile) {
    throw new Error(`Profile not found: ${profileName}`);
  }

  await startProfile(profile, {
    repoRoot: config.repoRoot,
    inboxFile: config.inboxFile,
    stateRoot: process.env.YANHUO_BOT_STATE_ROOT || require('path').resolve(process.cwd(), 'state'),
  });
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
