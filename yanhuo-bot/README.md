# YanHuo Bot

Personal DingTalk bot platform for the YanHuo knowledge repository.

## What it does

- Receives DingTalk messages
- Sends every accepted message to Codex
- Returns the Codex command and final reply
- Runs against the git-managed knowledge worktree

## Install

```bash
cd yanhuo-bot
npm install
```

## Run

```bash
set YANHUO_BOT_CONFIG=./config/bots.json
set YANHUO_KNOWLEDGE_ROOT=/root/yanhuo-knowledge
set YANHUO_DINGTALK_CLIENT_ID=...
set YANHUO_DINGTALK_CLIENT_SECRET=...
set YANHUO_CODEX_BIN=/root/node16/bin/codex
npm start
```

## Expected behavior

For every DingTalk message, the bot will:

1. Build a Codex task prompt
2. Run `codex exec` in the knowledge repo
3. Reply with the exact command and the Codex result

## Notes

- Keep Codex auth and DingTalk secrets in runtime env only
- The bot uses `/root/yanhuo-knowledge` on the server
