# 服务器配置替换手册

## Frida 配置

常用配置文件：

```text
/home/neople/game/frida-gadget-16.0.1-linux-x86.js
```

## 替换后验收规则

每次替换服务器配置文件后，必须检查 Frida 最新日志：

```text
/home/neople/game/log/frida/
```

验收步骤：

1. 替换配置文件前，先备份远端原文件。
2. 上传或覆盖配置文件后，检查远端文件 hash 是否和本地修改版一致。
3. 查看 `/home/neople/game/log/frida/` 目录中最新日志。
4. 最新日志出现成功标记，才认为本次替换没有问题。
5. 如果最新日志没有更新、没有成功标记、或出现 error/exception/fail 等异常关键字，先不要继续改下一项，优先排查服务是否已重新加载配置。

注意：如果只是替换了 JS 文件但没有重启或重新加载 Frida/游戏服务，日志可能不会立刻刷新。
