# 客户端工具索引 Client Tool Index

这里记录客户端编辑工具。实际工具文件放在本地私密目录：

```text
private/dnf-70/client-tools
```

大型工具、第三方 exe、客户端文件不要上传 GitHub。这个文件只记录工具在哪里、做什么、怎么用。

## 工具清单

| 工具名称 | 本地路径 | 用途 | 输入 | 输出 | 运行方式 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| PVF Utility 2020 | `D:\PVFUTility2020\PVFUTility2020\pvfUtility.exe` | 编辑 DNF 客户端 `Script.pvf` 数据 | `Script.pvf` | 修改后的 `Script.pvf` | Windows EXE，双击打开 | 主要 PVF 编辑器。打开封包：`文件(F)` -> `打开封包`。 |
| 豆腐百科 2.5 / Tofu Encyclopedia 2.5 | `C:\Users\tutut\Downloads\豆腐百科2.5\豆腐百科2.5\豆腐2.5.exe` | 修改时查询 DNF 数据资料 | 内置资料库 | 参考信息 | Windows EXE，双击打开 | 用于查询道具、技能、副本等资料，不是主要编辑器。 |

## 当前客户端文件

| 文件 | 本地路径 | 用途 | 备注 |
| --- | --- | --- | --- |
| Script.pvf | `C:\Users\tutut\Desktop\70Release\91\yuan\Script.pvf` | 当前客户端脚本包 | 修改前必须备份 |

## 本地 PVF 工作目录

| 目录 | 本地路径 | 用途 |
| --- | --- | --- |
| PVF 导出目录 | `private/dnf-70/client-workspace/pvf-export` | 完整导出的 `Script.pvf` 内容 |
| PVF 修改目录 | `private/dnf-70/client-workspace/pvf-modified` | Codex 修改后的文件副本 |
| PVF 导入准备目录 | `private/dnf-70/client-workspace/pvf-import-ready` | 准备导入回 PVF Utility 的改动文件 |
| PVF 原始备份目录 | `private/dnf-70/client-backups/pvf-original` | 原始 `Script.pvf` 备份 |

## 工具要求

### PVF Utility 2020

- 运行环境：Windows 桌面环境
- 版本：2020.2.7.0
- .NET 要求：.NET Framework 4.8
- 编码：待确认
- 是否需要管理员权限：未知
- 是否支持命令行：未知
- 启动方式：双击 `pvfUtility.exe`
- 打开封包：点击 `文件(F)` -> `打开封包` -> 选择 `Script.pvf`
- 导出/导入流程：先导出完整包为文件，修改目标文件，再导入修改后的文件
- 内置服务：启动在 `27000` 端口，支持第三方访问，但接口路径尚未确认
- 已知限制：等待第一次真实修改后补充

### 豆腐百科 2.5

- 运行环境：Windows 桌面环境
- 版本：2.5
- 编码：待确认
- 是否需要管理员权限：未知
- 启动方式：双击 `豆腐2.5.exe`
- 已知限制：只作为资料查询工具，不作为主要编辑工具

## 后续需要补充的信息

- 如何在 PVF 内搜索具体文件。
- 整包导出的准确菜单名称。
- 导入改动文件的准确菜单名称。
- 保存/重新打包 `Script.pvf` 的准确菜单名称。
- PVF Utility 是否自动生成备份。
- 哪些 PVF 路径对应技能、道具、NPC、副本、UI 文本、任务。

