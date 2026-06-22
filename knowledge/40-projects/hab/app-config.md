# HAB App 资料

## 用途

记录 HABet App 和 HABPartners App 的官网、包名、分享地址、生产服 H5 链接和协议页面。

## HABet App

### 测试环境

- 测试 CDN 前缀：`https://test-cdn2.ilikebreaking.com/hab`
- 测试环境 H5 页面通常以这个前缀开头。
- 从生产 CloudFront 链接切测试环境时，通常保留 `/h5/...` 后续路径，把前缀替换为测试 CDN 前缀。
- 测试环境上传命令：

```bash
aws s3 cp hab s3://handigame/hab --acl public-read --recursive --profile handigame-client-test
```

- About Bonus：`https://test-cdn2.ilikebreaking.com/hab/h5/about-bonus/index.html`

示例：

```text
生产：https://d2k4z7x2ql166o.cloudfront.net/hab/h5/protocol/privacy-policy.html
测试：https://test-cdn2.ilikebreaking.com/hab/h5/protocol/privacy-policy.html
```

### 官网

- 官网：`https://habet.online/`
- 备用 / 相关官网：`https://patigop.com/`

### 包名

- 官网包名：`com.hasports.app`
- 分享包名：`com.hasports.app.invite`
- 生产内测包名：`com.habet.app.release`

### 生产服链接

- 生产环境上传命令：

```bash
aws s3 cp hab s3://handigame-client2/hab --acl public-read --recursive --profile handigame-client2-s3
```

- 分享：`https://invite.habet.online/`
- pancard 图片：`https://h5.habet.online/pan/index.html`
- 上传成功页面：`https://h5.habet.online/top-up/success.html`
- 隐私政策：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/protocol/privacy-policy.html`
- 服务条款：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/protocol/terms-of-service.html`
- 邀请条款：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/invitation/terms-conditions.html`
- Free Bets 说明：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/free-bets/about.html`
- 30 Day Betting Race 条款：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/30-day-betting-race/terms-conditions.html`
- nsoft 页面，待确认：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/nsoft/index.html`

### HABPartners 不需要的 HABet 链接

- 上传成功页面：`https://h5.habet.online/top-up/success.html`
- Free Bets 说明：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/free-bets/about.html`
- 30 Day Betting Race 条款：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/30-day-betting-race/terms-conditions.html`
- nsoft 页面，待确认：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/nsoft/index.html`

## HABPartners App

### 官网

- 官网：`https://partners.habet.online/`

### 包名

- 官网包名：`com.hasports.app.partners`
- 分享包名：`com.hasports.app.partners.invite`
- 生产内测包名：`com.habet.app.release.partners`

### 生产服链接

- 邮件中分享地址：`https://partners.habet.online/?from=email`
- 分享：`https://invite.partners.habet.online/`
- pancard 图片：`https://h5.partners.habet.online/pan/index.html`
- 隐私政策：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/exagent/privacy-policy.html`
- 服务条款：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/exagent/terms-of-service.html`
- 条款条件：`https://d2k4z7x2ql166o.cloudfront.net/hab/h5/exagent/terms-conditions.html`

## 注意事项

- 涉及包名、域名、协议链接和活动页时，先确认当前品牌是 HABet 还是 HABPartners。
- HABPartners 使用 `partners` / `exagent` 相关域名和 H5 路径。
- HABet 的部分活动页标注为 HABPartners 不需要，不要误用到 partners 包。
- `nsoft/index.html` 原始资料中的 Markdown 链接混乱，当前按推测地址记录，使用前需要再次确认。
