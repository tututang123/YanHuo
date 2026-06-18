# Client Tool Index

Record all client editing tools here. Put actual tool files in:

```text
private/dnf-70/client-tools
```

Large tools or third-party executables should stay local only. This file records where they are and how to use them.

## Tools

| Tool Name | Local Path | Purpose | Input | Output | How to Run | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| PVF Utility 2020 | `D:\PVFUTility2020\PVFUTility2020\pvfUtility.exe` | Edit DNF client `Script.pvf` data | `Script.pvf` | Modified `Script.pvf` | Windows EXE, double-click to open | Main client script/PVF editor. Open package from `文件(F)` -> `打开封包`. |
| Tofu Encyclopedia 2.5 | `C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\豆腐2.5.exe` | Reference DNF data while editing | Built-in data/reference files | Reference information | Windows EXE, double-click to open | Use for checking item/skill/dungeon information |

## Current Client Files

| File | Local Path | Purpose | Notes |
| --- | --- | --- | --- |
| Script.pvf | `C:\Users\tutut\Desktop\70Release\91\yuan\Script.pvf` | Current client script package | Back up before modifying |

## Local PVF Work Folders

| Folder | Local Path | Purpose |
| --- | --- | --- |
| PVF export | `private/dnf-70/client-workspace/pvf-export` | Full exported `Script.pvf` contents |
| PVF modified | `private/dnf-70/client-workspace/pvf-modified` | Files modified by Codex |
| PVF import ready | `private/dnf-70/client-workspace/pvf-import-ready` | Changed files prepared for PVF Utility import |
| PVF original backup | `private/dnf-70/client-backups/pvf-original` | Original `Script.pvf` backups |

## Tool Requirements

### PVF Utility 2020

- Runtime needed: Windows desktop environment
- Version: 2020.2.7.0
- .NET requirement: .NET Framework 4.8
- Encoding: TBD
- Admin rights needed: unknown
- Command line support: unknown
- Launch method: double-click `pvfUtility.exe`
- Open package: click menu `文件(F)` -> `打开封包` -> choose `Script.pvf`
- Export/import workflow: export full package to local files, modify selected files, then import changed files back into PVF Utility
- Built-in server: starts on port `27000`, supports third-party access
- Known limitations: TBD after first real edit

### Tofu Encyclopedia 2.5

- Runtime needed: Windows desktop environment
- Version: 2.5
- Encoding: TBD
- Admin rights needed: unknown
- Launch method: double-click `豆腐2.5.exe`
- Known limitations: reference tool only, not the primary editor

## Missing Information To Fill Later

- How to search specific client files inside PVF.
- Exact menu name for exporting the whole package.
- Exact menu name for importing changed files.
- Exact menu name for saving/repacking `Script.pvf`.
- Whether PVF Utility creates backup files automatically.
- Which PVF paths map to skills, items, NPCs, dungeons, UI text, and quests.
