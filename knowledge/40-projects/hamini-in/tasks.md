# HAmini IN 任务记录

## 2026-07-06 in_hamini cocos_web 六渠道打包上传

- 完成 6 个渠道资源配置：Sweetie Tower、Ether Tower、Lightning Bingo、Masca Bakery、IDI Ludo、Asour Candy。
- 参考 RubyBubble，签名统一使用 `signingConfigs.spbludo`。
- 完成 Android flavor、资源、Firebase、ProGuard、JunkCode 配置。
- 完成 release APK 构建。
- 按 `in/<package>/pkg/<AppName>.apk` 整理本地上传目录。
- 使用生产 S3 命令上传：

```bash
aws s3 cp in s3://handigame-client2/in --acl public-read --recursive --profile handigame-client2-s3
```

- 已用 `aws s3 ls` 确认 6 个远端 APK 存在。

