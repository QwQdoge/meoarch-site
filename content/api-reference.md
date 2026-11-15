# Meo API 参考

做应用需要的全部接口。基础地址 `https://api.meoarch.org/v1`。登录、令牌、流式对话的细节、错误码和额度见 [Meo Account API](account-api.md)；桌面应用怎么取得令牌见 [原生应用接入](account-native-apps.md)。

仍在开发中，以线上实际行为为准。本页只列出路由和约定；没有写明的字段以实际响应为准，请不要依赖未写明的字段。

## 约定

- 请求和响应都是 JSON（`Content-Type: application/json`），除非另有说明。请求体有大小上限，超过返回 `413 request_too_large`。
- 错误响应是 `{ "error": { "code": "…" } }`，请读 `code` 而不是文字。常见：`400 invalid_request`、`401 unauthenticated`、`403 insufficient_scope`、`403 reauth_required`、`404`（不存在，或不属于你）、`405 method_not_allowed`、`409`、`503`。
- 别人的资源一律返回 `404`，不会是 `403`。每个受保护的查询都限定在当前账号。
- 浏览器跨域调用只允许 `https://account.meoarch.org` 和 `https://chat.meoarch.org`，方法 `GET, HEAD, POST, PATCH, DELETE, OPTIONS`，请求头 `Authorization, Content-Type, DPoP`。
- 被封禁或已删除的账号在认证后会被拒绝。

## 认证

| 身份 | 方式 | scope |
|---|---|---|
| 网页登录 | 登录 Cookie | 不受限 |
| 原生或第三方客户端 | `Authorization: Bearer <访问令牌>` | `meo:read` 允许 `GET`/`HEAD`，`meo:write` 允许其他方法 |

OAuth 2.1 的端点在 `/v1/auth/*`（授权码 + S256 PKCE）。`POST /v1/auth/login` 是 `/v1/auth/sign-in/email` 的兼容别名。注册、登录等可能需要 Cloudflare Turnstile 令牌，由服务端校验。

### 受保护的账号操作

下面这些不能只靠一个登录会话直接调用，需要一个新鲜的、限定用途的重新验证授权：`change-password`、`link-social`、`unlink-account`、`two-factor/enable`、`two-factor/disable`、`two-factor/get-totp-uri`、`two-factor/generate-backup-codes`、`revoke-session`、`revoke-sessions`、`revoke-other-sessions`。

`/v1/auth/change-email` 和 `/v1/auth/delete-user` 被直接禁用（`use_account_api`），请用 `POST /v1/account/email` 和 `DELETE /v1/account`。直接调用 `/v1/auth/request-password-reset` 和 `/v1/auth/send-verification-email` 同样被禁用（`use_account_security_api`），请用下面的账号接口。

### 重新验证

用途：`account_security`、`admin`、`billing`、`delete_account`。客户端可以发起重新验证，但永远不能自己生成或声明授权。

| 方法 | 路径 | 说明 |
|---|---|---|
| `POST` | `/reauth/password` | 证明当前密码，得到 `{purpose}` 的授权，600 秒有效 |
| `POST` | `/reauth/totp` | 证明一次性验证码，得到授权 |
| `GET` | `/auth/reauth/methods` | 当前账号可用的重新验证方式 |
| `GET` | `/auth/reauth/status` | 是否有一个新鲜的授权 |
| `POST` | `/auth/reauth/start` | 发起 Google/GitHub 重新验证，`{provider, purpose}`；回调必须对应同一个账号 |

请求 `{ "purpose": "account_security" }`，响应 `{ "verified": true, "purpose": "…", "expires_in_seconds": 600 }`。

## 状态

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` `HEAD` | `/health` | 服务是否在线，无需登录；不查数据库 |
| `GET` `HEAD` | `/ready` | 必需的数据表是否就绪，没有则 `503` |
| `GET` `HEAD` | `account.meoarch.org/v1/auth/capabilities` | 已启用的登录方式（公开的布尔值） |

## 账号

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/me` | 当前身份（简要） |
| `GET` | `/account` | 账号概览：资料、角色、数量、会员 |
| `GET` `PATCH` | `/profile` | 读取、修改资料 |
| `GET` `PATCH` | `/settings` | 读取、修改可编辑的偏好（只接受白名单里的字段） |
| `GET` | `/plans` | 方案目录：`free`、`plus`、`pro` |
| `GET` | `/subscription` | 当前订阅，只读（付费等级由服务端决定） |
| `GET` | `/linked-providers` | 已绑定的登录方式，不含令牌 |
| `GET` | `/security-events` | 自己的安全记录 |
| `POST` | `/account/activate` | 一次性的人机激活，需要登录会话和 Turnstile 令牌 |
| `POST` | `/account/email` | 发起主邮箱修改（两步；需要重新验证）。新邮箱验证前保持待定，原邮箱会收到通知 |
| `POST` | `/account/password` | 给只用社交登录的账号添加初始密码（需要重新验证） |
| `POST` | `/account/security` | `{action}`：`account_overview`，或 `revoke_registered_sessions`（`targetSessionIds` ≤100 个，需要 `account_security` 授权） |
| `POST` | `/account/desktop-operations` | 桌面客户端的账号操作交接 |
| `GET` | `/account/export` | 导出自己的账号数据 |
| `DELETE` | `/account` | 删除账号（需要 `delete_account` 授权并明确确认；会吊销会话和令牌） |
| `POST` | `/account/password-reset/request` | 请求重置密码（带 Turnstile，不暴露账号是否存在） |
| `POST` | `/account/send-verification-email` | 重发验证邮件（需登录，带 Turnstile） |

### 会话

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/sessions` | 自己当前的登录会话（安全的元数据，没有原始令牌） |
| `DELETE` | `/sessions/:id` | 注销一个会话 |
| `DELETE` | `/sessions/others` | 注销除当前外的所有会话 |
| `DELETE` | `/sessions` | 注销所有会话 |

### 云端备份

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/backups` | 列表（每个账号最多 20 份） |
| `POST` | `/backups` | 上传一份 `org.meo.backup/v1` 清单 |
| `GET` | `/backups/:id` | 下载 |
| `DELETE` | `/backups/:id` | 删除 |

清单格式和限制见 [Meo Account API](account-api.md) 的“云端备份”。

## 对话与消息

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/conversations` | 按游标分页，只含自己的 |
| `POST` | `/conversations` | 新建对话 |
| `GET` | `/conversations/:id/messages` | 读取消息 |
| `POST` | `/conversations/:id/messages` | 追加一条有长度限制的消息 |

## 对话生成、图片、搜索

都是 `POST`，需要 `meo:write`（或网页登录），并使用你自己的模型连接（`credentialId`）；提供商密钥永远不会到客户端。

| 路径 | 说明 |
|---|---|
| `/chat/prepare` | 校验并组装一次对话请求（同意、个人上下文、技能、MCP 工具），不调用提供商。可选 `environment`：`{client: desktop\|web\|android, os, locale, timezone, device, role, thinking, webSearch, subagents, location}`，告诉模型它运行在哪里 |
| `/chat/stream` | 与 `prepare` 同样的输入，流式返回模型的回答，格式见 [Meo Account API](account-api.md) |
| `/images/prepare` | 校验一次生成图片的请求 |
| `/images/generate` | 生成图片；结果按提供商返回的原样给出，不会保存。请求体：`credentialId`、`model`、`prompt`（≤4000 字）、`size`、`consent` |
| `/search/web` | 服务端联网搜索，用来给一次对话提供依据 |
| `/fetch/web` | 把一个网址读成文本或 Markdown，供 `web_fetch` 工具使用：只允许 http(s)，网址里不能带凭据，不能是本机或私有地址，只跟随同源重定向，限制大小和时间，只接受文本类内容；非 2xx 状态会原样返回而不是报错 |

## 模型连接

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/ai/credentials` | 连接的元数据，永远不返回密钥 |
| `POST` | `/ai/credentials` | 创建一个加密保存的模型连接 |
| `PATCH` `DELETE` | `/ai/credentials/:id` | 修改、删除 |
| `GET` | `/ai/credentials/:id/models` | 发现该连接的模型（含能力），按连接缓存 5 分钟；修改连接后失效 |
| `POST` | `/ai/credentials/:id/test` | 测试连接 |
| `POST` | `/ai/credentials/:id/test-image` | 测试图片能力 |
| `POST` | `/ai/provider-broker` | 受同意约束的提供商操作（`action` 如 `list_models`、`prepare_inference`、`invoke`、`deny_inference`） |
| `GET` | `/ai/model-profiles` | 账号的模型配置，以及角色目录（id、名称、用途、需要的任务和输入、准确度、影响、延迟、用量、说明）。服务端还没升级时返回 `503 model_profiles_unavailable` |
| `POST` | `/ai/model-profiles` | 新建 `{name, description?, roles?}`；`roles` 把角色 id 对应到 `{credentialId, model}`。未知的角色、不属于你的连接会被丢弃并列在 `warnings`。最多 20 个 |
| `PATCH` | `/ai/model-profiles/:id` | 修改名称、说明，或合并 `roles`（`null` 清除一个角色） |
| `DELETE` | `/ai/model-profiles/:id` | 删除 |
| `POST` | `/ai/model-profiles/:id/activate` | 设为账号当前使用的配置（至多一个） |
| `POST` | `/ai/model-profiles/generation-prompt` | `{requirements}` → `{prompt, connections}`：让模型起草配置所需的文字。客户端要通过正常的、需要同意的对话流程把它发出去 |
| `POST` | `/ai/model-profiles/draft` | `{text}`（模型的回复）→ `{draft: {name, description, roles, warnings}}`，只校验，不保存 |
| `POST` | `/ai/orchestration` | `{stage: router\|plan\|step\|judge, message, thinking, …}` → `{prompt}`：多次调用才能完成一个回答的某个阶段所需的文字（router 选角色，plan 列步骤，step 执行一步，judge 给 0–100 打分）。客户端用对应角色的模型，通过需要同意的对话流程运行 |

## 个性化、项目、文件

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` `PATCH` | `/ai/settings` | AI 个性化设置 |
| `GET` `POST` | `/ai/memories` | 个人记忆：列表、新建 |
| `PATCH` `DELETE` | `/ai/memories/:id` | 修改、删除 |
| `GET` `POST` | `/projects` | 项目：列表、新建 |
| `GET` `PATCH` `DELETE` | `/projects/:id` | 读取、修改、删除 |
| `GET` `POST` | `/projects/:id/memories` | 项目记忆 |
| `DELETE` | `/projects/:id/memories/:memoryId` | 删除一条 |
| `GET` | `/storage` | 存储是否可用、配额状态 |
| `GET` `POST` | `/files` | 文件：列表、上传，限定在某个项目和/或对话 |
| `GET` | `/files/:id/content` | 下载内容 |
| `DELETE` | `/files/:id` | 删除 |

文件范围的错误：`invalid_file_scope`（400）、`project_not_found` / `conversation_not_found`（404）、`attachment_scope_mismatch`（409）。

## 插件、MCP 和技能

对话里的工具调用受同意和批准约束，在服务端强制执行；可选的 MCP / 技能表没有准备好时返回 `503 mcp_storage_unavailable`。

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/ai/catalog/mcp` | MCP 目录 |
| `GET` | `/ai/catalog/github-skill` | 解析一个托管在 GitHub 的技能 |
| `GET` `POST` | `/ai/plugins` | 插件：列表、新建（`kind`：`mcp`、`skills`、`bundle`） |
| `PATCH` `DELETE` | `/ai/plugins/:id` | 修改、删除 |
| `PUT` | `/ai/plugins/:id/skills` | 替换一个插件的技能 |
| `GET` | `/ai/plugins/:id/tools` | 列出插件的工具 |
| `POST` | `/ai/plugins/:id/tools/prepare` | 准备一次工具调用，等待批准 |
| `POST` | `/ai/plugins/:id/tools/call` | 执行已批准的工具调用 |
| `POST` | `/ai/plugins/:id/tools/auto` | 自动执行被允许的只读工具 |
| `POST` | `/ai/plugins/:id/oauth/start` | 开始连接托管 MCP 服务的 OAuth 流程，`{web?: boolean}`，返回 `{url}` 让用户在浏览器里打开 |
| `PUT` `DELETE` | `/ai/plugins/:id/secret` | 保存（`{token}`）或清除托管 MCP 服务的令牌或授权；只有使用令牌的服务才允许 PUT |
| `GET` | `/ai/plugins/grants` | 列出对只读 MCP 工具的长期同意 |
| `PUT` `DELETE` | `/ai/plugins/grants` | 创建（`{pluginId, toolName, mode:"always"}`）或撤销（`{pluginId, toolName}`）长期同意；仅限浏览器会话（`mcp_browser_session_required`） |

运行工具需要一个会话 id（浏览器会话，或 OAuth 令牌里的 `sid`），对 Bearer 客户端还需要 `meo:write`；客户端应在调用 `tools/prepare` 和 `tools/call` 之前自己弹出批准提示。每次写入类工具调用都需要一次性的批准。

GitHub 的 MCP 连接使用你已绑定的 GitHub 账号的令牌，只在服务端使用，不会返回给客户端；没绑定时返回 `mcp_github_not_linked`，令牌不可用时返回 `mcp_github_reauthorization_required`。

## 设备、配对和 Agent 运行

**配对**：设备只有在已登录的用户批准它的代码之后，才会得到凭据。

| 方法 | 路径 | 认证 | 说明 |
|---|---|---|---|
| `POST` | `/ai/device-enrollments/start` | 无（边缘限流） | 开始配对，返回用户代码和一次性的设备密钥 |
| `POST` | `/ai/device-enrollments/poll` | 设备密钥 | `pending` → `approved`（凭据只返回一次） |
| `GET` | `/ai/device-enrollments/:code` | 用户 | 预览请求 |
| `POST` | `/ai/device-enrollments/:code/approve` | 用户 | 批准配对 |

**设备与运行**：

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` `POST` | `/ai/devices` | 列出、登记设备元数据 |
| `GET` | `/ai/workspaces` | 自己设备上报的工作区 |
| `POST` | `/ai/agent-runs` | 创建一次运行 |
| `GET` `PATCH` | `/ai/agent-runs/:id` | 读取、变更状态 |
| `GET` `POST` | `/ai/agent-runs/:id/events` | 读取、追加运行事件 |

对话里的模型可以**提议**工作（`work_agent_proposal`），但永远不会自动派发一次运行。

## 用量

| 方法 | 路径 | 说明 |
|---|---|---|
| `POST` | `/usage-events` | 1–250 条一批，按 `(source, source_event_id)` 去重，返回 `202 {accepted}` |
| `GET` | `/usage-dashboard?days=` | `days` 为 7–730（默认 365） |

用量是 AI 的 token 用量，字段见 [Meo Account API](account-api.md)。

## 实时

`GET /realtime` 升级为按账号的变更流，需要 `meo:read`。事件类型：`memory.changed`、`settings.changed`、`projects.changed`、`files.changed`，以及对话进行时的 `run.delta`。

## 还没有的

付款、结算页、客户门户和账单回调（Plus、Pro 目前是目录里的占位，结账未开放）；`/v1/sync` 同步流；对任何方案强制执行额度。
