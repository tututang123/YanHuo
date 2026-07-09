# HAB 任务记录

## 今日

- [ ] 建立 HAB 项目上下文
  - 背景：开始在工作电脑处理 HAB 前端和 WebView 壳项目。
  - 下一步：根据真实任务继续补充构建、调试、发布或问题排查记录。
  - 关联：`frontend.md`、`webview-android.md`
- [x] 更新 HABet / HABPartners App 资料
  - 背景：记录官网、包名、生产服分享地址、pancard、协议和活动页链接。
  - 关联：`app-config.md`
- [x] 上传 About Bonus 页面到 HAB 测试环境
  - 来源：`C:\Users\zsw\Downloads\about-bonus\about-bonus\index.html`
  - S3：`s3://handigame/hab/h5/about-bonus/index.html`
  - 地址：`https://test-cdn2.ilikebreaking.com/hab/h5/about-bonus/index.html`
  - 验证：HTTP 200，标题 `About Bonus`
- [x] 修复服务端反馈的活动规则页请求和 Bonus 展示问题
  - 背景：Free bet / Bonus 展示字段取错或写死；First Recharge / Weekly Reload 规则页需要按 prepare-recharge 返回的 `activity_conf_id` 精确请求。
  - 处理：更新 protobuf 请求结构；First Recharge 传 `activity_conf_id`；Weekly Reload 支持 `weekly_reload_activity_type` 和 `activity_conf_id`；top-up 路径传活动配置 ID；命令入口继续透传 weeklyReloadActivityType；展示层去掉写死 wagering requirements。
  - 验证：定向 `dart analyze` 无 error，仅剩项目已有 info 级 lint。

## 待处理

- [ ] 梳理 HAB 前端常用开发和构建命令。
- [ ] 梳理 Web 包放入 Android WebView 壳的流程。

## 已完成

- [x] 记录 HAB 前端项目路径：`E:\flutter\hab_client`
- [x] 记录 HAB WebView 项目路径：`E:\work\hym\android\habet_web_android`
- [x] 建立 HABet / HABPartners App 资料索引。
- [x] 上传并验证 About Bonus 测试环境页面。
- [x] 修复 HAB 服务端反馈的活动请求参数和 Bonus 展示问题。
