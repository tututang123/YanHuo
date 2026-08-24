# Architecture

## Current Understanding

No final architecture has been locked yet.

## Possible Directions

- Data archive only
- Extraction and normalization tools
- Game data editor
- Web knowledge base
- Local development server
- Client/server research environment
- DingTalk bot platform

## Components

| Component | Role | Status | Notes |
| --- | --- | --- | --- |
| Data archive | Store and classify raw source material | planned | Start from `00-inbox` |
| Data model | Normalize jobs, skills, dungeons, gear, and tasks | planned | Define schema later |
| Development area | Track implementation work | planned | Use `04-development` |
| DingTalk bot platform | Expose chat commands for the knowledge repo | planned | Server-side, git-backed |

## DingTalk Bot Platform

The YanHuo personal DingTalk bot is a server-side command surface for the git-managed knowledge repo.

### Components

| Component | Role |
| --- | --- |
| Adapter layer | Connects a bot profile to a DingTalk runtime |
| Codex executor | Runs the user's task against the knowledge repo |
| Command router | Turns chat text into safe actions |
| Repo helper | Reads status, searches docs, and writes inbox entries |
| Profile queue | Serializes one bot profile without blocking others |
| Config file | Stores non-secret bot settings and profile flags |

### Rules

- Keep `/root/yanhuo-knowledge` as the source of truth on the server.
- Route all actions through named commands.
- Give each bot profile its own worker and queue.
- Send accepted messages to Codex before replying.
- Write-enabled commands append to `knowledge/40-projects/dnf-70/04-development/bot-inbox.md`.
