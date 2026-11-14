# Meo Account API

本页是指南：登录、令牌、流式对话、错误码、额度和备份格式。全部接口的路由表见 [Meo API 参考](api-reference.md)；桌面应用见 [原生应用接入](account-native-apps.md)。

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

登录、注册和 OAuth 2.1 端点在 `/v1/auth/*` 下：

| 端点 | 路径 |
|---|---|
| 授权 | `GET /v1/auth/oauth2/authorize` |
| 换取令牌 | `POST /v1/auth/oauth2/token` |
| 用户信息 | `GET /v1/auth/oauth2/userinfo` |
| 撤销 | `POST /v1/auth/oauth2/revoke` |

令牌的受众（`resource`）是 `https://api.meoarch.org`。客户端是公开客户端：需要 PKCE（S256），不使用客户端密钥。访问令牌有效期 15 分钟；要刷新令牌需要 `offline_access`，且客户端被允许使用刷新令牌。可申请的 scope：`openid`、`profile`、`email`、`offline_access`、`meo:read`、`meo:write`。

**第三方客户端目前不能自助注册**：每个客户端需要由 Meo 维护者登记确切的回调地址，尚没有公开的申请流程。桌面应用如何通过 Meo Account 代理取得令牌，见 [原生应用接入](/docs/guide/account-native-apps.html)。

令牌与客户端绑定：调用需要 `clientId` 的 AI 接口时，请求里的 `clientId` 必须与令牌所属客户端一致，否则返回 `403 oauth_client_mismatch`。

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
| `405 method_not_allowed` | 路径存在，但方法不对 |
| `409` | 冲突，例如 `backup_limit_reached` |
| `413 request_too_large` | 请求体超过上限 |
| `503` | 依赖服务还没准备好 |

错误响应体是 `{ "error": { "code": "…" } }`，偶尔带 `message`。AI 相关的错误码见下文“AI 错误码”一节。

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
| `GET` | `/backups` | 列表，返回 `{ backups, maximumBytes, maximumCount }`，只含元数据 |
| `POST` | `/backups` | 上传一份清单，成功 `201 { backup }`；满了返回 `409 backup_limit_reached`；格式不对 `400 invalid_backup` |
| `GET` | `/backups/:id` | 下载，返回 `{ backup }`，含 `content` |
| `DELETE` | `/backups/:id` | 删除，返回 `{ deleted: true }` |

备份是不可变的，每份 ≤ 512 KiB。账号需要已验证邮箱并完成激活。

**清单格式 `org.meo.backup/v1`**（严格校验，多余字段会被拒绝）：

| 字段 | 要求 |
|---|---|
| `schema` | 固定为 `org.meo.backup/v1` |
| `createdAt` | ISO-8601 时间 |
| `secretsIncluded` | 必须是 `false`；清单里不允许放任何密钥 |
| `contents.applications` | 数组，最多 10000 项：`{ id, sourceId }` 或 `{ id, sourceId, version }`；`id` 匹配 `^[A-Za-z0-9][A-Za-z0-9._+@-]{0,255}$`，`sourceId` 匹配 `^[a-z0-9][a-z0-9-]{0,63}$`，`version` ≤ 120 字符 |
| `contents.applicationsState` | `included` 或 `unavailable`（后者时 `applications` 必须为空） |
| `contents.settings` | 目前只接受 `controlCenter` 和 `shell` 两类 Meo 外观设置 |
| `contents.userData` | 必须是空数组；不备份用户文件 |

应用清单会暴露用户装了哪些应用，请只在用户明确选择时才放入，否则用 `applicationsState: "unavailable"`。

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

### 对话：准备与流式

对话分两步，并要求你先看到并同意将要发送的内容：

1. `POST /chat/prepare`：与流式请求同样的请求体，但不带 `consent`。返回一份将要发送内容的说明（`consent`）。
2. `POST /chat/stream`：带上第 1 步返回的 `requestId`、`payloadSha256` 和 `confirmationVersion: 1`，才会真正调用模型。

请求体字段（多余的字段会被拒绝，`400 invalid_request`）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `credentialId` | uuid | 必填，你自己的模型连接 |
| `model` | 字符串，≤160 | 必填 |
| `prompt` | 字符串，≤35000 | 必填；上下文过长时先裁掉较早的内容 |
| `consent` | 对象 | 流式必填：`{ requestId, payloadSha256, confirmationVersion: 1 }` |
| `conversationId` | uuid 或 null | 读取已保存的上下文 |
| `webResults`、`images` | 数组 | 联网搜索结果、图片 |
| `skillId`、`workAgentProjectId`、`mcpAuto`、`mcpContinuation`、`environment`、`tools`、`turns` | 可选 | 技能、工具调用、运行环境等 |

`/chat/prepare` 返回：

```json
{ "consent": {
  "requestId": "uuid", "credentialId": "uuid",
  "payloadSha256": "十六进制摘要", "confirmationVersion": 1,
  "expiresAt": "ISO-8601", "provider": "…", "providerName": "…",
  "destination": "https://…", "model": "…", "clientId": "…",
  "purpose": "meo_ai_chat", "dataCategories": ["…"],
  "promptCharacters": 1234, "operation": "text_inference" } }
```

同意记录 5 分钟内有效，只能用一次。两次调用之间内容不能变；变了会返回 `409 consent_request_mismatch`，需要重新准备并让用户重新确认。

### 流式响应格式

成功时返回 `200`，`Content-Type: text/event-stream; charset=utf-8`。每一帧是：

```text
event: <名称>
data: <一行 JSON>

```

| 事件 | `data` | 含义 |
|---|---|---|
| `delta` | `{"text":"…"}` | 回答的下一段文字，按顺序追加 |
| `truncated` | `{}` | 回答因输出上限被截断，**不是**完整答案 |
| `tool_calls` | `{"calls":[{"id","name","arguments"}]}` | 模型对你声明的 `tools` 发起的调用；没有这一帧表示模型已说完 |
| `mcp_tool_proposal` | 提议对象 | 模型提议调用一个 MCP 工具，需要用户批准 |
| `work_agent_proposal` | `{"project_id","task"}` | 提议交给设备上的 Agent 执行；永远不会自动执行 |
| `done` | `{"model","requestId"}` | 正常结束，最后一帧 |
| `error` | `{"message":"…"}` | 流开始后出错；之后不会有 `done` |

说明：

- 顺序：很多个 `delta`，然后可能有 `truncated`、`tool_calls`、`mcp_tool_proposal`、`work_agent_proposal`，最后 `done`。流结束时既没有 `done` 也没有 `error`，请按失败处理。
- 流里**没有**token 用量、结束原因等字段。
- 部分模型提供商不支持流式：回答会作为一个 `delta` 一次到达，然后 `done`。
- 模型提供商首字节最长等 180 秒，之后连续 90 秒没有数据就中止，并发出 `error`。
- `error.message` 是给人看的笼统文字，不要解析。
- 客户端断开会取消上游请求，这次同意记录作废。

### AI 错误码

流开始之前的失败是普通 JSON（不是 SSE）：`{ "error": { "code": "…" } }`。

| 状态 | `code` | 含义 |
|---|---|---|
| 400 | `invalid_request`、`invalid_credential`、`invalid_conversation`、`invalid_json`、`invalid_consent`、`invalid_images`、`invalid_output_limit`、`invalid_temperature`、`invalid_data_categories`、`native_tools_not_supported` | 请求内容不对 |
| 401 | `unauthenticated` | 没有有效令牌 |
| 403 | `insufficient_scope` | 令牌缺少 `meo:write` |
| 403 | `oauth_client_mismatch` | 请求里的 `clientId` 与令牌不符 |
| 404 | `ai_credential_unavailable`、`skill_unavailable`、`work_agent_project_unavailable` | 不存在或不属于你 |
| 409 | `consent_invalid_or_used`、`consent_request_mismatch` | 同意记录已用过、过期或与内容不符 |
| 413 | `request_too_large` | 请求体太大 |
| 428 | `fresh_explicit_consent_required` | 需要重新准备并再次征得同意 |
| 429 | `too_many_consent_requests` | 同时未完成的同意记录太多 |
| 499 | `ai_provider_request_cancelled` | 调用方取消了请求 |
| 502 | `ai_provider_authentication_failed` | 模型提供商拒绝了保存的密钥 |
| 502 | `ai_model_or_endpoint_not_found` | 提供商那里找不到这个模型或地址 |
| 502 | `ai_provider_rate_limited` | 是**你的模型提供商**在限流 |
| 502 | `ai_provider_unavailable` | 提供商服务出错（5xx） |
| 502 | `ai_provider_rejected_request` | 提供商拒绝了请求（其他 4xx） |
| 502 | `ai_provider_unreachable`、`invalid_ai_provider_response`、`ai_provider_no_text_output`、`ai_provider_response_too_large` | 连接或返回内容有问题 |
| 503 | `credential_decryption_failed`、`credential_encryption_unavailable` | 服务端暂时无法使用这个连接 |
| 504 | `ai_provider_timeout` | 提供商没有在时限内开始响应 |
| 500 | `chat_orchestration_failed`、`ai_broker_unavailable` | 服务出错 |

## 模型

模型来自**你自己账号里的模型连接**，Meo 不提供统一的模型清单，也不按方案限制可用模型。

`GET /ai/credentials/:id/models` 返回：

```json
{ "supported": true, "cached": false,
  "models": [{ "id": "…", "name": "…", "description": "最多 500 字",
               "task": "chat", "tasks": ["…"],
               "inputModalities": ["…"], "outputModalities": ["…"] }] }
```

- 最多返回 500 个模型；同一个连接的结果缓存 5 分钟，修改连接后立刻失效。
- `task` 表示模型用来做什么（对话、生成图片、编辑图片、视频、语音等），`inputModalities` 和 `outputModalities` 表示它接受和产出的内容类型。请只在对应的场景里提供对应的模型。
- `GET /ai/model-profiles` 列出命名的“角色 → 模型”配置，最多 20 个。

## 方案与额度

- `GET /plans` 返回方案目录：`free`、`plus`、`pro`。目前没有设置价格，结账未开放。
- 所有账号都有一个有效的 Free 订阅；`GET /subscription` 只读。
- **目前没有对任何方案强制执行额度**：没有按月的 token 上限、请求数上限或模型限制。请不要在界面里显示额度数字；等服务端定义后再显示。
- 服务端有的硬性限制：

| 项目 | 上限 |
|---|---|
| 对话 `prompt` | 35000 字 |
| 图片 `prompt` | 4000 字 |
| 云端备份 | 每个账号 20 份，每份 ≤ 512 KiB |
| 用量事件 | 每次 1–250 条，请求体 ≤ 2.5 MB |
| 访问令牌 | 15 分钟 |
| 重新验证 | 10 分钟 |
| AI 同意记录 | 5 分钟 |

## 用量

用量记录的是 **AI 的 token 用量**，不是安装了哪些应用。

- `POST /usage-events`：请求体是 JSON **数组**，1–250 条，每次 ≤ 2.5 MB（超出 `400 invalid_usage_batch`，单条无效 `400 invalid_usage_event`）。以 `(来源 source, source_event_id)` 去重，重复提交会覆盖，成功返回 `202 { accepted: n }`。
- 每条事件可包含：`source`、`source_event_id`、会话与项目标识、`provider`、`model`、`model_role`、发生时间、输入 / 缓存 / 缓存写入 / 输出 / 推理 token 数、耗时、估算费用（微美元）。
- `GET /usage-dashboard?days=`：`days` 为 7 到 730 的整数（默认 365），否则 `400 invalid_days`。

## 实时变更

`GET /realtime` 升级为按账号的变更流，需要 `meo:read`。事件类型包括 `memory.changed`、`settings.changed`、`projects.changed`、`files.changed`；在多台设备上同时进行的对话还会推送 `run.delta` 等事件。事件内容的字段目前没有公开说明，请不要依赖未列出的字段。

## 本页没有涉及

对话之外的工具与连接（插件、MCP、设备配对、Agent 运行）、文件上传、个性化设置和管理员接口有各自的路由，本页没有写，也没有保证稳定。

## 状态检查

- `GET /health`：服务是否在线，不需要登录。
- `GET /ready`：数据库表是否就绪，没有就绪返回 `503`。

## 还没有的

付款、结算页和账单回调（Plus、Pro 目前只是目录里的占位），以及 `/v1/sync` 同步流。额度也还没有强制执行（见上文“方案与额度”）。
