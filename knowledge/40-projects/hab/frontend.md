# HAB 前端项目

## 本地路径

```text
E:\flutter\hab_client
```

## 技术栈

- Flutter 项目名：`hab_client`
- 当前版本：`1.4.4+116`
- Dart SDK：`>=3.5.4 <4.0.0`
- Flutter：`3.24.5`
- 状态管理 / 路由相关：GetX
- 网络：Dio
- 错误收集：Sentry
- 目标形态：同时支持 Android 原生包和手机 Web 包

## 常用构建信息

项目 README 记录的 Web 构建方式：

```text
web_build.sh debug
web_build.sh profile
web_build.sh release
web_build.sh 等同 web_build.sh release
```

构建前注意：

- 需要先修改 `BASE_HREF`。
- 资源 md5 命名逻辑曾在 `web_build.sh` 中暂时屏蔽。
- 本地多 Flutter 版本时，Android Studio 里 Dart 和 Flutter SDK 路径要指向目标版本。

## 目录认知

- `lib/common`：模块类功能、命令、平台交互、埋点、通用组件。
- `lib/network`：网络请求。
- `lib/pages`：页面和相关逻辑。
- `lib/routes`：路由。
- `lib/utils`：工具类。
- `lib/i10n`：国际化。
- `assets`：图片、字体、音效、动画资源。
- `web_build.sh`：Web 构建脚本。

## 命名和兼容约定

- 项目名、文件夹名、文件名使用小写字母和下划线。
- Class 使用大驼峰，方法使用小驼峰，私有方法以下划线开头。
- 页面文件名前缀带当前页面文件夹前缀，例如 `home_`、`login_`。
- `common`、`i10n`、`utils` 下文件命名全部以 `my_` 为前缀。
- 三方库尽量选择同时支持 Web 和 Android 的。
- 暂定只使用 `flutter/material.dart`，避免使用 `flutter/cupertino.dart`。
- 涉及平台差异时使用后缀：
  - `_platform_native`
  - `_platform_stub`
  - `_platform_web`

## AI 处理偏好

- 修改前先定位影响 Web、Android 原生包、Android WebView 壳三处中的哪一处。
- 遇到平台 API 时先检查是否会破坏 Web 编译。
- 涉及构建和发布时记录版本号、构建命令、产物位置和下一步。
