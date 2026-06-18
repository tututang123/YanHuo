# 客户端修改流程 Client Change Workflow

每一次客户端改动都按这个流程走，方便回溯、测试和回滚。

## 1. 明确改动目标

- 功能/改动名称：
- 为什么要改：
- 期望效果：
- 目标客户端版本：

## 2. 定位文件

先查看：

```text
09-client-modding/file-maps/
```

打开 PVF 包：

```text
PVF Utility -> 文件(F) -> 打开封包 -> Script.pvf
```

如果不确定怎么直接编辑，就用导出/修改/导入流程：

```text
PVF Utility 导出整个包
Codex 修改导出的目标文件
PVF Utility 再导入修改后的文件
```

需要记录：

- 原始文件路径
- 导出后的文件路径
- 相关配置/脚本/资源文件
- 文件编码或格式

## 3. 备份

修改前备份到：

```text
private/dnf-70/client-backups/YYYYMMDD-change-name/
```

## 4. 修改

只在这个工作区里修改：

```text
private/dnf-70/client-workspace/
```

PVF 导出文件安全规则：

- 不要直接修改 `pvf-export`。
- 保留原始编码、换行、缩进、分隔符、字体相关格式。
- 不要运行格式化工具。
- 只做最小精准改动。
- 修改副本放 `pvf-modified`。
- 准备导入的文件放 `pvf-import-ready`。

## 5. 验证

- 客户端能正常启动：
- 功能按预期生效：
- 没有明显 UI/资源错误：
- 服务端兼容性已确认：
- 回滚方法已测试：

## 6. 记录补丁

在下面目录创建补丁记录：

```text
09-client-modding/patches/
```

