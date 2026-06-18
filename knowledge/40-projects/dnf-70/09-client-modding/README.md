# 客户端修改工作区 Client Modding Workspace

这里用来记录 DNF 70 客户端相关改动的资料、流程、工具、文件映射和补丁记录。

实际客户端文件、工具 exe、导出的 PVF 文件、补丁包、大型资源文件不要放这里，统一放到 `private/dnf-70/` 下。

## 本地私密目录 Local Private Folders

```text
private/dnf-70/client-tools      # 客户端编辑工具、解包工具、查看器
private/dnf-70/client-workspace  # 客户端工作区、PVF 导出文件、修改副本
private/dnf-70/client-backups    # 每次修改前的原始文件备份
```

## Git 里维护的文档

- `tool-index.md`：工具清单，记录哪个工具做什么。
- `client-change-workflow.md`：客户端修改标准流程。
- `format-safety-rules.md`：PVF 导出文件格式安全规则。
- `api/`：工具 API、命令、文件格式、接口说明。
- `file-maps/`：功能和客户端文件的对应关系。
- `patches/`：每次修改的补丁记录。
- `runbooks/`：可重复执行的操作手册。

## 标准修改流程

1. 在 `patches/` 里记录这次要改什么。
2. 在 `file-maps/` 里确认目标功能对应哪些客户端文件。
3. 在 `tool-index.md` 里确认要用哪个工具。
4. 修改前把原始文件备份到 `private/dnf-70/client-backups`。
5. 在 `private/dnf-70/client-workspace` 里修改工作副本。
6. 记录改动文件、操作步骤、测试结果和回滚方法。
7. 本地测试通过后，再考虑放到正式客户端里。

## 安全规则

- 不要直接覆盖原始客户端文件，先备份。
- 客户端二进制、PVF 导出内容、资源文件不要上传 GitHub。
- 能记录校验值时，记录原始文件和修改后文件的校验值。
- 每次改动尽量小，并且可以回滚。
- 对 PVF 导出文件，必须保留原始编码、换行、缩进、分隔符、字体相关格式。
- 不要对 PVF 导出文件运行自动格式化工具。

