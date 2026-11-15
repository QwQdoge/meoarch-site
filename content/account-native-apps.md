# Meo Account 原生应用接入

给在 MeoArch 桌面上开发或打包应用的人：应用怎么使用 Meo Account，怎么拿到令牌，需要声明什么。接口细节见 [Meo Account API](/docs/guide/account-api.html)。仍在开发中，以实际行为为准。

## 总览

桌面上由一个按用户运行的 Meo Account 代理（D-Bus 名称 `org.meo.Accounts1`）保存系统登录。它：

- 把登录信息保存在 KWallet 里，**不会把访问令牌或刷新令牌交给任何应用**，D-Bus 上没有返回令牌的方法；
- 在应用发起请求时，由代理带上令牌去调用 Meo API，只把结果交给应用；
- 要显示的授权、同意和重新验证对话框都由代理弹出，应用拿不到密码。

应用想使用账号，有两种方式：

| 方式 | 适合 | 令牌在哪 |
|---|---|---|
| 让代理代办（`StartAccountOperation`、`StartCloudAiOperation`、`StartLocalAiOperation`、`StartUsageOperation`） | 备份、本机或云端 AI 对话、用量上报 | 只在代理里 |
| 应用自己取令牌（`authorize_client`） | 需要流式对话（`/v1/chat/stream`）或代理没有的接口 | 在应用自己手里，须存入系统钥匙串 |

代理的 AI 对话是**一次返回整段答案**，没有流式方法。需要流式回答，只能走第二种方式。

## 先声明：客户端清单

应用的安装包要在 `/usr/share/meo-account/clients/<名称>.json` 放一份清单。代理只信任清单里写明的可执行文件，调用方的真实路径对不上就拒绝。清单规则不满足时整份被忽略。

| 字段 | 要求 |
|---|---|
| `id` | 不为空，≤128 字符，例如 `org.meo.OmniStore` |
| `name` | 不为空，≤160 字符 |
| `oauthClientId` | 不为空，≤256 字符；必须是已登记的 OAuth 客户端 |
| `redirectUri` | 路径必须是 `/callback`，不能带查询、片段、用户信息或端口。形式只能是 `https://<域名>/callback`，或 `<自定义协议>://auth/callback`（协议不能是 `http`、`https`、`file`、`data`、`javascript`） |
| `executables` | 不为空的绝对路径列表，调用方的真实可执行文件必须在其中 |
| `scopes` | 不为空，只能是 `openid`、`profile`、`email`、`phone`、`offline_access`、`meo:read`、`meo:write` |
| `capabilities` | 可选，只能是 `local_ai`、`ai_usage_sync`、`ai_personalization`；只在本机生效，不会发给账号服务 |

清单里的 scope 应当是登记时批准的 scope 的子集；超出的部分授权时会被拒绝。能力由安装包拥有：卸载或替换安装包就撤销了它，没有第二份可修改的权限库。

```json
{
  "id": "org.example.App",
  "name": "Example",
  "oauthClientId": "<已登记的客户端 id>",
  "redirectUri": "exampleapp://auth/callback",
  "executables": ["/usr/bin/example"],
  "scopes": ["openid", "profile"],
  "capabilities": []
}
```

## 自己取令牌：`authorize_client`

1. 应用生成相互独立的随机 `state`（32–256 字符）和 PKCE S256 的 `code_challenge`（43–128 字符），调用
   `RequestAuthentication(clientId, "authorize_client", { state, codeChallenge })`，得到 `requestId`。
2. 代理核对调用方，弹出原生授权对话框。用户同意后，代理用系统浏览器打开 `/v1/auth/oauth2/authorize`，参数包括 `client_id`、`redirect_uri`、`response_type=code`、`resource=https://api.meoarch.org`、清单里的 scope、`state`、`code_challenge` 和 `code_challenge_method=S256`。
3. 浏览器把一次性的 `code` 带回应用的回调地址。应用先校验 `state`，再自己向 `POST /v1/auth/oauth2/token` 用 `code_verifier` 换取令牌。
4. 应用调用 `RegisterClientSession(clientId, sessionId, accountId, logoutEpoch)`。代理只保存 `clientId`、`sessionId`、`accountId`、登记时间和本地登出代数，系统登出时据此撤销这个应用的远程会话，并发出 `clientSignOutRequested`。

请求状态：`waiting_for_user` → `opening_browser` → `waiting_for_callback` → `completed`，或 `denied`、`failed`、`expired`。请求 5 分钟后过期。用 `GetRequest(requestId)` 轮询，或监听 `requestChanged` 信号。

自己持有令牌的应用必须：

- 把令牌放进 KWallet 或系统钥匙串，不写进配置文件、日志或环境变量；
- 访问令牌 15 分钟过期，需要刷新时才申请 `offline_access`；
- 清除本地令牌不等于撤销远程会话，要撤销请调用 `POST /v1/auth/oauth2/revoke`。

## 让代理代办

### 账号与备份

`StartAccountOperation(action, arguments)` 返回 `requestId`，结果通过 `requestChanged` 或 `GetRequest` 取得，只对发起请求的应用可见。备份相关的动作：

| `action` | 参数 | 说明 |
|---|---|---|
| `list_backups` | | 列出云端备份 |
| `upload_backup` | `manifestJson` | 上传一份 `org.meo.backup/v1` 清单 |
| `download_backup` | `backupId` | 下载 |
| `delete_backup` | `backupId` | 删除 |

清单格式见 API 文档“云端备份”一节。

### AI 对话

对话分三步，并要求用户明确同意：

1. `prepare_inference`：返回一份将要发送内容的摘要和 5 分钟有效的摘要哈希。
2. 应用把摘要展示给用户并取得同意。
3. `invoke`：只接受与第 1 步完全相同的内容。内容变了，或需要再发起一次网络请求，必须重新同意。

两类入口：

| 入口 | 连接来自 | 动作 |
|---|---|---|
| `StartLocalAiOperation(clientId, action, arguments)` | 本机保存的连接（Ollama、OpenAI 兼容）；密钥只存在代理里，应用拿不到 | `prepare_inference`、`invoke`、`revoke_catalog_consent` 等 |
| `StartCloudAiOperation(clientId, action, arguments)` | 你账号里的云端模型连接 | `list_connections`、`discover_models`、`prepare_inference`、`invoke`、`deny_inference` |

两者都要求清单声明 `local_ai` 能力。`ListAvailableLocalAiConnections(clientId)` 只返回提供商、显示名、地址、默认模型、是否启用等元数据，不返回密钥。自定义的 OpenAI 兼容连接必须是 HTTPS，且拒绝本机、私有和链路本地地址；代理不跟随重定向。

### 用量

清单声明 `ai_usage_sync` 的应用，可以通过 `/org/meo/Accounts1/Usage` 对象提交或读取用量：`StartUsageOperation(clientId, action, payloadJson)`，`GetUsageRequest(clientId, requestId)`，状态变化由 `usageRequestChanged` 通知。代理只放行约定好的字段（来源、会话、项目标识、提供商、模型、时间、token 数、耗时、估算费用），其余字段在发出前丢弃，所以文件名、本地路径、提示词和消息内容都不会离开本机。

## 登记客户端

OAuth 客户端目前只能由 Meo 维护者登记，没有自助注册，也还没有公开的申请流程。以下是登记时需要提供的信息（具体流程尚未公开）：

- 唯一的客户端 id；
- 确切的回调地址（同清单里的 `redirectUri`）；
- 申请的 scope：写入权限 `meo:write` 只在确实需要时申请，只读功能用 `meo:read`；
- 说明用途，以及是否需要 `offline_access`（刷新令牌）。

登记完成前，清单里不要写会被拒绝的 scope，也不要使用占位的客户端 id。

## 常见问题

| 现象 | 原因 |
|---|---|
| `RequestAuthentication` 返回空 | 调用方的可执行文件不在清单里，或清单无效 |
| 授权页提示 `invalid_target` | 客户端没有绑定到 `https://api.meoarch.org` |
| API 返回 `403 insufficient_scope` | 令牌没有 `meo:read` / `meo:write` |
| API 返回 `403 oauth_client_mismatch` | 请求里的 `clientId` 与令牌所属客户端不一致 |
| 授权对话框弹出但一直 `waiting_for_user` | 用户还没有操作；5 分钟后过期 |
