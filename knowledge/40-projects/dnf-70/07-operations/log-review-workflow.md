# 日志排查流程 Log Review Workflow

这里记录当前打包、下载、转移和分析游戏服务器日志的流程。

## 目的

检查服务器日志，判断玩家通关记录是否存在异常行为。

## 服务器日志目录

```text
/home/neople/game/log/siroco11
```

## 当前日志打包命令

```bash
zip /home/neople/game/log/siroco11/logs_backup.zip /home/neople/game/log/siroco11/*.history
```

## 服务器备份脚本

```text
/root/backuprelease.sh
```

当前记录：脚本生成的资源会下载到 `/tmp/`，之前是手动下载。

## 本地下载目录

```text
C:\Users\tutut\Desktop\fsdownload
```

## 本地分析目录

```text
D:\log20220802
```

## 之前的手动流程

1. 登录服务器。
2. 执行日志打包命令。
3. 下载日志包到 `C:\Users\tutut\Desktop\fsdownload`。
4. 解压下载的日志包。
5. 运行 `D:\log20220802\moveLogFile.py`。
6. 把日志文件移动到 `D:\log20220802`。
7. 运行 `D:\log20220802\checktgjlAll.py.py`。
8. 根据需要手动修改脚本里的日期。
9. 查看输出日志，检查玩家通关记录是否异常。

## 当前流程的问题

- 登录服务器和执行命令重复。
- 日志包名称固定，可能覆盖之前的包。
- 下载、解压、移动、分析分散在多个手动步骤。
- 日期靠修改 Python 源码，容易出错。
- 输出记录还没有统一报告格式。
- 服务器账号密码不能写进 Git。

## 改进方向

- 做成一键脚本：打包、下载、解压、移动、分析。
- 使用命令行日期参数，不再修改 Python 源码。
- 生成带日期的输出目录和报告。
- 区分原始日志、处理后日志和分析报告。
- 把异常记录保存成结构化表格，方便后续对比。

