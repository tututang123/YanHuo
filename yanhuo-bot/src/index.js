require('dotenv').config();

const path = require('path');
const { fork } = require('child_process');
const { loadConfig } = require('./config');

async function main() {
  const config = loadConfig();
  const children = new Map();
  const stateRoot = process.env.YANHUO_BOT_STATE_ROOT || path.resolve(process.cwd(), 'state');
  let shuttingDown = false;

  const startChild = (profile) => {
    const child = fork(path.join(__dirname, 'worker.js'), [], {
      env: {
        ...process.env,
        YANHUO_BOT_CONFIG: config.configPath,
        YANHUO_KNOWLEDGE_ROOT: config.repoRoot,
        YANHUO_BOT_PROFILE: profile.name,
        YANHUO_BOT_STATE_ROOT: stateRoot,
      },
      stdio: 'inherit',
    });

    children.set(profile.name, child);
    child.on('exit', (code) => {
      children.delete(profile.name);
      if (code !== 0 && !shuttingDown) {
        console.error(`[${profile.name}] exited with code ${code}, restarting`);
        setTimeout(() => startChild(profile), 3000);
      }
    });
  };

  for (const profile of config.profiles) startChild(profile);
  console.log(`Started ${config.profiles.length} bot profile(s).`);

  const shutdown = async () => {
    shuttingDown = true;
    const pending = [];
    for (const child of children.values()) {
      try {
        child.kill('SIGTERM');
        pending.push(new Promise((resolve) => {
          const timer = setTimeout(resolve, 5000);
          child.once('exit', () => {
            clearTimeout(timer);
            resolve();
          });
        }));
      } catch (err) {
        console.error(err.message);
      }
    }
    await Promise.allSettled(pending);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
