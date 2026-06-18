# PVF 导出、修改、导入流程

## 目标

用 PVF Utility 把完整 `Script.pvf` 导出成普通文件。然后由 Codex 分析和修改其中的目标文件，最后再把修改后的文件导入回 PVF。

这是目前推荐流程，因为 PVF Utility 是 Windows 图形界面工具，暂时没有确认可用的自动化 API。

## 本地目录

```text
private/dnf-70/client-workspace/pvf-export        # 完整 PVF 导出文件
private/dnf-70/client-workspace/pvf-modified      # Codex 修改后的文件副本
private/dnf-70/client-workspace/pvf-import-ready  # 准备导入回 PVF Utility 的文件
private/dnf-70/client-backups/pvf-original        # 原始 Script.pvf 备份
```

## 源 PVF 文件

```text
C:\Users\tutut\Desktop\70Release\91\yuan\Script.pvf
```

## 推荐流程

### 1. 备份 Script.pvf

任何改动前，先把原始 PVF 复制到：

```text
private/dnf-70/client-backups/pvf-original/
```

建议使用带日期的文件名：

```text
Script-20260619-before-change.pvf
```

### 2. 打开 Script.pvf

在 PVF Utility 里：

```text
文件(F) -> 打开封包 -> 选择 Script.pvf
```

### 3. 导出完整包

使用 PVF Utility 的导出/提取功能，把整个包导出到：

```text
private/dnf-70/client-workspace/pvf-export/
```

保持导出的目录结构，不要改名、不要移动内部路径。

### 4. 让 Codex 分析

告诉 Codex 你要改什么功能。

Codex 会读取：

```text
private/dnf-70/client-workspace/pvf-export/
```

然后把修改后的副本放到：

```text
private/dnf-70/client-workspace/pvf-modified/
```

### 5. 准备导入文件

Codex 会把“真正需要导入”的文件复制到：

```text
private/dnf-70/client-workspace/pvf-import-ready/
```

导入目录必须保持 PVF 内部原始相对路径。

例子：

```text
private/dnf-70/client-workspace/pvf-import-ready/skill/swordmanskill.lst
```

### 6. 导入修改后的文件

在 PVF Utility 里，把 `pvf-import-ready` 里的文件导入回去。

导入时确认覆盖的是相同内部路径。

### 7. 保存 PVF

用 PVF Utility 保存或重新打包修改后的 `Script.pvf`。

如果工具允许，先另存一个新文件：

```text
Script-modified-YYYYMMDD.pvf
```

### 8. 测试

先用本地客户端测试，不要直接替换正式客户端文件。

检查：

- 客户端能正常启动
- 修改功能生效
- UI 文本正常
- 没有缺资源报错
- 服务端/客户端兼容

## Codex 补丁记录

每次改动都要在这里记录：

```text
knowledge/40-projects/dnf-70/09-client-modding/patches/
```

记录内容包括：

- 修改目标
- 修改文件
- 原始路径
- 修改后路径
- 导入准备路径
- 测试结果
- 回滚方法

## 重要规则

- 不要直接修改 `pvf-export`，除非明确把它当作工作副本。
- 尽量保持原始导出目录干净。
- 修改文件放 `pvf-modified`。
- 准备导入的文件放 `pvf-import-ready`。
- 不要把 PVF 导出文件、修改后的客户端文件上传 GitHub。
- 不要改变文件编码、换行、缩进、字段分隔符、字体相关格式或无关格式。
- 不要对 PVF 导出文件运行格式化工具。
- 只做最小必要改动。

详细规则见：

```text
09-client-modding/format-safety-rules.md
```

