# 日志分析自动化计划

## 目标

把当前手动检查异常通关记录的流程，改造成可重复执行的工具化流程。

## 当前输入

- 服务器日志目录：`/home/neople/game/log/siroco11`
- 日志文件：`*.history`
- 本地下载目录：`C:\Users\tutut\Desktop\fsdownload`
- 本地分析目录：`D:\log20220802`
- 现有脚本：
  - `moveLogFile.py`
  - `checktgjlAll.py.py`

## 建议流程

1. 用带时间戳的文件名打包服务器日志。
2. 下载日志包到本地。
3. 解压到按日期区分的本地目录。
4. 规范化日志文件位置。
5. 用日期参数运行分析脚本。
6. 生成报告文件。
7. 保存可疑记录，方便后续复核。

## 建议输出目录

```text
D:\log20220802\runs\YYYY-MM-DD\
├─ raw\
├─ extracted\
├─ processed\
└─ reports\
```

## 报告字段

| 字段 | 含义 |
| --- | --- |
| review_date | 检查日期 |
| player_id | 玩家 ID，如果有 |
| character_name | 角色名，如果有 |
| dungeon | 副本名 |
| clear_time | 通关时间或日志时间 |
| reason | 为什么可疑 |
| source_file | 原始日志文件 |
| status | pending / confirmed / ignored |

## 下一步开发任务

- [ ] 阅读 `moveLogFile.py` 并记录作用。
- [ ] 阅读 `checktgjlAll.py.py` 并记录输入输出。
- [ ] 把日期处理改成命令行参数。
- [ ] 日志包使用带时间戳的命名。
- [ ] 生成 Markdown 或 CSV 报告。
- [ ] 添加排查历史表。

