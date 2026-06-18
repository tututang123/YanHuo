# Client Modding Workspace

This folder stores documentation for DNF 70 client-side changes.

Do not put client binaries, tool executables, private patches, or large asset files here. Put those under `private/dnf-70/`.

## Local Private Folders

```text
private/dnf-70/client-tools      # editor tools, unpackers, packers, viewers
private/dnf-70/client-workspace  # extracted client files and working copies
private/dnf-70/client-backups    # original client backups before modification
```

## Git-Tracked Documentation

- `tool-index.md`: tools and what each tool is used for.
- `client-change-workflow.md`: standard change process.
- `api/`: client editing APIs, script APIs, packet/API notes, command references.
- `file-maps/`: which client files control which feature.
- `patches/`: patch records and modification history.
- `runbooks/`: step-by-step operation docs.

## Standard Change Flow

1. Record the change request in `patches/`.
2. Identify target files in `file-maps/`.
3. Confirm required tool in `tool-index.md`.
4. Back up original client files to `private/dnf-70/client-backups`.
5. Modify files in `private/dnf-70/client-workspace`.
6. Record exact changes, changed files, commands, and rollback method.
7. Test locally before using on live server/client.

## Safety Rules

- Never overwrite original client files without a backup.
- Keep binary files and extracted client resources out of Git.
- Record checksums for original and modified files when possible.
- Keep each change small and reversible.
- For PVF exported files, preserve original encoding, line endings, indentation, separators, and font-related text format.
- Never run automatic formatters on PVF exported files.
