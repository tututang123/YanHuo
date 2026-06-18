# One-Click Log Review Tool

This document describes the local-only one-click DNF log review tool.

## Tool Location

The tool is stored locally and is not uploaded to Git:

```text
private/dnf-70/tools/dnf-log-review.js
```

## Run Command

From the repository root:

```powershell
node private\dnf-70\tools\dnf-log-review.js
```

## What It Does

1. Reads server access from `private/dnf-70/server-access.template.md`.
2. Connects to the server with SSH.
3. Lists remote `.history` log files under `/home/neople/game/log/siroco11`.
4. Selects only logs that are stable and not already processed.
5. Packages selected logs on the server.
6. Downloads the package to `private/dnf-70/log-runs/<run-id>`.
7. Extracts logs locally.
8. Analyzes `DungeonLeave` and `DungeonClearInfo` records.
9. Generates Markdown and CSV reports.
10. Records processed files in local state.

## Duplicate Prevention

The tool stores processed log metadata locally:

```text
private/dnf-70/state/processed-history.json
```

Each processed remote file is recorded with:

- filename
- size
- modification time
- run ID
- processed time

On the next run, the tool skips files with the same filename, size, and modification time.

## Active Log Protection

By default, the tool skips files modified within the last 70 minutes.

Reason: the current hour's log may still be written, and analyzing it too early can cause repeated partial analysis.

Override if needed:

```powershell
node private\dnf-70\tools\dnf-log-review.js --stable-minutes 10
```

Force including active files:

```powershell
node private\dnf-70\tools\dnf-log-review.js --include-active
```

## Full Reanalysis

Use this only when you intentionally want to reprocess stable logs:

```powershell
node private\dnf-70\tools\dnf-log-review.js --full
```

## Reports

Each run creates:

```text
private/dnf-70/log-runs/<run-id>/reports/dungeon-log-review-report.md
private/dnf-70/log-runs/<run-id>/reports/dungeon-leave-summary.csv
```

## Suspicion Rules

- `single_file_leave>30`: one UID has more than 30 `DungeonLeave` records in a single hourly log.
- `total_leave>=100`: one UID has at least 100 `DungeonLeave` records in the run.
- `many_hours_active`: one UID appears across many hourly logs with high total activity.

These are first-pass detection rules. Confirm suspicious UIDs manually before taking action.

