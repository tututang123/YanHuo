# Secret Handling

Server passwords, SSH keys, tokens, and database credentials must not be stored in git.

## Local secret location

Keep secret material here:

```text
private/dnf-70/
```

`private/` is ignored by git and will not be uploaded.

## Recommended files

```text
private/dnf-70/server-access.md
private/dnf-70/local-paths.md
```

## Rules

- Do not write passwords in `knowledge/`.
- Do not commit `.pem`, `.key`, `.env`, or any file containing credentials.
- If a secret lands in a tracked file, remove it before committing.
- If a secret has already been pushed, rotate it immediately.

## Bot secrets

- DingTalk Stream client ID/secret and any signing secrets stay in local env, not in tracked files.
- Codex CLI auth and any local session tokens stay in local env, not in tracked files.
- Per-profile secrets belong in `private/dnf-70/` or runtime env.
- The bot config file may name env vars, but must not contain token values.
- Do not store cookies, QR sessions, login secrets, or callback secrets in the knowledge repo.
