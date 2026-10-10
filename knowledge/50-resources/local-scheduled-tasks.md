# 本机计划任务

这里记录本机 Windows 计划任务，统一用脚本初始化。脚本会先检查任务是否已经存在，存在就跳过，不会重复创建。

## 统一启动脚本

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File E:\zhoushuwen\YanHuo\tools\scheduled-tasks\start-local-tasks.ps1
```

## 当前任务

### DNF数据库自动备份

- 用途：定时执行 DNF 数据库备份。
- 频率：每 30 分钟一次。
- 命令：

```powershell
py E:\dnf\yanhuo70\backup.py
```

常用维护命令：

```powershell
schtasks /query /tn "DNF数据库自动备份" /v /fo list
schtasks /delete /tn "DNF数据库自动备份" /f
schtasks /create /tn "DNF数据库自动备份" /tr "py E:\dnf\yanhuo70\backup.py" /sc minute /mo 30 /f
```

### YanHuo GitHub Radar

- 用途：每天扫描 GitHub 热门项目，并把报告写入 YanHuo 知识体系。
- 频率：每天 09:30。
- 输出目录：

```text
E:\zhoushuwen\YanHuo\knowledge\50-resources\github-radar
```

手动运行：

```powershell
cd E:\zhoushuwen\YanHuo\tools\github-radar
npm run scan
```
