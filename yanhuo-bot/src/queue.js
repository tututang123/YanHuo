const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class DurableQueue {
  constructor(profileName, stateRoot) {
    this.profileName = profileName;
    this.stateRoot = stateRoot;
    this.journalPath = path.join(stateRoot, `${profileName}.queue.jsonl`);
    this.tail = Promise.resolve();
    fs.mkdirSync(stateRoot, { recursive: true });
  }

  readEntries() {
    if (!fs.existsSync(this.journalPath)) return [];
    const lines = fs.readFileSync(this.journalPath, 'utf8').split(/\r?\n/).filter(Boolean);
    const entries = [];
    for (const line of lines) {
      try {
        entries.push(JSON.parse(line));
      } catch (err) {
        continue;
      }
    }
    return entries;
  }

  getLatestEntries() {
    const latestById = new Map();
    for (const entry of this.readEntries()) {
      if (!entry || !entry.id) continue;
      latestById.set(entry.id, entry);
    }
    return [...latestById.values()];
  }

  append(entry) {
    fs.appendFileSync(this.journalPath, `${JSON.stringify(entry)}\n`, 'utf8');
  }

  enqueue(payload, task) {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const pending = {
      id,
      status: 'pending',
      profile: this.profileName,
      createdAt: new Date().toISOString(),
      payload,
    };
    this.append(pending);
    return this.push(async () => {
      try {
        const result = await task();
        this.append({
          id,
          status: 'done',
          profile: this.profileName,
          completedAt: new Date().toISOString(),
        });
        return result;
      } catch (error) {
        this.append({
          id,
          status: 'error',
          profile: this.profileName,
          completedAt: new Date().toISOString(),
          error: error && error.message ? error.message : String(error),
        });
        throw error;
      }
    });
  }

  push(task) {
    const run = this.tail.then(task, task);
    this.tail = run.catch(() => {});
    return run;
  }

  async replayPending(taskFactory) {
    const entries = this.getLatestEntries();
    for (const entry of entries) {
      if (entry.status !== 'pending') continue;
      await this.push(async () => {
        try {
          const result = await taskFactory(entry.payload);
          this.append({
            id: entry.id,
            status: 'done',
            profile: this.profileName,
            completedAt: new Date().toISOString(),
          });
          return result;
        } catch (error) {
          this.append({
            id: entry.id,
            status: 'error',
            profile: this.profileName,
            completedAt: new Date().toISOString(),
            error: error && error.message ? error.message : String(error),
          });
          throw error;
        }
      });
    }
  }
}

module.exports = { DurableQueue };
