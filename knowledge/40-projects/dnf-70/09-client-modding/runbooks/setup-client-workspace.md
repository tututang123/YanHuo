# 设置客户端工作区

## 目标

准备一个安全的本地工作区，用来修改 DNF 70 客户端文件。

## 本地目录

```text
private/dnf-70/client-tools
private/dnf-70/client-workspace
private/dnf-70/client-backups
```

## 操作步骤

1. 把客户端编辑工具放到 `private/dnf-70/client-tools`。
2. 把干净的客户端或 PVF 原始文件放到 `private/dnf-70/client-workspace/original` 或备份目录。
3. 把要修改的文件复制到单独工作目录。
4. 在 `09-client-modding/tool-index.md` 记录工具用途。
5. 在 `09-client-modding/file-maps/client-file-index.md` 记录功能对应文件。
6. 每次修改前，在 `private/dnf-70/client-backups` 下创建备份目录。

## 注意

- 保持原始客户端不动。
- 每次改动一个独立目录。
- 记录完整步骤，方便以后复现和回滚。

