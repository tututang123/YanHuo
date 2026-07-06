# HAmini IN 项目

## 项目别名

- `HAmini IN`
- `in_hamini`
- `cocos_web`
- `HAmini_Android`

以后提到 `in_hamini cocos_web 打包任务`，默认指：使用 Cocos Web 壳资源和 Android WebView 壳项目生成 IN 渠道落地页 APK，并上传到生产 S3/CDN 路径。

## 常用路径

- 打包资源输入：`C:\Users\zsw\Downloads\0706`
- 打包脚本目录：`C:\Users\zsw\Desktop\createcConfig_us`
- 渠道配置脚本：`C:\Users\zsw\Desktop\createcConfig_us\createBuildFile_newtwo.py`
- Android 打包项目：`D:\project\HAmini_Android`
- APK 构建输出：`D:\project\HAmini_Android\app\build\outputs\apk\<Flavor>\release\<Flavor>.apk`
- 本地上传目录：`D:\project\HAmini_Android\in\<package>\pkg\<AppName>.apk`
- 生产 CDN 前缀：`https://d2k4z7x2ql166o.cloudfront.net/in/`

## 关键规则

- 参考渠道包：`RubyBubble`
- 新渠道签名统一使用 RubyBubble 同款 Gradle 签名配置：`signingConfigs.spbludo`
- 渠道名使用无空格 PascalCase，例如 `SweetieTower`
- APK 文件名使用无空格 AppName，例如 `SweetieTower.apk`
- S3 路径结构固定为：`in/<package>/pkg/<AppName>.apk`
- `Asour Candy` 曾出现 `pkg/chn` 与网站域名写反的输入；以 Firebase JSON 和 APK URL 中的包名为准：`com.jasour.harducandy`

## 关联文档

- [cocos_web 打包上传流程](cocos-web-build-upload-runbook.md)
- [任务记录](tasks.md)

