# 敏感信息处理 Secret Handling

服务器密码、SSH 私钥、token、数据库密码等访问凭据不能放进 Git。

## 本地私密位置

敏感内容只放这个本地目录：

```text
private/dnf-70/
```

`private/` 已经被 `.gitignore` 忽略，不会上传 GitHub。

## 推荐文件

```text
private/dnf-70/server-access.md
private/dnf-70/local-paths.md
```

## 规则

- 不要在 `knowledge/` 里写密码。
- 不要提交 `.pem`、`.key`、`.env` 或包含凭据的文本文件。
- 如果密码误写进 Git 跟踪文件，提交前必须删除。
- 如果密码已经推送到远端，立刻更换密码。

