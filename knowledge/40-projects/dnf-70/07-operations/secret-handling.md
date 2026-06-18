# Secret Handling

Server passwords, SSH private keys, tokens, database passwords, and other access credentials must not be stored in Git.

## Local-Only Location

Use this local ignored folder for sensitive notes:

```text
private/dnf-70/
```

The `private/` folder is ignored by `.gitignore`.

## Recommended Files

```text
private/dnf-70/server-access.md
private/dnf-70/local-paths.md
```

## Rules

- Do not write passwords in `knowledge/`.
- Do not commit `.pem`, `.key`, `.env`, or credential text files.
- If a password was accidentally written to a Git-tracked file, remove it before committing.
- If a password was already pushed, rotate the password immediately.

