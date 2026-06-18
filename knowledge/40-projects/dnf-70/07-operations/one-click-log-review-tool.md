# 一键日志排查工具 One-Click Log Review Tool

这里说明本地一键 DNF 日志排查工具。

## 工具位置

工具只保存在本地，不上传 Git：

```text
private/dnf-70/tools/dnf-log-review.js
```

## 运行命令

在仓库根目录执行：

```powershell
node private\dnf-70\tools\dnf-log-review.js
```

## 工具会做什么

1. 从 `private/dnf-70/server-access.template.md` 读取服务器连接信息。
2. 通过 SSH 连接服务器。
3. 列出 `/home/neople/game/log/siroco11` 下的 `.history` 日志。
4. 只选择稳定且没有处理过的日志。
5. 在服务器上打包选中的日志。
6. 下载到 `private/dnf-70/log-runs/<run-id>`。
7. 本地解压日志。
8. 分析 `DungeonLeave` 和 `DungeonClearInfo`。
9. 生成 Markdown 和 CSV 报告。
10. 把已处理文件记录到本地状态文件。

## 如何避免重复分析

工具会把已处理的日志元数据记录到：

```text
private/dnf-70/state/processed-history.json
```

每个日志会记录：

- 文件名
- 文件大小
- 修改时间
- 运行 ID
- 处理时间

下次运行时，如果文件名、大小、修改时间都一致，就会自动跳过，不会重复分析。

## 跳过正在写入的日志

默认会跳过最近 70 分钟内修改过的日志。

原因：当前小时日志可能还在写，太早分析会导致重复处理不完整日志。

如果需要调整：

```powershell
node private\dnf-70\tools\dnf-log-review.js --stable-minutes 10
```

如果明确要包含最近日志：

```powershell
node private\dnf-70\tools\dnf-log-review.js --include-active
```

## 强制全量重跑

只有在明确想重新分析所有稳定日志时使用：

```powershell
node private\dnf-70\tools\dnf-log-review.js --full
```

## 报告位置

每次运行会生成：

```text
private/dnf-70/log-runs/<run-id>/reports/dungeon-log-review-report.md
private/dnf-70/log-runs/<run-id>/reports/dungeon-leave-summary.csv
```

## 可疑规则

- `single_file_leave>30`：同一 UID 在单个小时日志中出现超过 30 条 `DungeonLeave`。
- `total_leave>=100`：同一 UID 在本次运行中至少 100 条 `DungeonLeave`。
- `many_hours_active`：同一 UID 跨多个小时日志高频出现。

这些只是初筛规则。处理玩家前，必须人工复核详细日志。

