# Log Review Workflow

This file records the current workflow for packaging, downloading, moving, and analyzing game server logs.

## Purpose

Review server logs and check whether player dungeon clear records contain abnormal behavior.

## Server Log Directory

```text
/home/neople/game/log/siroco11
```

## Current Log Packaging Command

```bash
zip /home/neople/game/log/siroco11/logs_backup.zip /home/neople/game/log/siroco11/*.history
```

## Existing Server Backup Script

```text
/root/backuprelease.sh
```

Current note: generated resources are downloaded to `/tmp/`, then downloaded manually.

## Local Download Directory

```text
C:\Users\tutut\Desktop\fsdownload
```

## Local Analysis Directory

```text
D:\log20220802
```

## Current Manual Process

1. Log in to the server.
2. Run the log packaging command.
3. Download the packaged logs to `C:\Users\tutut\Desktop\fsdownload`.
4. Extract the downloaded log package.
5. Run `D:\log20220802\moveLogFile.py`.
6. Move the log files into `D:\log20220802`.
7. Run `D:\log20220802\checktgjlAll.py.py`.
8. Change the date inside the script as needed.
9. Review output logs and check for abnormal player dungeon clear records.

## Problems in the Current Process

- Server login and manual command execution are repetitive.
- Log package name is fixed, which can overwrite earlier packages.
- Download, extraction, move, and analysis are separate manual steps.
- Date is changed by editing the script, which is error-prone.
- Output records do not yet have a standard review format.
- Sensitive server credentials must not be stored in Git.

## Improvement Direction

- Create a one-click local script to package, download, extract, move, and analyze logs.
- Use command-line date parameters instead of editing Python source code.
- Generate dated output folders and reports.
- Keep raw logs, processed logs, and review reports separate.
- Record abnormal cases in a structured table for later comparison.

