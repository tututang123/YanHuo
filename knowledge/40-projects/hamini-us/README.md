# HAmini US 项目

## 项目别名

- `HAmini US 项目`、`HAmini_cocos_US`、`HAmini cocos US`：默认指本地项目目录 `E:\cocos\us\HAmini_cocos_US`。

以后提到 `hamini-us` 或 `HAmini US`，默认指上述 Cocos Creator 项目。

## 目标

记录 HAmini US 版本相关前端开发、Cocos 工程结构、Web/移动端构建、问题排查、发布流程和决策。

## 项目组成

- 引擎：Cocos Creator（项目根目录含 `project.json`、`assets`、`settings`、`build-templates` 等）。
- 运行环境：Web 移动端为主。
- 关键依赖：Sentry（错误收集）、google-protobuf（协议）。
- 仓库自带工具脚本：见「常用工具脚本」。

## 当前状态

- 本地项目目录 `E:\cocos\us\HAmini_cocos_US` 已存在。
- 已建立项目记忆，后续工作记录放在本目录。
- 项目原本的 `README.md` 只写了「US 项目」一句，详细资料后续补充。

## 下一步行动

- 梳理 Cocos Creator 版本、构建面板配置、Web 移动端构建命令。
- 确认 Sentry DSN、protobuf 协议文件位置、网络请求封装方式。
- 整理仓库自带 Python 脚本（`checkDecApi.py`、`checkFileName.py`、`checkTopUpPathCall.py`、`checkTopUpPrefabUuid.py`、`clearLog.py`、`optimize_webmobile.py` 等）的用途。
- 梳理 `addHandlers.txt`、`guide.txt`、`template.json`、`project.json` 的作用。
- 后续每次处理 HAmini US 相关事项，记录任务、结论、风险和归档位置。

## 已知目录

- `assets/`：Cocos 资源（场景、Prefab、脚本、图片、动画等）。
- `settings/`：Cocos 项目配置。
- `build-templates/`：自定义构建模板。
- `docs/`：项目自带文档。
- `_bmad/`、`_bmad-output/`：BMAD-METHOD 工作流产物（沿用主仓库约定）。
- `local/`、`temp/`：本地临时文件（不要提交）。
- `library/`、`node_modules/`：依赖缓存（不要提交）。
- `packages/`：Cocos Creator 扩展包。

## 常用工具脚本

仓库根目录自带以下脚本，使用前确认用途：

- `changeCocsProject.py`
- `checkDecApi.py`
- `checkFileName.py`
- `checkTopUpPathCall.py`
- `checkTopUpPrefabUuid.py`
- `clearLog.py`
- `dumpFilePath.py`
- `optimize_webmobile.py`

## 关联笔记

- [任务记录](tasks.md)
- [项目资料](project-info.md)

## 记录规则

- 原始工作内容可以先放到 `../../00-inbox`。
- 明确属于 HAmini US 的内容整理到本目录。
- 重要构建、发布、线上问题和方案选择要写入 `tasks.md` 或决策记录。
- 涉及密钥、签名、账号、客户或线上敏感数据时，只记录脱敏摘要。
- 不在仓库跟踪的内容：本地缓存（`library/`、`node_modules/`、`local/`、`temp/`）、构建产物。