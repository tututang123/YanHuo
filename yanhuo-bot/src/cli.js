require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { loadConfig } = require('./config');
const { KnowledgeRepo } = require('./repo');
const { createRouter } = require('./router');

async function main() {
  const args = process.argv.slice(2);
  const text = args.join(' ').trim();
  const config = loadConfig();
  const profile = config.profiles[0];
  const repo = new KnowledgeRepo(config.repoRoot, config.inboxFile);
  const router = createRouter({ repo, profile, stateRoot: require('path').resolve(process.cwd(), 'state') });
  const output = await router({
    text,
    sender: 'cli',
    source: 'cli',
  });
  process.stdout.write(`${output}\n`);
}

main().catch((err) => {
  console.error(err.stack || err.message);
  process.exit(1);
});
