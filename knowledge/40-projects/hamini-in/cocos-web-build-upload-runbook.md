# in_hamini cocos_web 打包上传流程

## 适用场景

收到一批 IN 渠道落地页壳包需求，需要基于 `D:\project\HAmini_Android` 增加渠道资源、配置 Gradle flavor、打包 APK，并上传到生产 S3/CDN。

## 输入资料

每个渠道至少需要：

- `appname`
- `pkg/chn`
- `adjust token`
- 网站域名
- 目标 APK URL
- icon 切图 zip
- 对应包名已包含在 `google-services.json`

目标 URL 格式：

```text
https://d2k4z7x2ql166o.cloudfront.net/in/<package>/pkg/<AppName>.apk
```

## 资源配置步骤

1. 确认参考渠道 `RubyBubble`：
   - `app/build.gradle` 中的 `RubyBubble` productFlavor
   - `app/src/RubyBubble`
   - `app/proguard/proguard-rules-RubyBubble.pro`
   - `app/bt_proguard/bt-proguard-RubyBubble.txt`

2. 在 `app/build.gradle` 增加新渠道 productFlavor：
   - `applicationId` = 包名
   - `signingConfig signingConfigs.spbludo`
   - `mypluginAdjustToken` = 渠道 token
   - `mypluginApkChannel` = 包名
   - `proguardFiles` 指向 `../app/proguard/proguard-rules-<Flavor>.pro`

3. 在 `androidJunkCode.variantConfig` 增加对应 `<Flavor>Release`：
   - `packageBase = "com.hamini.test"`
   - `packageCount = 40`
   - `activityCountPerPackage = 3`
   - `excludeActivityJavaFile = false`
   - `otherCountPerPackage = 55`
   - `methodCountPerClass = 40`
   - `resPrefix = "junk_<flavor_lower>_"`
   - `drawableCount = 100`
   - `stringCount = 100`

4. 创建渠道资源目录：

```text
app/src/<Flavor>/res/mipmap-mdpi/ic_icon.png
app/src/<Flavor>/res/mipmap-hdpi/ic_icon.png
app/src/<Flavor>/res/mipmap-xhdpi/ic_icon.png
app/src/<Flavor>/res/mipmap-xxhdpi/ic_icon.png
app/src/<Flavor>/res/mipmap-xxxhdpi/ic_icon.png
app/src/<Flavor>/res/mipmap-hdpi/ic_splash.png
app/src/<Flavor>/res/values/strings.xml
app/src/<Flavor>/google-services.json
```

5. icon zip 尺寸映射：

```text
48.png  -> mipmap-mdpi/ic_icon.png
72.png  -> mipmap-hdpi/ic_icon.png
96.png  -> mipmap-xhdpi/ic_icon.png
144.png -> mipmap-xxhdpi/ic_icon.png
192.png -> mipmap-xxxhdpi/ic_icon.png
```

6. `ic_splash.png` 可复用 RubyBubble：

```text
app/src/RubyBubble/res/mipmap-hdpi/ic_splash.png
```

7. `strings.xml` 只写渠道展示名：

```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">Sweetie Tower</string>
</resources>
```

8. `google-services.json` 使用本批资源提供的文件，并确认其中包含对应包名。

9. ProGuard 文件：
   - 复制 `proguard-rules-RubyBubble.pro` 为 `proguard-rules-<Flavor>.pro`
   - 将内部 `bt-proguard-RubyBubble.txt` 替换为 `bt-proguard-<Flavor>.txt`
   - 复制 `bt-proguard-RubyBubble.txt` 为 `bt-proguard-<Flavor>.txt`

10. 可同步更新脚本：

```text
C:\Users\zsw\Desktop\createcConfig_us\createBuildFile_newtwo.py
```

把本批渠道写入 `FLAVORS`，便于后续复用。但不要让脚本生成新签名；本流程统一使用 `spbludo`。

## 打包步骤

在 `D:\project\HAmini_Android` 执行：

```bash
.\gradlew.bat :app:assemble<Flavor>Release
```

构建产物位置：

```text
app/build/outputs/apk/<Flavor>/release/<Flavor>.apk
```

## 上传目录整理

上传前按 CDN URL 结构整理本地目录：

```text
in/<package>/pkg/<AppName>.apk
```

示例：

```text
in/com.malsweetie.inatower/pkg/SweetieTower.apk
```

## 生产上传命令

在 `D:\project\HAmini_Android` 执行：

```bash
aws s3 cp in s3://handigame-client2/in --acl public-read --recursive --profile handigame-client2-s3
```

## 上传后校验

逐个确认 S3 对象存在：

```bash
aws s3 ls s3://handigame-client2/in/<package>/pkg/<AppName>.apk --profile handigame-client2-s3
```

同时核对最终 CDN 链接：

```text
https://d2k4z7x2ql166o.cloudfront.net/in/<package>/pkg/<AppName>.apk
```

## 本次 2026-07-06 示例渠道

| AppName | Flavor | Package | Token | Domain | APK |
| --- | --- | --- | --- | --- | --- |
| Sweetie Tower | SweetieTower | `com.malsweetie.inatower` | `9h6tz24mc7pc` | `sweetiet.com` | `SweetieTower.apk` |
| Ether Tower | EtherTower | `com.etherstr1ke.toweria` | `xcwyoo279ips` | `ethertow.com` | `EtherTower.apk` |
| Lightning Bingo | LightningBingo | `com.lightningslow.mobingo` | `sbiptlaxm874` | `lightnbg.com` | `LightningBingo.apk` |
| Masca Bakery | MascaBakery | `com.aramascana.lofbakery` | `1ly6efsfi14w` | `mascbk.com` | `MascaBakery.apk` |
| IDI Ludo | IDILudo | `com.midini.paludo` | `2o2upwhl0myo` | `idild.com` | `IDILudo.apk` |
| Asour Candy | AsourCandy | `com.jasour.harducandy` | `9l7plkvd3rwg` | `asourc.com` | `AsourCandy.apk` |

## 常见检查点

- `.\gradlew.bat :app:tasks --all --quiet` 能看到新 flavor 的 assemble/package/sign task。
- 每个渠道资源无缺失：5 个 icon、1 个 splash、1 个 strings、1 个 google-services。
- icon 尺寸应为 `48x48 / 72x72 / 96x96 / 144x144 / 192x192`。
- `google-services.json` 必须包含对应 `applicationId`。
- 如果已有同名渠道，例如旧 `LightningBingo`，注意不要重复添加 `<Flavor>Release` junkCode 配置。
- 上传前确认本地 `in/` 目录只包含本次准备上传的目标 APK，避免递归上传旧文件。

