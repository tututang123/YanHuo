# HAPartner API Summary

- Source: https://test-api.hapartner.online/swagger/doc.json
- Title: Hapartner API
- Host: test-api.hapartner.online:443
- Base path: /api/v1
- Swagger: 2.0
- Generated: 2026-08-12 16:15:02
- Endpoint count: 26
- Definition count: 67

## Endpoint Index

| Method | Path | Summary | Tags | Auth |
|---|---|---|---|---|
| POST | `/account-login` | 账号登录 | 登录模块 | no |
| GET | `/affiliates-commissions` | 代理佣金列表 | 代理模块 | yes |
| GET | `/affiliates-home` | 代理主页 | 代理模块 | yes |
| GET | `/affiliates-referrals` | 下级列表 | 代理模块 | yes |
| GET | `/affiliates-referrals-home` | 下级详情总览 | 代理模块 | yes |
| GET | `/affiliates-referrals/{id}` | 下级详情 | 代理模块 | yes |
| PUT | `/affiliates-referrals/{id}/star` | 设置下级特别关注 | 代理模块 | yes |
| POST | `/bind-phone` | 绑定手机号 | 用户模块 | no |
| POST | `/check-verification-code` | 校验验证码 | 其他模块 | no |
| POST | `/create-user` | 账号注册 | 登录模块 | no |
| GET | `/customer-service` | 客服接口 | user | no |
| POST | `/event/tracks` | 事件数据上传接口 | 事件模块 | no |
| GET | `/logout` | 登出 | 登录模块 | yes |
| GET | `/personal-profile` | 个人信息 | 用户模块 | yes |
| POST | `/reset-password` | 密码重置 | 用户模块 | no |
| GET | `/rule` | 规则 | 其他模块 | no |
| POST | `/send-verification-code` | 发送验证码 | 其他模块 | no |
| POST | `/terms_url` | 获取条款和隐私政策URL | 用户模块 | no |
| GET | `/version-check` | 版本检查 | 其他模块 | yes |
| GET | `/withdraw-accounts` | 获取提现账号列表 | 提现模块 | yes |
| POST | `/withdraw-accounts` | 新增提现账号 | 提现模块 | yes |
| PUT | `/withdraw-accounts` | 修改提现账号 | 提现模块 | yes |
| POST | `/withdraw-apply` | 提现 | 提现模块 | yes |
| GET | `/withdraw-page-info` | 提现页面信息 | 提现模块 | yes |
| POST | `/withdraw-preflight` | 提现预检 | 提现模块 | yes |
| GET | `/withdraw-record` | 提现记录 | 提现模块 | yes |

## Endpoint Details

### POST /account-login

账号登录

- Tags: 登录模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| P | header | yes | string |  | 设备信息 |
| request | body | yes | jfq_server_api_v1.AccountLoginRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.LoginResponse | OK |

### GET /affiliates-commissions

代理佣金列表

- Tags: 代理模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| P | header | no | string |  | 设备信息 |
| endTime | query | no | string | 2024-12-31T23:59:59Z | 结束时间，格式为 RFC3339 |
| page | query | no | integer | 1 |  |
| size | query | no | integer | 20 |  |
| startTime | query | no | string | 2024-01-01T00:00:00Z | 开始时间，格式为 RFC3339 |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.AffiliatesCommissionsResponse | OK |

### GET /affiliates-home

代理主页

- Tags: 代理模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| P | header | no | string |  | 设备信息 |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.AffiliatesHomeResponse | OK |

### GET /affiliates-referrals

下级列表

- Tags: 代理模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| accountFilter | query | no | string | all |  |
| keyword | query | no | string | 357100001 |  |
| page | query | no | integer | 1 |  |
| rechargeFilter | query | no | string | all |  |
| size | query | no | integer | 20 |  |
| sort | query | no | string | binding_latest |  |
| starredOnly | query | no | boolean | False |  |
| status | query | no | string | binding |  |
| unboundRange | query | no | string | all_time |  |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.AffiliatesReferralsResponse | OK |

### GET /affiliates-referrals-home

下级详情总览

- Tags: 代理模块
- Auth: Bearer

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.AffiliatesReferralsHomeResponse | OK |

### GET /affiliates-referrals/{id}

下级详情

- Tags: 代理模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| id | path | yes | integer |  | referral detail id |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.AffiliatesReferralDetailResponse | OK |

### PUT /affiliates-referrals/{id}/star

设置下级特别关注

- Tags: 代理模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| id | path | yes | integer |  | referral detail id |
| request | body | yes | jfq_server_api_v1.UpdateReferralStarRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.UpdateReferralStarResponse | OK |

### POST /bind-phone

绑定手机号

用户绑定手机号，首次登录时需要绑定

- Tags: 用户模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| P | header | yes | string |  | 设备信息 |
| request | body | yes | jfq_server_api_v1.BindPhoneRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.BindPhoneResponse | OK |

### POST /check-verification-code

校验验证码

- Tags: 其他模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| request | body | yes | jfq_server_api_v1.CheckVerificationCodeRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.CheckVerificationCodeResponse | OK |

### POST /create-user

账号注册

- Tags: 登录模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| P | header | yes | string |  | 设备信息 |
| request | body | yes | jfq_server_api_v1.CheckVerificationCodeRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.CreateUserResponseData | OK |

### GET /customer-service

客服接口

- Tags: user
- Auth: none

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.CustomerServiceResponse | OK |

### POST /event/tracks

事件数据上传接口

- Tags: 事件模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| request | body | yes | jfq_server_api_v1.ReceiveTrackRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.Response | OK |

### GET /logout

登出

- Tags: 登录模块
- Auth: Bearer

| Response | Schema | Description |
|---|---|---|
| 200 |  | OK |

### GET /personal-profile

个人信息

获取用户的个人信息，包括Account ID、手机号和密码重置选项

- Tags: 用户模块
- Auth: Bearer

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.PersonalProfileResponse | OK |

### POST /reset-password

密码重置

用户重置密码，需要验证手机号和验证码

- Tags: 用户模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| request | body | yes | jfq_server_api_v1.ResetPasswordRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.ResetPasswordResponse | OK |

### GET /rule

规则

- Tags: 其他模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| type | query | yes | integer | 1 |  |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.GetRuleResponse | OK |

### POST /send-verification-code

发送验证码

- Tags: 其他模块
- Auth: none

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| P | header | no | string |  | 设备信息 |
| request | body | yes | jfq_server_api_v1.SendVerificationCodeRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 |  | OK |

### POST /terms_url

获取条款和隐私政策URL

返回隐私政策、服务条款和条款和条件的URL

- Tags: 用户模块
- Auth: none

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.TermsUrlResponse | OK |

### GET /version-check

版本检查

- Tags: 其他模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| P | header | no | string |  | 设备信息 |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.VersionCheckResponse | OK |

### GET /withdraw-accounts

获取提现账号列表

- Tags: 提现模块
- Auth: Bearer

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.ListWithdrawInfoResponse | OK |

### POST /withdraw-accounts

新增提现账号

- Tags: 提现模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| request | body | yes | jfq_server_api_v1.CreateWithdrawAccountRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.CreateWithdrawAccountResponse | OK |

### PUT /withdraw-accounts

修改提现账号

- Tags: 提现模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| request | body | yes | jfq_server_api_v1.UpdateWithdrawAccountRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 |  | OK |

### POST /withdraw-apply

提现

- Tags: 提现模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| request | body | yes | jfq_server_api_v1.WithdrawRequest |  | params |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.WithdrawResponse | OK |

### GET /withdraw-page-info

提现页面信息

获取提现页面所需信息，包括可提现金额、支付渠道配置等

- Tags: 提现模块
- Auth: Bearer

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.WithdrawPageInfoResponseData | OK |

### POST /withdraw-preflight

提现预检

- Tags: 提现模块
- Auth: Bearer

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.Response | OK |

### GET /withdraw-record

提现记录

- Tags: 提现模块
- Auth: Bearer

| Param | In | Required | Type | Example | Description |
|---|---|---:|---|---|---|
| lastId | query | no | integer | 1 |  |
| size | query | no | integer | 20 |  |
| type | query | no | integer | 1 | 1 提现中 2 成功 3 失败 |

| Response | Schema | Description |
|---|---|---|
| 200 | jfq_server_api_v1.WithdrawOrderResponse | OK |

## Definitions

### jfq_server_api_v1.AccountLoginRequest

| Field | Type | Description | Example |
|---|---|---|---|
| account_id | string |  | 1234567890 |
| password | string |  | Abc123 |

### jfq_server_api_v1.AffiliatesCommissionsResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.EarningDetailResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.AffiliatesHomeResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.AffiliatesHomeResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.AffiliatesHomeResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| account_id | string | 账户ID |  |
| earning_details | array<jfq_server_api_v1.EarningDetailItem> | 收益明细 |  |
| earning_tips | string | 收益说明 |  |
| first_recharge_rebate_rate | string | 首充返利比例 |  |
| guest_recharge_amount | integer | 游客充值金额 |  |
| invite_url | string | 邀请连接 |  |
| new_recharged_referrals | integer | 今日新增付费下级数量 |  |
| new_referrals_today | integer | 今日新增下级数量 |  |
| pending_earnings | integer | 待结算收益 |  |
| share_text | string | 分享入口文本 |  |
| subsequent_recharge_rebate_rate | string | Subsequent返利比例 |  |
| today_earnings | integer | 今日收益 |  |
| total_earnings | integer | 累计总收益 |  |
| total_referrals | integer | 所有下级总数量 |  |
| withdrawable_balance | integer | 可提现余额 |  |

### jfq_server_api_v1.AffiliatesReferralDetailResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.ReferralCardItem |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.AffiliatesReferralsHomeResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.AffiliatesReferralsHomeResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.AffiliatesReferralsHomeResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| activeReferrals | integer |  |  |
| guest | integer |  |  |
| inviteUrl | string |  |  |
| newToday | array<jfq_server_api_v1.ReferralCardItem> |  |  |
| recentRecharge | array<jfq_server_api_v1.ReferralCardItem> |  |  |
| recharged | integer |  |  |
| registered | integer |  |  |
| shareText | string |  |  |
| starred | array<jfq_server_api_v1.ReferralCardItem> |  |  |

### jfq_server_api_v1.AffiliatesReferralsResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.AffiliatesReferralsResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.AffiliatesReferralsResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| count | integer |  |  |
| results | array<jfq_server_api_v1.ReferralCardItem> |  |  |

### jfq_server_api_v1.BindPhoneRequest

| Field | Type | Description | Example |
|---|---|---|---|
| account_id | string |  | 1309775982 |
| code | string |  | 1234 |
| phone | string |  | 9310926499 |

### jfq_server_api_v1.BindPhoneResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.BindPhoneResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.BindPhoneResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| accessToken | string |  |  |
| status | jfq_server_pkg_types_enums.UserStatus |  |  |

### jfq_server_api_v1.CheckVerificationCodeRequest

| Field | Type | Description | Example |
|---|---|---|---|
| code | string |  |  |
| phone | string |  | 9310926499 |
| type | jfq_server_pkg_types_enums.VerificationCodeType |  | 1 |

### jfq_server_api_v1.CheckVerificationCodeResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.CheckVerificationCodeResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.CheckVerificationCodeResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| credentials | string |  |  |

### jfq_server_api_v1.CreateUserResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| accessToken | string |  |  |
| account_id | string |  |  |
| is_new_user | boolean |  |  |

### jfq_server_api_v1.CreateWithdrawAccountRequest

| Field | Type | Description | Example |
|---|---|---|---|
| account_holder_name | string |  |  |
| account_number | string |  |  |
| ifsc_code | string |  |  |
| pay_channel | integer | Phone             string `json:"phone" v:"required"` Email             string `json:"email" v:"required"` Address           string `json:"address" v:"required"` |  |
| pay_method | integer |  |  |

### jfq_server_api_v1.CreateWithdrawAccountResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.CreateWithdrawAccountResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.CreateWithdrawAccountResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| account_holder_name | string |  | John Doe |
| account_number | string |  | 1234567890123456 |
| id | integer |  | 1 |
| ifsc_code | string |  | HDFC0000123 |
| pay_channel | integer |  | 1 |
| pay_method | integer |  | 1 |

### jfq_server_api_v1.CustomerServiceResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.CustomerServiceResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.CustomerServiceResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| authedUrl | string |  |  |
| url | string |  |  |

### jfq_server_api_v1.EarningDetailItem

| Field | Type | Description | Example |
|---|---|---|---|
| amount | integer | 金额 |  |
| countdown | integer | 审核倒计时(秒)，仅在Pending状态下显示 最后一日0点开始显示倒计时 |  |
| date | string | 日期，格式为 dd.mm.yy |  |
| days_left | string | 审核倒计时(天数) |  |
| is_guest | boolean | 是否是游客 |  |
| is_today | boolean | 是否是今日 |  |
| status | integer | 状态：Pending, Success, Fail对应 1，2，3 |  |

### jfq_server_api_v1.EarningDetailResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| count | integer |  |  |
| results | array<jfq_server_api_v1.EarningDetailItem> |  |  |

### jfq_server_api_v1.GetRuleResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.GetRuleResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.GetRuleResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| link | string |  |  |

### jfq_server_api_v1.ListWithdrawAccountResponseResultItem

| Field | Type | Description | Example |
|---|---|---|---|
| account_holder_name | string |  |  |
| account_number | string |  |  |
| address | string |  |  |
| email | string |  |  |
| id | integer |  |  |
| ifsc_code | string |  |  |
| pay_channel | integer |  |  |
| pay_method | integer |  |  |
| phone | string |  |  |

### jfq_server_api_v1.ListWithdrawInfoResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | array<jfq_server_api_v1.ListWithdrawAccountResponseResultItem> |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.LoginResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.LoginResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.LoginResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| accessToken | string |  |  |
| status | jfq_server_pkg_types_enums.UserStatus |  |  |

### jfq_server_api_v1.PaymentChannelInfo

| Field | Type | Description | Example |
|---|---|---|---|
| channel_name | string | 通道名称 | Bank Transfer |
| fee_rate | integer | 费率(单位: 万分之一) | 10 |
| id | integer | 配置ID | 1 |
| is_active | boolean | 是否激活 | True |
| max_amount | integer | 最大金额 | 1000000 |
| min_amount | integer | 最小金额 | 10000 |
| payment_channel | integer | 支付渠道 1.tpay 2.cashfree | 1 |
| payment_method | integer | 支付方式 1.bank 2.upi | 1 |

### jfq_server_api_v1.PersonalProfileResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.PersonalProfileResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.PersonalProfileResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| account_id | string |  |  |
| password | string |  |  |
| phone | string |  |  |
| withdraw_threshold | jfq_server_api_v1.WithdrawThreshold |  |  |
| withdrawable | integer |  |  |

### jfq_server_api_v1.ReceiveTrackRequest

| Field | Type | Description | Example |
|---|---|---|---|
| data | string | base64编码后的事件数据 |  |
| merchantNo | string | 商户编号 | merchant-001 |
| sign | string | 签名 |  |
| timestamp | integer | 接口请求时间戳 | 171170095 |

### jfq_server_api_v1.ReferralAccountFilter

Enum: `all`, `registered`, `guest`

### jfq_server_api_v1.ReferralCardItem

| Field | Type | Description | Example |
|---|---|---|---|
| accountStatus | string |  |  |
| bindStatus | jfq_server_api_v1.ReferralStatus |  |  |
| boundAt | string |  |  |
| commissionLast7Days | integer |  |  |
| displayText | jfq_server_api_v1.ReferralDisplayText |  |  |
| firstRechargeAmount | integer |  |  |
| firstRechargeTime | string |  |  |
| id | integer |  |  |
| isNewToday | boolean |  |  |
| lastRechargeAmount | integer |  |  |
| lastRechargeTime | string |  |  |
| rechargeCount | integer |  |  |
| rechargeStatus | string |  |  |
| registerTime | string |  |  |
| starred | boolean |  |  |
| starredAt | string |  |  |
| tags | array<string> |  |  |
| totalCommission | integer |  |  |
| totalRechargeAmount | integer |  |  |
| unboundAt | string |  |  |
| userId | string |  |  |

### jfq_server_api_v1.ReferralDisplayText

| Field | Type | Description | Example |
|---|---|---|---|
| bindText | string |  |  |
| commissionLast7DaysText | string |  |  |
| firstRechargeText | string |  |  |
| lastRechargeText | string |  |  |
| rechargeText | string |  |  |
| totalCommissionText | string |  |  |
| totalRechargeText | string |  |  |

### jfq_server_api_v1.ReferralRechargeFilter

Enum: `all`, `recharged`, `not_recharged`

### jfq_server_api_v1.ReferralSort

Enum: `binding_latest`, `binding_earliest`, `recharge_latest`, `recharge_highest`

### jfq_server_api_v1.ReferralStatus

Enum: `binding`, `unbound`

### jfq_server_api_v1.ReferralUnboundRange

Enum: `all_time`, `today`, `last_7_days`, `last_30_days`

### jfq_server_api_v1.ResetPasswordRequest

| Field | Type | Description | Example |
|---|---|---|---|
| code | string |  | 1234 |
| new_password | string |  | Abc123 |
| phone | string |  | 9310926499 |

### jfq_server_api_v1.ResetPasswordResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.ResetPasswordResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.ResetPasswordResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| message | string |  |  |

### jfq_server_api_v1.Response

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data |  |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.SendVerificationCodeRequest

| Field | Type | Description | Example |
|---|---|---|---|
| phone | string |  | 9310926499 |
| type | jfq_server_pkg_types_enums.VerificationCodeType |  | 1 |

### jfq_server_api_v1.TermsUrlResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.TermsUrlResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.TermsUrlResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| privacy_policy | string | 隐私政策 |  |
| terms_and_conditions | string | 条款和条件 |  |
| terms_of_service | string | 服务条款 |  |

### jfq_server_api_v1.UpdateReferralStarRequest

| Field | Type | Description | Example |
|---|---|---|---|
| starred | boolean |  |  |

### jfq_server_api_v1.UpdateReferralStarResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.UpdateReferralStarResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.UpdateReferralStarResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| id | integer |  |  |
| starred | boolean |  |  |
| starredAt | string |  |  |

### jfq_server_api_v1.UpdateWithdrawAccountRequest

| Field | Type | Description | Example |
|---|---|---|---|
| account_holder_name | string |  |  |
| account_number | string |  |  |
| id | integer |  | 1 |
| ifsc_code | string |  |  |

### jfq_server_api_v1.VersionCheckResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.VersionCheckResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.VersionCheckResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| cueFreq | jfq_server_pkg_types_enums.JfqAppUpdateCueFreq |  |  |
| displayText | string |  |  |
| downloadUrl | string |  |  |
| updateType | jfq_server_pkg_types_enums.JfqAppUpdateType |  |  |
| updatedVersion | string |  |  |

### jfq_server_api_v1.WithdrawOrderData

| Field | Type | Description | Example |
|---|---|---|---|
| account_number | string | 收款账户 | 788767672893991231 |
| amount | integer | 金额 | 10000 |
| balance | integer | 余额 | 99990000 |
| ifsc_code | string | ifscCode | 98827732 |
| order_no | string | 订单号 | 788767672893991231 |
| pay_channel | integer | 提现渠道 | 1 |
| pay_method | integer | 提现 | 1 |
| reason | string | 原因 | fail reason :user card is illegal |
| status | integer | 状态: In review 1, Success 2, Failed 3 | 2 |
| time | string | 时间 (RFC3339格式) | 2024-03-01T23:23:23Z |
| withdraw_id | integer | 订单ID | 123 |

### jfq_server_api_v1.WithdrawOrderResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.WithdrawOrderResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.WithdrawOrderResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| count | integer |  |  |
| results | array<jfq_server_api_v1.WithdrawOrderData> |  |  |

### jfq_server_api_v1.WithdrawPageInfoResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| account_id | string | 账户ID | 1234567890 |
| payment_channels | array<jfq_server_api_v1.PaymentChannelInfo> | 支付渠道列表 |  |
| withdrawable | integer | 可提现金额 | 100000 |

### jfq_server_api_v1.WithdrawRequest

| Field | Type | Description | Example |
|---|---|---|---|
| amount | integer |  | 100000 |
| payment_channel | integer | 支付渠道 1.tpay 2.cashfree |  |
| payment_method | integer | 支付方式 1.bank 2.upi |  |
| withdraw_account_id | integer | 提现账号ID |  |

### jfq_server_api_v1.WithdrawResponse

| Field | Type | Description | Example |
|---|---|---|---|
| code | integer |  |  |
| data | jfq_server_api_v1.WithdrawResponseData |  |  |
| errors | object |  |  |
| message | string |  |  |

### jfq_server_api_v1.WithdrawResponseData

| Field | Type | Description | Example |
|---|---|---|---|
| fee | integer | 手续费 | 1000 |
| first_withdrawal | boolean | 是否第一次提现 | False |
| real_amount | integer | 实际到账金额 | 100000 |
| total_amount | integer | 总金额（提现金额+手续费） | 101000 |

### jfq_server_api_v1.WithdrawThreshold

| Field | Type | Description | Example |
|---|---|---|---|
| fee | string |  |  |
| max_amount | integer |  |  |
| min_amount | integer |  |  |

### jfq_server_pkg_types_enums.JfqAppUpdateCueFreq

Enum: `1`, `2`, `3`

### jfq_server_pkg_types_enums.JfqAppUpdateType

Enum: `1`, `2`

### jfq_server_pkg_types_enums.JfqTextType

Enum: `1`, `2`, `3`, `4`, `5`, `6`

### jfq_server_pkg_types_enums.UserStatus

Enum: `0`, `1`

### jfq_server_pkg_types_enums.VerificationCodeType

Enum: `1`, `2`, `3`

### jfq_server_pkg_types_enums.WithdrawType

Enum: `1`, `2`, `3`
