# Log Analysis Automation Plan

## Goal

Turn the current manual abnormal dungeon-clear log review workflow into a repeatable tool-assisted process.

## Current Inputs

- Server log directory: `/home/neople/game/log/siroco11`
- Log files: `*.history`
- Local download folder: `C:\Users\tutut\Desktop\fsdownload`
- Local analysis folder: `D:\log20220802`
- Existing scripts:
  - `moveLogFile.py`
  - `checktgjlAll.py.py`

## Proposed Workflow

1. Package server logs with a timestamped file name.
2. Download package to local machine.
3. Extract package into a dated local folder.
4. Normalize log file locations.
5. Run analysis script with a date parameter.
6. Generate a report file.
7. Save suspicious records for follow-up.

## Proposed Folder Output

```text
D:\log20220802\runs\YYYY-MM-DD\
├─ raw\
├─ extracted\
├─ processed\
└─ reports\
```

## Report Fields

| Field | Meaning |
| --- | --- |
| review_date | Date being checked |
| player_id | Player identifier if available |
| character_name | Character name if available |
| dungeon | Dungeon name |
| clear_time | Clear time or timestamp |
| reason | Why the record is suspicious |
| source_file | Original log file |
| status | pending / confirmed / ignored |

## Next Development Tasks

- [ ] Read `moveLogFile.py` and document what it does.
- [ ] Read `checktgjlAll.py.py` and document input/output format.
- [ ] Refactor date handling into a command-line parameter.
- [ ] Add timestamped log package naming.
- [ ] Generate Markdown or CSV reports.
- [ ] Add a review history table.

