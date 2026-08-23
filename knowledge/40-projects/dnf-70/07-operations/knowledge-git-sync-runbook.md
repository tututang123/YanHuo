# 知识体系 Git 同步手册

## 目标

把当前 `YanHuo` 知识体系放到 DNF 服务器上，形成一个可同步的 Git 工作区，方便：
- 服务器本地直接查看知识库
- 其他机器通过 Git 拉取/推送
- 后续微信机器人直接读取同一份知识库

## 服务器布局

建议在服务器上使用两层结构：

- bare 仓库：`/root/yanhuo-knowledge.git`
- 工作目录：`/root/yanhuo-knowledge`

这样服务器既能充当同步中心，也能保留一份可直接浏览的工作树。

## 初始化

在服务器上执行：

```bash
yum -y install git
mkdir -p /root/yanhuo-knowledge.git
git init --bare /root/yanhuo-knowledge.git
git --git-dir=/root/yanhuo-knowledge.git symbolic-ref HEAD refs/heads/main
```

然后从本地把当前仓库推到服务器：

```bash
git remote add dnf-server root@202.189.5.187:/root/yanhuo-knowledge.git
git push -u dnf-server main
```

再在服务器上克隆一份工作树：

```bash
git clone /root/yanhuo-knowledge.git /root/yanhuo-knowledge
```

## 日常同步

本地更新后：

```bash
git add .
git commit -m "..."
git push origin main
git push dnf-server main
```

服务器上查看最新内容：

```bash
cd /root/yanhuo-knowledge
git pull --ff-only
```

## 约束

- `private/` 里的密钥、数据库密码、SSH 凭据不进 Git
- 知识库只同步文档、脚本和结构化资料
- 服务器仓库作为同步点，不作为单独的秘密存储

