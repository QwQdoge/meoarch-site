<!-- Generated from content/privacy.md. Edit the source, not this copy. -->

# 隐私政策 / Privacy Policy

最后更新：2026-11-13。本政策同时适用于 **Meo 账号**（account.meoarch.org）和 **Meo AI**（网页、桌面和 Android）。两者共用同一个账号和同一套数据，所以共用同一份政策。Meo 仍在公开开发中，目前是测试版。

## 一句话版本

- 你的聊天、项目、记忆和文件存在你的 Meo 账号里，只有你能看到，用来在你的设备之间同步。
- 我们不卖数据，不投放广告，不接入第三方统计或追踪，也不用你的内容训练模型。
- 你让 AI 回答时，需要的内容会发给**你自己连接的模型提供商**，这是回答所必需的一步。
- 你可以随时导出全部数据，也可以删除账号，删除后数据一并删除。

## 我们保存什么

| 类别 | 内容 | 用途 |
|---|---|---|
| 账号 | 邮箱、名称、用户名、登录方式（密码的哈希或 Google / GitHub 关联）、会话、两步验证、已登记的设备、安全事件（例如登录、删除账号） | 让你登录并保护账号 |
| Meo AI 内容 | 聊天和消息、项目（名称、说明、项目记忆）、个人记忆、你上传的文件、模型方案和路由、设置、已安装的插件和授权 | 提供功能并在设备间同步 |
| 模型提供商密钥 | 你添加的 API 密钥，加密后保存 | 代你调用你选的模型 |
| 用量记录 | 每次回答的估算 token 数、模型名、提供商名、时间、所属项目名 | “用量”页的统计；token 数是按文字长度估的 |
| 授权审计 | 每次请求的编号、内容哈希、提供商、模型、数据类别、你是否同意 | 证明某次请求经过了你的同意；**不保存请求的内容** |
| 远程任务 | 你让另一台设备运行的任务的事件记录 | 在你的设备之间转交和续跑任务 |

## 保存在你设备上的内容

- 聊天的离线缓存和偏好设置，方便没网时也能看。登录令牌放在系统的安全存储里，不放普通配置文件。
- Work 用到的本地文件、文件夹路径、命令输出**留在你的设备上**。只有你在对话里让模型读取的那部分内容，才会作为这次请求的一部分发给模型提供商。
- 项目绑定的本地文件夹路径不会存到服务器。你自己的几台在线设备之间会实时互相转发这些信息，服务器不保存。
- 电脑控制和浏览器控制默认关闭。你打开后，截图只在模型请求且你授权的操作里才会发给模型。

## 我们会把数据发给谁

只在提供功能所必需的时候发送，并且不发给广告或数据经纪商：

| 接收方 | 发送什么 | 为什么 |
|---|---|---|
| **你连接的模型提供商** | 你的消息、对话上下文、附件和图片、被选中的记忆、项目说明、工具和搜索结果 | 生成回答。提供商如何处理这些内容，受它自己的政策约束，请在连接前阅读 |
| 网页搜索（Tavily、Brave） | 搜索词 | 你开启联网搜索时，由 Meo API 代你搜索 |
| 网页读取 | 你或模型要读的网址 | 由 Meo API 代你取回页面内容 |
| 你启用的应用和连接器（MCP） | 该应用需要的请求内容 | 让模型使用 GitHub、Notion 等应用；你授权后才会发送，数据遵守对方的政策 |
| Resend | 你的邮箱和邮件内容 | 发送验证和安全邮件 |
| Cloudflare | 访问请求，以及人机验证（Turnstile）所需的信息 | 托管网站和 API，防止滥用 |
| Neon | 全部已保存的数据（加密传输） | 数据库，位于 AWS 新加坡区域 |
| 浏览器厂商 | 麦克风音频 | 只在你点网页版的麦克风按钮时，由浏览器自带的语音识别处理，**不经过 Meo** |

我们没有接入统计、广告或崩溃上报类的第三方 SDK。

## 我们怎么对待你的内容

- 不出售，不用于广告，不用来训练模型。
- 运营者不会为了好奇去阅读你的聊天内容。只有在你主动报告问题需要排查，或为了处理滥用、安全事件、法律要求时，才可能查看相关数据。
- 管理后台显示的是账号信息（邮箱、角色、登录时间、数量统计），不是聊天内容。
- 需要对外说明的是：数据库由运营者管理，因此技术上运营者有权限访问存储的数据。以上是我们的承诺，不是技术上的不可能。

## 保存多久，怎么删除

- **删除某个聊天、项目、记忆或文件**：对应数据随之删除。
- **删除账号**：在 Meo 账号的“隐私”里操作，需要再次验证并输入 DELETE。账号和属于它的数据会一起删除。账号所有者需要先转让所有权。
- **数据库的时间点历史**：数据库提供商保留的短期历史约 6 小时，之后不再保留。
- **导出**：在 Meo 账号的“隐私”里可以下载全部数据（JSON）。导出里**不含**密钥这类机密信息。
- **设备上的缓存**：退出登录或卸载后可删除；你也可以手动清除应用数据。
- **用量记录和授权审计**随账号保存，账号删除时一并删除。

## 你的控制权

- 随时在设置里关闭联网搜索、记忆、自动命名标题、电脑控制、浏览器控制。
- 每个插件和应用的授权可以单独撤销；每台设备的会话可以单独退出。
- 修改、导出、删除你的数据，直接在应用里做，不需要联系我们。

## 安全

- 传输使用 TLS；模型提供商密钥加密保存；登录令牌放在系统安全存储。
- 会话可撤销，敏感操作需要再次验证。
- 没有任何系统是绝对安全的。如果发生影响你的数据泄露，我们会尽快通知你。

## 未成年人

Meo 不面向 13 岁以下的儿童，也不会有意收集他们的数据。所在地区有更高年龄要求的，以当地规定为准。

## 政策的变化

我们会在本页更新日期，重要变化会在应用里提示。继续使用表示你接受更新后的政策。

## 联系方式

通过 [GitHub 上的 meo-ai 仓库](https://github.com/QwQdoge/meo-ai/issues) 提出问题或请求。

---

# Privacy Policy (English)

Last updated: 2026-11-13. This policy covers **Meo Account** (account.meoarch.org) and **Meo AI** (web, desktop and Android). They share one account and one set of data, so they share one policy. Meo is in public development and is currently a beta.

## In short

- Your chats, projects, memories and files are stored in your Meo account, visible only to you, so they follow you across devices.
- We do not sell data, show ads, use third-party analytics or tracking, or train models on your content.
- When you ask the AI something, what the answer needs is sent to **the model provider you connected**. That is required to answer.
- You can export all your data at any time and delete your account; deleting removes the data with it.

## What we store

| Category | What | Why |
|---|---|---|
| Account | Email, name, username, sign-in method (password hash or Google / GitHub link), sessions, two-factor settings, registered devices, security events (such as sign-in and account deletion) | To sign you in and protect the account |
| Meo AI content | Chats and messages, projects (name, instructions, project memory), personal memory, files you upload, model profiles and routes, settings, installed plugins and grants | To provide the features and sync them |
| Provider keys | The API keys you add, stored encrypted | To call your chosen models for you |
| Usage records | Estimated tokens per answer, model, provider, time, project name | The Usage page; token counts are estimated from text length |
| Consent audit | Per request: an id, a content hash, provider, model, data categories and whether you approved | To prove a request was approved; **the request content is not kept** |
| Remote tasks | Event records of a task you hand to another device | To pass a task between your devices and resume it |

## What stays on your device

- An offline cache of chats and your preferences. The sign-in token lives in the system's secure store, not in an ordinary config file.
- Local files, folder paths and command output used by Work **stay on your device**. Only the part you ask the model to read is sent to the model provider as part of that request.
- Local folder paths bound to a project are not stored on the server. Your own signed-in devices relay them to each other live; the server does not keep them.
- Computer control and browser control are off by default. When on, a screenshot goes to the model only for an action the model requests and you allow.

## Who receives data

Only when needed to provide the feature, and never to advertisers or data brokers:

| Recipient | What | Why |
|---|---|---|
| **The model provider you connected** | Your messages, conversation context, attachments and images, selected memory, project instructions, tool and search results | To generate the answer. How the provider handles it is governed by its own policy; read it before you connect |
| Web search (Tavily, Brave) | The search query | When you turn on web search, Meo API searches for you |
| Page fetch | The URL you or the model want read | Meo API fetches the page for you |
| Apps and connectors (MCP) you enable | The request that app needs | So the model can use apps such as GitHub or Notion; sent only after you authorize, under that app's policy |
| Resend | Your email address and message | To send verification and security email |
| Cloudflare | Requests, and what the Turnstile bot check needs | Hosting the site and API, preventing abuse |
| Neon | All stored data (encrypted in transit) | The database, in the AWS Singapore region |
| Your browser vendor | Microphone audio | Only when you press the microphone button on the web; the browser's own speech recognition handles it, **not Meo** |

We do not include analytics, advertising or crash-reporting SDKs from third parties.

## How we treat your content

- We do not sell it, use it for ads, or train models on it.
- Operators do not read your chats out of curiosity. Related data may be viewed only when you report a problem that needs investigating, or to deal with abuse, security incidents or legal requirements.
- The admin console shows account information (email, role, sign-in times, counts), not chat content.
- To be plain: the database is run by the operators, so technically they can access stored data. The above is our commitment, not a technical impossibility.

## How long, and how to delete

- **Deleting a chat, project, memory or file** deletes that data.
- **Deleting your account**: in Meo Account under Privacy, with re-verification and typing DELETE. The account and the data that belongs to it are deleted together. An account owner must transfer ownership first.
- **Database point-in-time history**: the database provider keeps short-lived history, about six hours, then it is gone.
- **Export**: Meo Account under Privacy lets you download all your data (JSON). The export **omits** secrets such as keys.
- **On-device cache**: removed when you sign out or uninstall; you can also clear app data yourself.
- **Usage records and the consent audit** are kept with the account and deleted with it.

## Your controls

- Turn off web search, memory, automatic titles, computer control and browser control in Settings at any time.
- Each plugin and app grant can be revoked on its own; each device's session can be signed out on its own.
- Change, export and delete your data right in the app, without contacting us.

## Security

- TLS in transit; provider keys encrypted at rest; sign-in tokens in the system secure store.
- Sessions are revocable and sensitive actions need re-verification.
- No system is perfectly secure. If a breach affects your data, we will tell you promptly.

## Children

Meo is not for children under 13 and does not knowingly collect their data. Where your region sets a higher age, that applies.

## Changes

We update the date above, and show important changes in the app. Continuing to use Meo means you accept the updated policy.

## Contact

Raise questions or requests through the [meo-ai repository on GitHub](https://github.com/QwQdoge/meo-ai/issues).
