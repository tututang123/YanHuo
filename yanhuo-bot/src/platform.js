const { KnowledgeRepo } = require('./repo');
const { createRouter } = require('./router');
const { startDingTalkProfile } = require('./adapters/dingtalk');
const { DurableQueue } = require('./queue');

async function startProfile(profile, shared) {
  const repo = new KnowledgeRepo(shared.repoRoot, shared.inboxFile);
  const queue = new DurableQueue(profile.name, shared.stateRoot);
  const router = createRouter({ repo, profile, stateRoot: shared.stateRoot });

  await queue.replayPending(async (payload) => router(payload));
  return startDingTalkProfile({ profile, queue, router, repo });
}

async function startPlatform(config) {
  const started = [];
  for (const profile of config.profiles) {
    try {
      started.push(await startProfile(profile, config));
    } catch (err) {
      await Promise.allSettled(started.map((bot) => bot.stop && bot.stop()));
      throw err;
    }
  }
  return started;
}

module.exports = {
  startPlatform,
  startProfile,
};
