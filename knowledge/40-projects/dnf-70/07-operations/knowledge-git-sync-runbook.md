# Knowledge Git Sync Runbook

## Goal

Keep the YanHuo knowledge system on the DNF server as a git-managed working tree so other machines can sync the same content.

## Layout

- bare repo: `/root/yanhuo-knowledge.git`
- working tree: `/root/yanhuo-knowledge`

## One-time setup

```bash
yum -y install git
mkdir -p /root/yanhuo-knowledge.git
git init --bare /root/yanhuo-knowledge.git
git --git-dir=/root/yanhuo-knowledge.git symbolic-ref HEAD refs/heads/main
git clone /root/yanhuo-knowledge.git /root/yanhuo-knowledge
```

## Local sync

```bash
git remote add dnf-server ssh://root@202.189.5.187/root/yanhuo-knowledge.git
git push -u dnf-server main
```

## Daily sync

```bash
git add .
git commit -m "..."
git push origin main
git push dnf-server main
```

## Server sync

```bash
cd /root/yanhuo-knowledge
git pull --ff-only
```

## Bot usage

- config file: `yanhuo-bot/config/bots.json`
- write inbox: `knowledge/40-projects/dnf-70/04-development/bot-inbox.md`
- chat adapter: DingTalk Stream mode
- task executor: Codex CLI in the knowledge repo
- server deploy guide: `knowledge/40-projects/dnf-70/07-operations/yanhuo-bot-server-deploy.md`

Flow:

1. Read-only commands answer from the git worktree.
2. Write-enabled commands append to the inbox file.
3. A Codex task can update files in the working tree and summarize the result back to chat.
4. A human reviews and commits the git change unless auto-commit is enabled later.
5. If the worktree is stale, run `git pull --ff-only` before serving write commands.

## Constraints

- Keep secrets out of git.
- Do not store tokens in `knowledge/`.
- The bot must use the same cloned worktree as the rest of the knowledge system.
