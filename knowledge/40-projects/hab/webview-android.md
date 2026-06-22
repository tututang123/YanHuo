# HAB WebView Android 项目

## 本地路径

```text
E:\work\hym\android\habet_web_android
```

## 用途

HAB 项目的 Web 版本 Android 壳子，用来承载 `hab_client` 打包出来的 Web 包。

## 项目类型

- Android Gradle 项目
- Gradle include：`:app`
- 主要目录：`app`

## 已知目录

- `app/src`：Android 源码与资源。
- `app/libs`：本地依赖。
- `app/keystore`：签名相关目录，记录时注意脱敏。
- `app/proguard`、`app/proguard-rules.pro`：混淆相关。
- `app/webinvite`：Web 邀请或 Web 相关资源目录。

## AI 处理偏好

- 处理 WebView 壳问题时，同时确认是否需要改 Flutter Web 构建产物。
- 涉及签名、账号、证书、密钥时不记录明文。
- 涉及发包时记录版本、构建方式、Web 包来源和验证结果。
