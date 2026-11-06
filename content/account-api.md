# Meo Account API

怎么用 Meo Account 的接口：登录、读取账号信息、管理会话和云端备份、调用 Meo AI。仍在开发中，接口可能变化；以线上实际行为为准。

## 基本信息

- 基础地址：`https://api.meoarch.org/v1`
- 账号页面：`account.meoarch.org`，Meo AI 网页版：`chat.meoarch.org`
- 请求和响应都是 JSON（`Content-Type: application/json`）。请求体有大小上限，超过会返回 `413 request_too_large`。
- 浏览器跨域调用只允许来自 `account.meoarch.org` 和 `chat.meoarch.org`。

## 登录与授权

两种身份可以调用 `/v1/*`：

| 身份 | 方式 | 权限 |
|---|---|---|
| 网页登录 | Meo Account 的登录 Cookie | 不受 scope 限制 |
| 原生应用 / 第三方客户端 | `Authorization: Bearer <access_token>`，令牌由 Meo Account 的 OAuth 2.1 颁发（授权码 + S256 PKCE） | `meo:read` 允许 `GET`/`HEAD`，`meo:write` 允许其他方法 |

登录、注册和 OAuth 2.1 端点在 `/v1/auth/*` 下，例如换取令牌是 `POST /v1/auth/oauth2/token`。第三方客户端如何注册还没有公开说明。

敏感操作（改密码、改邮箱、删除账号、管理两步验证等）需要先重新验证身份：用 `POST /v1/reauth/password` 或 `POST /v1/reauth/totp`，请求体 `{ "purpose": "account_security" }`，成功后 10 分钟内有效。`purpose` 可以是 `account_security`、`billing`、`delete_account`。

## 错误

读错误码（`error` 字符串），不要依赖文字信息。

| 状态 | 含义 |
|---|---|
| `400 invalid_request` | 请求格式或内容不对 |
| `401 unauthenticated` | 没有有效的登录或令牌 |
| `403 insufficient_scope` | 令牌缺少 `meo:read` / `meo:write` |
| `403 reauth_required` | 需要先重新验证身份 |
| `404` | 资源不存在，或不属于你（别人的资源一律返回 404） |
| `409` | 冲突，例如 `backup_limit_reached` |
| `503` | 依赖服务还没准备好 |

## 账号

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/me` | 当前身份（简要） |
| `GET` | `/account` | 账号概览：资料、角色、会员 |
| `GET` `PATCH` | `/profile` | 读取、修改资料 |
| `GET` `PATCH` | `/settings` | 读取、修改可编辑的偏好 |
| `GET` | `/plans` | 方案目录：`free`、`plus`、`pro` |
| `GET` | `/subscription` | 当前订阅，只读（付费方案由服务端决定，付款功能尚未开放） |
| `GET` | `/linked-providers` | 已绑定的登录方式 |
| `GET` | `/security-events` | 自己的安全记录 |
| `GET` | `/account/export` | 导出自己的账号数据 |
| `DELETE` | `/account` | 删除账号（需要 `delete_account` 的重新验证并明确确认） |

### 会话

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/sessions` | 自己的登录会话 |
| `DELETE` | `/sessions/:id` | 注销一个会话 |
| `DELETE` | `/sessions/others` | 注销除当前外的所有会话 |
| `DELETE` | `/sessions` | 注销所有会话 |

### 云端备份（设置清单）

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/backups` | 列表（每个账号最多 20 个） |
| `POST` | `/backups` | 上传，满了返回 `409 backup_limit_reached` |
| `GET` | `/backups/:id` | 下载 |
| `DELETE` | `/backups/:id` | 删除 |

## Meo AI

下面的接口需要 `meo:write`（或网页登录），并使用你自己账号里的模型连接（`credentialId`）。模型提供商的密钥保存在账号里，不会发给客户端。

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` `POST` | `/conversations` | 对话列表、新建 |
| `GET` `POST` | `/conversations/:id/messages` | 读取、追加消息 |
| `POST` | `/chat/stream` | 发送一次对话并流式接收回复 |
| `POST` | `/images/generate` | 生成图片（结果不会被保存） |
| `POST` | `/search/web` | 为一次对话做联网搜索 |
| `GET` `POST` | `/ai/credentials` | 查看、创建模型连接（只返回元信息，不返回密钥） |
| `GET` `POST` | `/projects` | 项目列表、新建 |
| `GET` `POST` | `/ai/memories` | 个人记忆 |
| `GET` | `/usage-dashboard?days=` | 用量，`days` 为 7 到 730 |

`POST /chat/stream` 的请求体必填：`credentialId`、`model`、`prompt`（最长 35000 字）。可选：`conversationId`、`consent`、`webResults`、`images`。多余的字段会被拒绝（`invalid_request`）。

## 状态检查

- `GET /health`：服务是否在线，不需要登录。
- `GET /ready`：数据库表是否就绪，没有就绪返回 `503`。

## 还没有的

付款、结算页和账单回调（Plus、Pro 目前只是目录里的占位）。
