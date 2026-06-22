# HAB 项目

## 项目别名

- `hab 前端项目`：`E:\flutter\hab_client`
- `hab webview 项目`：`E:\work\hym\android\habet_web_android`

以后提到 `hab 前端`，默认指 Flutter 前端项目 `hab_client`。

以后提到 `hab webview`、`hab Android 壳` 或 `webview 项目`，默认指 Android WebView 壳项目 `habet_web_android`。

## 目标

记录 HAB 相关前端开发、Web 打包、Android WebView 壳集成、构建发布、问题排查和决策。

## 项目组成

- Flutter 前端：开发业务页面、网络请求、路由、资源、平台兼容逻辑。
- Android WebView 壳：承载 Flutter Web 构建产物，负责 Android 壳层能力、打包和发布。

## 当前状态

- 已确认两个本地项目目录都存在。
- 已建立项目记忆，后续工作记录放在本目录。

## 下一步行动

- 梳理 `hab_client` 的构建方式、目录约定和常用命令。
- 梳理 `habet_web_android` 如何接收 Web 包以及发布流程。
- 后续每次处理 HAB 相关事项，记录任务、结论、风险和归档位置。

## 关联笔记

- [前端项目](frontend.md)
- [WebView 壳项目](webview-android.md)
- [App 资料](app-config.md)
- [任务记录](tasks.md)

## 记录规则

- 原始工作内容可以先放到 `../../00-inbox`。
- 明确属于 HAB 的内容整理到本目录。
- 重要构建、发布、线上问题和方案选择要写入 `tasks.md` 或决策记录。
- 涉及密钥、签名、账号、客户或线上敏感数据时，只记录脱敏摘要。
