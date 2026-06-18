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
- How to export modified files.
- How to save/repack `Script.pvf`.
- Whether PVF Utility creates backup files automatically.
- Which PVF paths map to skills, items, NPCs, dungeons, UI text, and quests.
