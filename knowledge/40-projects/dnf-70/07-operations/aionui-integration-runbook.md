# AionUi Integration Runbook

## Goal

Use AionUi as the next YanHuo assistant entrypoint for DNF-70 operations.

The target flow is:

```text
DingTalk @bot -> AionUi Channel -> AionUi assistant/session -> Codex or Claude Code -> /root/yanhuo-knowledge
```

This runbook stores only the repeatable setup process and secret names. Real tokens, API keys, cookies, and passwords stay outside git.

## Why AionUi

AionUi is an open-source Cowork app with a built-in agent engine. It also supports WebUI remote access, messaging channels, and external CLI agents.

Useful official references:

- Repository: `https://github.com/iofficeai/aionui`
- Getting started: `https://github.com/iOfficeAI/AionUi/wiki/Getting-Started`
- WebUI and Channels: `https://github.com/iOfficeAI/AionUi/wiki/WebUI-Configuration-Guide`
- DingTalk bot setup: `https://github.com/iOfficeAI/AionUi/wiki/DingTalk-Bot-Setup-Guide`
- LLM configuration: `https://github.com/iOfficeAI/AionUi/wiki/LLM-Configuration`
- Multi-Agent / ACP setup: `https://github.com/iOfficeAI/AionUi/wiki/ACP-Setup`
- FAQ Chinese: `https://github.com/iOfficeAI/AionUi/wiki/FAQ-Chinese`

## Deployment Model

Run AionUi beside the current `yanhuo-bot.service` first.

- Keep `yanhuo-bot.service` enabled until AionUi has passed real DingTalk tests.
- Give AionUi its own DingTalk bot application if possible.
- If reusing the current DingTalk bot credentials, stop `yanhuo-bot.service` before starting the AionUi channel to avoid duplicate replies.

Recommended server paths:

```text
/root/yanhuo-knowledge                # tracked knowledge repo
/root/aionui                          # optional install/work directory
/root/.config/AionUi                  # AionUi Linux local data
/root/private/dnf-70/aionui.env       # secrets, not tracked
/etc/systemd/system/aionui-webui.service
```

## Secret Inventory

Create this file on the server:

```bash
mkdir -p /root/private/dnf-70
chmod 700 /root/private /root/private/dnf-70
cp /root/yanhuo-knowledge/knowledge/40-projects/dnf-70/07-operations/aionui.env.example /root/private/dnf-70/aionui.env
chmod 600 /root/private/dnf-70/aionui.env
```

Fill `/root/private/dnf-70/aionui.env` with real values.

Required for DingTalk:

```text
AIONUI_DINGTALK_CLIENT_ID
AIONUI_DINGTALK_CLIENT_SECRET
```

Required for OpenRouter or compatible provider:

```text
AIONUI_OPENROUTER_API_KEY
```

Optional when using Codex/Claude Code as external agents:

```text
OPENAI_API_KEY
ANTHROPIC_API_KEY
CODEX_HOME
```

Do not commit the filled env file.

## Install AionUi

Official install options may change. Check the latest release page before installing:

```text
https://github.com/iOfficeAI/AionUi/releases
```

For Linux, official docs list `.deb` or `.AppImage` downloads. Prefer `.deb` on the DNF server when available, because systemd paths are easier to keep stable.

After install, confirm the binary exists:

```bash
command -v AionUi
AionUi --help
```

If the binary name differs in the installed version, update the systemd `ExecStart` path below.

## WebUI Service

Create `/etc/systemd/system/aionui-webui.service`:

```ini
[Unit]
Description=AionUi WebUI Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root
EnvironmentFile=/root/private/dnf-70/aionui.env
ExecStart=/usr/bin/AionUi --webui --remote --no-sandbox
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start it:

```bash
systemctl daemon-reload
systemctl enable --now aionui-webui.service
systemctl status aionui-webui.service --no-pager -l
journalctl -u aionui-webui.service -n 80 --no-pager
```

If AionUi prints a generated WebUI password, record it only in `/root/private/dnf-70/aionui.env` or the local password manager.

To reset the password:

```bash
AionUi --resetpass
```

## Configure WebUI

Open AionUi WebUI from a trusted machine or tunnel.

Minimum setup:

1. Log in to WebUI.
2. Add `/root/yanhuo-knowledge` as the working project/workspace.
3. Configure one default assistant named `YanHuo DNF Ops`.
4. Set the assistant's working directory to `/root/yanhuo-knowledge`.
5. Add this assistant rule:

```text
你是 YanHuo DNF-70 运维和知识体系助手。
默认在 /root/yanhuo-knowledge 内工作。
不要把密钥、数据库密码、token 写入 knowledge/ 或 git。
涉及服务器修改时，先说明会执行什么命令和风险。
回复中文，结论先行。
```

## Configure LLM Provider

In AionUi:

```text
Settings -> Models -> Add Model
```

For OpenRouter:

```text
Platform: OpenRouter
API Key: value from AIONUI_OPENROUTER_API_KEY
Model: choose the intended model in AionUi UI
```

If using the existing ModRouter/NewAPI-compatible provider, add it as a custom OpenAI-compatible provider if AionUi's UI supports custom endpoints:

```text
Base URL: https://modrouter.top/v1
API Key: stored outside git
```

If the UI only exposes OpenRouter but not a custom base URL, use OpenRouter first for validation, then decide whether to keep the existing ModRouter route through Codex CLI instead.

## Configure External Agents

AionUi can auto-detect supported CLIs on `PATH`, including `codex` and `claude`.

Check on the server:

```bash
command -v codex || true
command -v claude || true
codex --version || true
claude --version || true
```

Codex:

```bash
codex doctor
```

Claude Code:

```bash
claude doctor
```

If a CLI is missing from the AionUi service environment but works in SSH, add the binary directory to the systemd service:

```ini
Environment=PATH=/opt/node16-official/bin:/usr/local/bin:/usr/bin:/bin
```

Then reload and restart:

```bash
systemctl daemon-reload
systemctl restart aionui-webui.service
```

## Configure DingTalk Channel

Prefer a new DingTalk robot app for AionUi testing.

DingTalk Open Platform:

1. Open `https://open.dingtalk.com/`.
2. Go to application development.
3. Create an internal enterprise robot application.
4. Copy AppKey/Client ID and AppSecret/Client Secret.
5. Set message reception to Stream mode.
6. Publish the robot.
7. Add the robot to the test group.

AionUi WebUI:

```text
Settings -> WebUI -> Channels -> Add Channel -> DingTalk
```

Fill in the DingTalk credentials from `/root/private/dnf-70/aionui.env`.

## Known DingTalk UI Fix

The AionUi DingTalk settings page originally hid `Pending Pairing Requests` whenever `Authorized Users` already existed.
That made it look like new users disappeared after the first approval.

Fix applied in the local AionUi source:

- File: `packages/desktop/src/renderer/components/settings/SettingsModal/contents/channels/DingTalkConfigForm.tsx`
- Change: render `Pending Pairing Requests` and `Authorized Users` as two independent sections
- Before: pending pairing section required `authorizedUsers.length === 0`
- After: both sections show whenever the DingTalk plugin is enabled

If the environment is rebuilt from source, re-apply this change before testing multi-user DingTalk approval.

## Cutover Plan

Phase 1: Parallel test.

- Keep `yanhuo-bot.service` running.
- Use a separate AionUi DingTalk bot.
- Test WebUI, model calls, repository access, and DingTalk replies.

Phase 2: Compare behavior.

Test messages:

```text
@AionUi机器人 help
@AionUi机器人 查看 /root/yanhuo-knowledge 的 git 状态
@AionUi机器人 查看本机服务器内存和磁盘情况
@AionUi机器人 在知识体系里搜索 角色栏扩张
@AionUi机器人 总结最近 DNF 运维文档有哪些待办
```

Phase 3: Replace current DingTalk bot only after AionUi is stable.

```bash
systemctl stop yanhuo-bot.service
systemctl disable yanhuo-bot.service
systemctl enable --now aionui-webui.service
```

Rollback:

```bash
systemctl stop aionui-webui.service
systemctl enable --now yanhuo-bot.service
```

## Backup and Restore

Back up these paths after AionUi works:

```text
/root/.config/AionUi
/root/private/dnf-70/aionui.env
/etc/systemd/system/aionui-webui.service
```

Do not store those backups in git unless secrets are removed.

Restore order on a new server:

1. Clone or pull `/root/yanhuo-knowledge`.
2. Install AionUi.
3. Restore `/root/private/dnf-70/aionui.env`.
4. Restore or recreate `aionui-webui.service`.
5. Restore `/root/.config/AionUi` if available.
6. Start service and validate WebUI.
7. Validate DingTalk Channel.
8. Validate Codex/Claude external agent detection.

## Validation Checklist

- `systemctl is-active aionui-webui.service` returns `active`.
- WebUI login works.
- AionUi can open `/root/yanhuo-knowledge`.
- Model test returns a normal answer.
- DingTalk Channel receives an `@` message.
- DingTalk Channel replies once, not twice.
- AionUi can see `codex` or `claude` if external agent mode is needed.
- No real secrets are present in `git status`, `git diff`, or files under `knowledge/`.

## Known Risks

- AionUi is a larger platform than the current custom bot; migration should be tested in parallel.
- Reusing the same DingTalk credentials while `yanhuo-bot.service` is running can cause duplicate replies.
- External CLI behavior depends on each CLI's own auth, permission mode, and installed version.
- Server GUI/headless behavior may differ by AionUi release; prefer official Linux packages and verify `--webui --remote`.
