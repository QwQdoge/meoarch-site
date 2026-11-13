# 隐私政策 / Privacy Policy

最后更新：2026-11-13。

本政策适用于 **Meo 账号**（account.meoarch.org）及 **Meo AI**（网页、桌面和 Android 客户端）。二者使用同一账号和同一套数据，因此适用同一份政策。Meo 目前处于公开开发阶段，提供的是测试版本。

## 1. 概述

1. 您的聊天、项目、记忆和文件保存在您的 Meo 账号中，用于在您的设备之间同步，仅限您本人访问。
2. 我们不出售个人数据，不投放广告，不接入第三方统计或追踪组件，不使用您的内容训练模型。
3. 当您请求 AI 生成回答时，生成回答所必需的内容将发送至您自行连接的模型提供商。
4. 您可以随时导出全部数据，亦可删除账号；账号删除后，其数据一并删除。

## 2. 我们保存的信息

| 类别 | 内容 | 用途 |
|---|---|---|
| 账号信息 | 邮箱、名称、用户名、登录方式（密码哈希，或 Google / GitHub 关联）、会话、两步验证设置、已登记设备、安全事件（如登录、账号删除） | 登录验证与账号保护 |
| Meo AI 内容 | 聊天与消息、项目（名称、说明、项目记忆）、个人记忆、上传的文件、模型方案与路由、设置、已安装的插件及授权 | 提供功能并在设备间同步 |
| 模型提供商密钥 | 您添加的 API 密钥（加密存储） | 代您调用所选模型 |
| 用量记录 | 每次回答的估算 token 数、模型名、提供商名、时间、所属项目名 | 用量统计；token 数依据文本长度估算 |
| 授权审计 | 每次请求的编号、内容哈希、提供商、模型、数据类别、是否获得同意 | 证明请求经过同意；不保存请求内容 |
| 远程任务 | 您委托给另一台设备执行的任务的事件记录 | 在您的设备之间转交并续跑任务 |

## 3. 保存在您设备上的信息

1. 聊天的离线缓存与偏好设置保存在设备本地。登录令牌保存在操作系统的安全存储中，不写入普通配置文件。
2. Work 使用的本地文件、文件夹路径与命令输出保留在您的设备上。仅当您要求模型读取时，被读取的部分才会作为该次请求的一部分发送至模型提供商。
3. 项目绑定的本地文件夹路径不存储于服务器；该信息仅在您已登录的在线设备之间实时转发，服务器不保留。
4. 电脑控制与浏览器控制默认关闭。启用后，屏幕截图仅在模型提出操作且经您授权时才会发送给模型。

## 4. 信息的接收方

我们仅在提供相应功能所必需时共享信息，不向广告商或数据经纪商提供任何信息。

| 接收方 | 共享内容 | 目的 |
|---|---|---|
| 您连接的模型提供商 | 消息、对话上下文、附件与图片、所选记忆、项目说明、工具与搜索结果 | 生成回答；提供商对这些内容的处理适用其自身政策，请在连接前阅读 |
| 网页搜索（Tavily、Brave） | 搜索关键词 | 您启用联网搜索时，由 Meo API 代为检索 |
| 网页读取 | 需读取的网址 | 由 Meo API 代为获取页面内容 |
| 您启用的应用与连接器（MCP） | 该应用所需的请求内容 | 使模型能够调用 GitHub、Notion 等应用；仅在您授权后发送，适用对方的政策 |
| Resend | 您的邮箱地址与邮件内容 | 发送验证与安全邮件 |
| Cloudflare | 访问请求及人机验证（Turnstile）所需信息 | 托管网站与 API，防止滥用 |
| Neon | 全部已保存的数据（传输加密） | 数据库服务，位于 AWS 新加坡区域 |
| 浏览器厂商 | 麦克风音频 | 仅在您使用网页版语音输入时，由浏览器自带的语音识别处理，不经过 Meo |

我们的客户端不包含第三方统计、广告或崩溃上报组件。

## 5. 我们如何处理您的内容

1. 我们不出售您的内容，不将其用于广告，亦不用于训练模型。
2. 我们不会主动查阅您的聊天内容。仅在您报告问题且排查需要，或为处理滥用、安全事件及履行法律义务时，才可能查看相关数据。
3. 管理后台显示的是账号层面的信息（邮箱、角色、登录时间、数量统计），不显示聊天内容。
4. 加密情况说明：传输过程使用 TLS；模型提供商密钥以 AES-GCM 加密存储。聊天消息、项目与记忆等内容目前**未**在应用层单独加密，其存储保护依赖数据库服务提供商的存储安全与访问控制。数据库由运营者管理，因此运营者在技术上具备访问所存储数据的权限；上述第 2 款为我们的承诺，而非技术上的限制。

## 6. 保存期限与删除

1. 删除某个聊天、项目、记忆或文件时，对应数据一并删除。
2. 删除账号：在 Meo 账号的“隐私”中操作，需再次验证身份并输入 DELETE。账号及其名下数据一并删除；账号所有者须先转让所有权。
3. 数据库提供商保留的时间点历史约为 6 小时，期满后不再保留。
4. 导出：在 Meo 账号的“隐私”中可下载全部数据（JSON 格式）。导出文件不包含密钥等机密信息。
5. 设备本地缓存可在退出登录、卸载应用或清除应用数据时删除。
6. 用量记录与授权审计随账号保存，并在账号删除时一并删除。

## 7. 您的控制权

1. 您可随时在设置中关闭联网搜索、记忆、自动生成标题、电脑控制与浏览器控制。
2. 每个插件与应用的授权可单独撤销；每台设备的会话可单独退出。
3. 您可直接在应用内更正、导出和删除您的数据，无需联系我们。

## 8. 安全

1. 数据传输使用 TLS；模型提供商密钥加密存储；登录令牌保存在系统安全存储中。
2. 会话可撤销，敏感操作需再次验证。
3. 任何系统均无法保证绝对安全。如发生影响您数据的泄露事件，我们将及时通知您。

## 9. 未成年人

Meo 不面向 13 岁以下的儿童，亦不会有意收集其个人信息。所在地区对年龄有更高要求的，从其规定。

## 10. 政策变更

我们会更新本页顶部的日期，并在应用内提示重要变更。变更生效后继续使用 Meo，视为您接受更新后的政策。

## 11. 联系方式

如有疑问或请求，请通过 [meo-ai 的 GitHub 仓库](https://github.com/QwQdoge/meo-ai/issues) 提出。

---

# Privacy Policy (English)

Last updated: 2026-11-13.

This policy applies to **Meo Account** (account.meoarch.org) and **Meo AI** (web, desktop and Android clients). Both use one account and one set of data and are therefore governed by one policy. Meo is in public development and is offered as a beta.

## 1. Summary

1. Your chats, projects, memories and files are stored in your Meo account to synchronize across your devices, and are accessible only to you.
2. We do not sell personal data, display advertising, include third-party analytics or tracking components, or use your content to train models.
3. When you request an AI response, the content needed to produce it is sent to the model provider you have connected.
4. You may export all of your data at any time and may delete your account; on deletion, its data is deleted with it.

## 2. Information we store

| Category | Content | Purpose |
|---|---|---|
| Account | Email, name, username, sign-in method (password hash, or Google / GitHub link), sessions, two-factor settings, registered devices, security events (such as sign-in and account deletion) | Authentication and account protection |
| Meo AI content | Chats and messages, projects (name, instructions, project memory), personal memory, uploaded files, model profiles and routes, settings, installed plugins and grants | Providing the features and synchronizing them |
| Provider keys | API keys you add (stored encrypted) | Calling your chosen models on your behalf |
| Usage records | Estimated tokens per answer, model, provider, time, project name | Usage statistics; token counts are estimated from text length |
| Consent audit | Per request: an identifier, a content hash, provider, model, data categories and whether consent was given | Evidencing that a request was approved; request content is not retained |
| Remote tasks | Event records of a task you delegate to another device | Handing a task between your devices and resuming it |

## 3. Information kept on your device

1. An offline cache of chats and your preferences are stored locally. The sign-in token is held in the operating system's secure store and is not written to an ordinary configuration file.
2. Local files, folder paths and command output used by Work remain on your device. Only the portion you ask the model to read is sent to the model provider, as part of that request.
3. Local folder paths bound to a project are not stored on the server; they are relayed in real time only between your own signed-in online devices and are not retained by the server.
4. Computer control and browser control are off by default. When enabled, a screenshot is sent to the model only for an action the model proposes and you authorize.

## 4. Recipients of information

We share information only where necessary to provide the relevant feature, and never with advertisers or data brokers.

| Recipient | Information shared | Purpose |
|---|---|---|
| The model provider you connect | Messages, conversation context, attachments and images, selected memory, project instructions, tool and search results | Generating the response; the provider's handling of this content is governed by its own policy, which you should read before connecting |
| Web search (Tavily, Brave) | The search query | When you enable web search, Meo API searches on your behalf |
| Page retrieval | The URL to be read | Meo API retrieves the page content on your behalf |
| Apps and connectors (MCP) you enable | The request content that app requires | Enabling the model to use apps such as GitHub or Notion; sent only after you authorize, and subject to that app's policy |
| Resend | Your email address and message content | Sending verification and security email |
| Cloudflare | Requests, and the information the Turnstile bot check requires | Hosting the site and API; preventing abuse |
| Neon | All stored data (encrypted in transit) | Database service, in the AWS Singapore region |
| Your browser vendor | Microphone audio | Only when you use web voice input, processed by the browser's built-in speech recognition and not by Meo |

Our clients do not include third-party analytics, advertising or crash-reporting components.

## 5. How we handle your content

1. We do not sell your content, use it for advertising, or use it to train models.
2. We do not proactively review your chat content. Related data may be accessed only where you report a problem and investigation requires it, or to address abuse or security incidents, or to meet legal obligations.
3. The administration console displays account-level information (email, role, sign-in times, counts), not chat content.
4. Encryption: data in transit is protected with TLS; model provider keys are stored encrypted with AES-GCM. Chat messages, projects and memories are not currently encrypted separately at the application layer; their storage protection relies on the database provider's storage security and on access control. The database is administered by the operators, who therefore have technical access to stored data; paragraph 2 above is our commitment and not a technical restriction.

## 6. Retention and deletion

1. Deleting a chat, project, memory or file deletes the corresponding data.
2. Account deletion: performed in Meo Account under Privacy, with re-verification and by typing DELETE. The account and the data belonging to it are deleted together; an account owner must first transfer ownership.
3. The database provider retains point-in-time history for approximately six hours, after which it is not retained.
4. Export: Meo Account under Privacy allows you to download all of your data (JSON). The export omits secrets such as keys.
5. The on-device cache is removed on sign-out, uninstallation or clearing of app data.
6. Usage records and the consent audit are kept with the account and deleted with it.

## 7. Your controls

1. You may turn off web search, memory, automatic titles, computer control and browser control in Settings at any time.
2. Each plugin and app grant may be revoked individually; each device's session may be signed out individually.
3. You may correct, export and delete your data directly in the app, without contacting us.

## 8. Security

1. Data in transit uses TLS; model provider keys are stored encrypted; sign-in tokens are kept in the system secure store.
2. Sessions are revocable and sensitive actions require re-verification.
3. No system can be guaranteed to be perfectly secure. If a breach affects your data, we will notify you promptly.

## 9. Children

Meo is not directed at children under 13 and does not knowingly collect their personal information. Where your region sets a higher minimum age, that age applies.

## 10. Changes to this policy

We will update the date at the top of this page and indicate material changes in the app. Continued use of Meo after a change takes effect constitutes acceptance of the updated policy.

## 11. Contact

For questions or requests, please use the [meo-ai repository on GitHub](https://github.com/QwQdoge/meo-ai/issues).
