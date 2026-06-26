# HAmini US 项目资料

## 本地路径

```text
E:\cocos\us\HAmini_cocos_US
```

## 项目类型

- Cocos Creator 项目
- 运行环境：Web 移动端

## 关键依赖（来自 package.json）

- `@sentry/browser@^6.19.7` — 前端错误收集
- `@sentry/tracing@^6.19.7` — 性能/链路追踪
- `google-protobuf@^3.21.4` — 协议序列化

## 仓库自带脚本与文件

| 文件 | 用途（待确认） |
| --- | --- |
| `addHandlers.txt` | 处理器清单/参考文本 |
| `guide.txt` | 指南说明 |
| `changeCocsProject.py` | 切换 Cocos 工程配置 |
| `checkDecApi.py` | 检查装饰器 API 使用 |
| `checkFileName.py` | 检查文件命名规范 |
| `checkTopUpPathCall.py` | 检查 TopUp 相关路径调用 |
| `checkTopUpPrefabUuid.py` | 检查 TopUp Prefab 的 UUID 引用 |
| `clearLog.py` | 清理日志 |
| `dumpFilePath.py` | 输出文件路径清单 |
| `optimize_webmobile.py` | Web 移动端构建后优化 |
| `template.json` | 模板配置 |
| `template-banner.png` | 模板横幅图 |

## 项目配置

- `project.json`：Cocos Creator 工程配置（版本、引擎设置、资源引用等）。
- `settings/`：Cocos 项目级配置。
- `build-templates/`：自定义构建模板。
- `jsconfig.json`：JavaScript / TypeScript 编辑器配置。

## AI 处理偏好

- 修改前先定位影响 Web 移动端构建、构建产物、Sentry 上报、protobuf 协议中的哪一处。
- 处理 Cocos 资源引用时注意 UUID 稳定性，必要时配合 `checkTopUpPrefabUuid.py` 等脚本验证。
- 涉及构建和发布时记录版本号、构建命令、产物位置和下一步。
- 不主动改动 `library/`、`node_modules/`、`local/`、`temp/`、`settings/` 内部文件，只在确实必要时调整。

## 待补充

- Cocos Creator 具体版本号（查看 `project.json` 或编辑器的「关于」）。
- 构建面板配置（场景参与构建情况、Web 移动端构建参数）。
- Sentry DSN、环境（test/prod）区分。
- protobuf `.proto` 文件位置和生成产物位置。
- 真实网络请求入口（一般会在 `assets/scripts/` 下的某个 manager）。