# 使用 PVF Utility 打开 Script.pvf

## 目标

用 PVF Utility 2020 打开 DNF 70 客户端的 `Script.pvf`。

## 工具路径

```text
D:\PVFUTility2020\PVFUTility2020\pvfUtility.exe
```

## 目标文件

```text
C:\Users\tutut\Desktop\70Release\91\yuan\Script.pvf
```

## 操作步骤

1. 双击打开 `pvfUtility.exe`。
2. 在顶部菜单点击 `文件(F)`。
3. 点击 `打开封包`。
4. 选择 `C:\Users\tutut\Desktop\70Release\91\yuan\Script.pvf`。
5. 等待文件资源管理器加载出 PVF 内部文件。

## 已观察到的工具输出

```text
PVF Utility 版本：2020.2.7.0
需要 .NET Framework 4.8
HTTP 服务启动在 27000 端口，支持第三方访问
```

## 注意

- 修改前先备份 `Script.pvf`。
- 原始文件备份放在 `private/dnf-70/client-backups`。
- 改过的 PVF 内部路径要记录到 `09-client-modding/patches` 的补丁记录里。

