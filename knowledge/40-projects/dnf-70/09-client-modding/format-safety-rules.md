# PVF Format Safety Rules

These rules are mandatory for any DNF 70 PVF exported-file modification.

## Core Rule

Do not change file encoding, font-related text format, line endings, indentation style, field separators, or unrelated formatting.

PVF exported files may be sensitive to exact byte layout and parser expectations. Treat every edit as a minimal patch.

## What Codex Must Do

- Preserve the original file path.
- Preserve the original file encoding whenever possible.
- Preserve original line endings whenever possible.
- Preserve original indentation and spacing style.
- Preserve original field order.
- Modify only the smallest necessary text range.
- Never run a formatter on exported PVF files.
- Never normalize all files to UTF-8 automatically.
- Never bulk rewrite files for style.
- Work on copies under `pvf-modified` or `pvf-import-ready`, not directly on `pvf-export`.

## Required Workflow

1. Read the target file.
2. Identify the smallest edit needed.
3. Copy the original file from `pvf-export` to `pvf-modified`, preserving relative path.
4. Apply the minimal change to the copied file.
5. Copy only changed files to `pvf-import-ready`, preserving relative path.
6. Record changed files in a patch note.

## Local Folders

```text
private/dnf-70/client-workspace/pvf-export        # original exported files, keep clean
private/dnf-70/client-workspace/pvf-modified      # edited copies
private/dnf-70/client-workspace/pvf-import-ready  # changed files for PVF Utility import
```

## Do Not

- Do not edit every file in a folder.
- Do not convert Chinese text encoding.
- Do not replace tabs/spaces globally.
- Do not re-save through tools that may rewrite the whole file unless required.
- Do not change font names, UI font tags, or display text format unless that is the explicit goal.

## If Encoding Is Unclear

Stop and inspect the file first. Prefer byte-preserving or targeted replacement methods over full-file rewriting.

