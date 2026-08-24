const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

class KnowledgeRepo {
  constructor(root, inboxFile) {
    this.root = path.resolve(root);
    this.inboxFile = inboxFile;
    this.repoRoot = path.resolve(this.root);
    this.inboxAbsPath = this.resolveInsideRepo(inboxFile);
  }

  resolveInsideRepo(relativePath) {
    const filePath = path.resolve(this.root, relativePath);
    const rootPrefix = `${this.root}${path.sep}`;
    if (filePath !== this.root && !filePath.startsWith(rootPrefix)) {
      throw new Error(`Path escapes repo root: ${relativePath}`);
    }
    return filePath;
  }

  git(args) {
    return execFileSync('git', args, {
      cwd: this.root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  }

  status() {
    let branch = '';
    try {
      branch = this.git(['rev-parse', '--abbrev-ref', 'HEAD']);
    } catch (err) {
      branch = 'unknown';
    }

    let head = '';
    try {
      head = this.git(['rev-parse', '--short', 'HEAD']);
    } catch (err) {
      head = 'unknown';
    }

    const dirty = this.git(['status', '--short']);
    return {
      branch,
      head,
      dirty,
    };
  }

  sync() {
    const dirty = this.git(['status', '--short']);
    if (dirty) {
      throw new Error('Working tree has uncommitted changes; commit or stash before sync.');
    }
    return this.git(['pull', '--ff-only']);
  }

  search(term, limit = 10) {
    const results = [];
    const skipNames = new Set(['.git', 'node_modules', 'backups', 'log-runs']);

    const walk = (dir) => {
      if (results.length >= limit) return;
      let entries = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch (err) {
        return;
      }
      for (const entry of entries) {
        if (results.length >= limit) return;
        if (skipNames.has(entry.name)) continue;

        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }

        if (!/\.(md|txt|json|js|ts|toml|yaml|yml)$/i.test(entry.name)) continue;
        const text = fs.readFileSync(full, 'utf8');
        if (!text.toLowerCase().includes(term.toLowerCase())) continue;
        const rel = path.relative(this.root, full);
        const line = text.split(/\r?\n/).find((item) => item.toLowerCase().includes(term.toLowerCase())) || '';
        results.push({ file: rel, line: line.trim().slice(0, 180) });
      }
    };

    walk(this.root);
    return results;
  }

  appendInbox({ profile, sender, source, command, rawText }) {
    const filePath = this.inboxAbsPath;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '# Bot Inbox\n\n', 'utf8');
    }

    const now = new Date().toISOString();
    const block = [
      `## ${now}`,
      '',
      `- profile: ${profile}`,
      `- sender: ${sender}`,
      `- source: ${source}`,
      `- command: ${command}`,
      '',
      '```text',
      rawText.trim(),
      '```',
      '',
    ].join('\n');

    fs.appendFileSync(filePath, block, 'utf8');
    return path.relative(this.root, filePath);
  }
}

module.exports = { KnowledgeRepo };
