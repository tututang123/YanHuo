# Client Change Workflow

Use this workflow for every client-side change.

## 1. Define Change

- Feature/change name:
- Why:
- Expected behavior:
- Target client version:

## 2. Locate Files

Check:

```text
09-client-modding/file-maps/
```

Open PVF package:

```text
PVF Utility -> 文件(F) -> 打开封包 -> Script.pvf
```

If direct editing is unclear, use the export/edit/import workflow:

```text
PVF Utility exports full package
Codex edits selected exported files
PVF Utility imports changed files
```

Record:

- original file path
- extracted file path
- related config/script/resource files
- encoding or format

## 3. Backup

Back up original files to:

```text
private/dnf-70/client-backups/YYYYMMDD-change-name/
```

## 4. Modify

Work only inside:

```text
private/dnf-70/client-workspace/
```

## 5. Verify

- Client starts normally:
- Feature works:
- No obvious UI/resource error:
- Server compatibility checked:
- Rollback tested:

## 6. Record Patch

Create a patch note under:

```text
09-client-modding/patches/
```
