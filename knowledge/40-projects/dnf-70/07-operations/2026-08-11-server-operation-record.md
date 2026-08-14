# 2026-08-11 服务器操作记录

## 基本信息

- 服务器 IP: `202.189.5.187`
- SSH 端口: `22`
- 系统: CentOS/RHEL 7 系列，内核 `3.10.0-957.el7.x86_64`
- Web 服务: `nginx/1.20.1`
- 数据库: MySQL Community Server `5.6.51`

> 说明：本文只记录可进入知识库的操作事实。SSH 密码、数据库密码、token 等凭据不写入 `knowledge/`。

## 操作原则

- 不重启业务服务。
- 不 reload nginx。
- 不修改现有业务配置。
- 不改防火墙、安全组和业务端口。
- 数据库只做轻量只读查询，不扫大表、不导出用户隐私明细。

## 服务器状态检查

已确认：

- `22` 端口开放，可 SSH 登录。
- `80` 端口开放，由 nginx 监听。
- `443`、`8080`、`8088`、`18080`、`3000`、`8000`、`8888` 未开放或不可达。
- nginx 监听：
  - `80`
  - `8081`
- 磁盘空间充足：
  - 主分区约 `945G`
  - 已用约 `8.3G`
  - 可用约 `936G`
- 内存：
  - 总计约 `62G`
  - 可用约 `45G`
- 服务器负载较高，存在较多游戏业务进程，例如 `df_game_r`、`df_point_r` 等。

## 下载文件挂载验证

### 测试文件

创建过一个小测试文件：

```text
/usr/share/nginx/html/dl-20260811-codex/codex-download-test.zip
```

验证结果：

```text
HTTP 200 OK
Content-Type: application/zip
```

测试链接：

```text
http://202.189.5.187/dl-20260811-codex/codex-download-test.zip
```

### 游戏更新文件

本地文件：

```text
E:\ruanjian\drivers\QQNT\Update20260728Script.zip
```

已上传到服务器：

```text
/usr/share/nginx/html/dl-20260811-codex/Update20260728Script.zip
```

文件大小：

```text
102507714 bytes
```

当前可用下载链接：

```text
http://202.189.5.187/dl-20260811-codex/Update20260728Script.zip
```

外网验证结果：

```text
HTTP 200 OK
Content-Type: application/zip
Content-Length: 102507714
```

## 8081 下载目录问题

服务器已有 nginx 配置：

```nginx
server {
    listen 8081;
    server_name _;
    root /tmp/download;
    location / {
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }
}
```

但 `/tmp/download/codex-download-test.zip` 访问返回 `404`。

排查结果：

- SSH 下文件存在。
- nginx 日志显示访问 `/tmp/download/...` 时文件不存在。
- SELinux 状态为 `Disabled`。
- 更可能的原因是 nginx 服务存在 `/tmp` 隔离，例如 systemd `PrivateTmp`，导致 nginx 看到的 `/tmp` 与 SSH 会话看到的 `/tmp` 不一致。

结论：

- 不建议使用 `/tmp/download` 作为长期下载目录。
- 推荐继续使用 nginx 默认静态目录下的子目录：

```text
/usr/share/nginx/html/dl-20260811-codex/
```

## 域名访问情况

域名解析检查：

```text
game.yanhuo70.com -> 202.189.5.187
```

注意：曾经输入过 `game.yanhuo70..com`，中间多了一个点；正确域名应为：

```text
game.yanhuo70.com
```

当前现象：

- 使用 IP 访问下载文件：`200 OK`，返回 nginx。
- 使用域名访问下载文件：外部访问返回 `404`，响应头显示 `Server: Apache`。
- 在服务器本机用 `Host: game.yanhuo70.com` 请求 nginx，可以返回 `200 OK`。

判断：

- DNS A 记录指向是正确的。
- 但域名外部访问可能经过了 CDN、高防、转发层或其他按 Host 分流的前置服务。
- 要让域名下载可用，需要检查域名解析/CDN/高防/转发配置，确保 `game.yanhuo70.com` 直连或正确回源到这台 nginx。

当前稳定可用链接仍是 IP 链接：

```text
http://202.189.5.187/dl-20260811-codex/Update20260728Script.zip
```

## 数据库检查记录

### MySQL 服务

确认 MySQL 正在运行：

```text
mysqld.service active running
```

进程信息：

```text
/usr/sbin/mysqld --datadir=/var/lib/mysql --socket=/var/lib/mysql/mysql.sock --port=3306
```

监听端口：

```text
3306
```

配置文件：

```text
/etc/my.cnf
```

数据目录：

```text
/var/lib/mysql
```

数据目录大小约：

```text
2.3G
```

业务配置中发现数据库连接信息位置：

```text
/root/config.ini
```

其中包含数据库用户和密码；密码不得写入知识库。

### 数据库概览

可见主要数据库：

```text
Rslogin
d_channel
d_guild
d_taiwan
d_taiwan_secu
d_technical_report
taiwan_billing
taiwan_cain
taiwan_cain_2nd
taiwan_cain_auction_cera
taiwan_cain_auction_gold
taiwan_cain_log
taiwan_cain_web
taiwan_game_event
taiwan_login
taiwan_login_play
taiwan_mng_manager
taiwan_prod
taiwan_se_event
```

数据库大小概览：

```text
taiwan_cain_log              142 表   560.73 MB
d_technical_report            42 表    60.50 MB
taiwan_prod                   27 表    37.00 MB
taiwan_cain_2nd               32 表    30.44 MB
taiwan_cain                   82 表    29.70 MB
taiwan_billing                12 表    13.48 MB
taiwan_cain_web               17 表     7.41 MB
Rslogin                       15 表     4.73 MB
d_taiwan                     111 表     4.22 MB
taiwan_cain_auction_gold      59 表     3.94 MB
taiwan_cain_auction_cera      59 表     3.02 MB
taiwan_login                  45 表     3.02 MB
taiwan_game_event             50 表     1.11 MB
d_guild                       26 表     0.99 MB
```

## 用户注册数据检查

注册主表判断为：

```text
Rslogin.accountInfo
```

关键字段：

```text
UID
accountname
password
ip
qq
safepasswd
machinecode
registerTime
registerCdkey
isBlackList
loginTime
```

注意：该表包含账号、密码、安全密码、机器码、IP 等敏感字段，不应直接导出到知识库。

注册统计：

```text
总账号数：853
有效注册时间账号：848
注册时间异常/空值：5
黑名单账号：61
最近 7 天新增注册：6
最近 30 天新增注册：27
最近 7 天有登录：49
最近 30 天有登录：79
最新注册时间：2026-08-08 10:05:42
```

最近 30 天注册分布：

```text
2026-07-12    2
2026-07-13    5
2026-07-14    1
2026-07-15    1
2026-07-19    2
2026-07-20    2
2026-07-21    2
2026-07-23    1
2026-07-24    1
2026-07-26    1
2026-07-28    1
2026-08-02    2
2026-08-04    4
2026-08-07    1
2026-08-08    1
```

按月注册概览：

```text
2026-08     8
2026-07    29
2026-06    65
2026-05    40
2026-04    42
2026-03    52
2026-02    64
2026-01    93
2025-12    70
2025-11    81
2025-10    62
2025-09    44
2025-08    21
2025-07    32
2025-06    38
2025-05    24
2025-04    30
2025-03    47
2025-02     6
```

## 后续建议

- 如果要长期对外提供下载，建议建立固定目录，例如 `/usr/share/nginx/html/downloads/`，并配合随机文件名或目录名避免被扫。
- 如果要使用域名下载，先处理 `game.yanhuo70.com` 的前置转发或 CDN/高防配置问题。
- 如果要定期看注册数据，建议只保存聚合统计，不保存账号、密码、手机号、邮箱、机器码、IP 等明细。
- 如果需要导出数据库或备份，先制定备份窗口和限速方案，避免影响当前游戏业务。
