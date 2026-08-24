# YanHuo Bot Server Deploy

## Goal

Run `yanhuo-bot` on the DNF server so DingTalk messages are handed to Codex on the server-side knowledge worktree.

## Layout

- bot repo: `/root/yanhuo-bot`
- knowledge repo: `/root/yanhuo-knowledge`
- bot state: `/root/yanhuo-bot/state`

## One-time setup

```bash
cd /root
git clone <your-bot-repo-remote> yanhuo-bot
cd /root/yanhuo-bot
npm install
```

## Runtime env

Set these at runtime or in a root-only env file:

```bash
YANHUO_BOT_CONFIG=/root/yanhuo-bot/config/bots.json
YANHUO_KNOWLEDGE_ROOT=/root/yanhuo-knowledge
YANHUO_DINGTALK_CLIENT_ID=...
YANHUO_DINGTALK_CLIENT_SECRET=...
YANHUO_CODEX_BIN=/root/node16/bin/codex
YANHUO_CODEX_SANDBOX=workspace-write
```

Also make sure Codex is authenticated on the server. `codex doctor` must show a valid auth state before the bot can execute tasks.

## Codex proxy

If the server uses the `modrouter` provider, write the Codex config under `~/.codex/config.toml`:

```toml
model_provider = "my_codex"
model = "gpt-5.5"
model_reasoning_effort = "high"
disable_response_storage = true

[model_providers.my_codex]
name = "my_codex"
base_url = "https://api.modrouter.top/v1"
wire_api = "responses"
requires_openai_auth = true
```

Then place the OpenAI-compatible key in `~/.codex/auth.json` as `OPENAI_API_KEY`.

## Start

```bash
cd /root/yanhuo-bot
npm start
```

## Behavior

1. DingTalk message arrives in the bot profile.
2. The bot builds a Codex prompt from that message.
3. The bot runs `codex exec` in `/root/yanhuo-knowledge`.
4. The bot replies with the Codex command and final result.

## Update

```bash
cd /root/yanhuo-bot
git pull --ff-only
npm install
```

Restart the service after pulling changes.

## Codex auth

If the server has no Codex credentials, run `codex login` on the server or provide a supported API key env var before starting the bot.
