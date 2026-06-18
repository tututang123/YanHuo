# Export, Edit, and Import PVF Files

## Goal

Use PVF Utility to export the full `Script.pvf` package into normal files, let Codex analyze and modify selected files, then import modified files back into the PVF package.

This is the recommended workflow because PVF Utility is a Windows GUI tool and direct API automation is not confirmed yet.

## Local Folders

```text
private/dnf-70/client-workspace/pvf-export        # full exported PVF files
private/dnf-70/client-workspace/pvf-modified      # files edited by Codex
private/dnf-70/client-workspace/pvf-import-ready  # files prepared for PVF Utility import
private/dnf-70/client-backups/pvf-original        # original Script.pvf backup
```

## Source PVF

```text
C:\Users\tutut\Desktop\70Release\91\yuan\Script.pvf
```

## Recommended Workflow

### 1. Back Up Script.pvf

Before any change, copy the original PVF to:

```text
private/dnf-70/client-backups/pvf-original/
```

Use a dated name, for example:

```text
Script-20260619-before-change.pvf
```

### 2. Open Script.pvf

In PVF Utility:

```text
文件(F) -> 打开封包 -> select Script.pvf
```

### 3. Export Full Package

Use PVF Utility's export/extract function to export the whole package into:

```text
private/dnf-70/client-workspace/pvf-export/
```

Keep the folder structure exactly as exported.

### 4. Ask Codex To Analyze

Tell Codex what feature you want to change.

Codex will inspect files under:

```text
private/dnf-70/client-workspace/pvf-export/
```

Then Codex will create modified copies under:

```text
private/dnf-70/client-workspace/pvf-modified/
```

### 5. Prepare Import Files

Codex will copy only changed files into:

```text
private/dnf-70/client-workspace/pvf-import-ready/
```

The import-ready folder should preserve the original PVF internal path.

Example:

```text
private/dnf-70/client-workspace/pvf-import-ready/skill/swordmanskill.lst
```

### 6. Import Modified Files

In PVF Utility, import the changed files from:

```text
private/dnf-70/client-workspace/pvf-import-ready/
```

Make sure imported files overwrite the matching internal paths.

### 7. Save PVF

Save or repack the modified `Script.pvf` with PVF Utility.

Use a new output file first if possible, for example:

```text
Script-modified-YYYYMMDD.pvf
```

### 8. Test

Test with a local client before replacing any live client file.

Check:

- client starts normally
- modified feature works
- related UI text is normal
- no missing resource error
- server/client compatibility is acceptable

## Codex Patch Record

Every change should have a patch record under:

```text
knowledge/40-projects/dnf-70/09-client-modding/patches/
```

The patch record should include:

- feature goal
- files changed
- original paths
- modified paths
- import-ready paths
- test result
- rollback method

## Important

- Do not edit files directly inside `pvf-export` unless intentionally treating it as a working copy.
- Keep original export clean when possible.
- Use `pvf-modified` and `pvf-import-ready` for generated changes.
- Do not upload exported PVF files or modified client files to GitHub.
- Do not change file encoding, line endings, indentation style, field separators, font-related text format, or unrelated formatting.
- Do not run formatters on exported PVF files.
- Apply only the smallest necessary edit.

See also:

```text
09-client-modding/format-safety-rules.md
```
