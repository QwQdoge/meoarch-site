# Meo AI

Meo AI 是 MeoArch 的助手：日常对话、本机或远程的 Agent 工作，以及可审阅的系统操作，在桌面和网页上是同一套体验。**目前是开发预览版**，不是每一种模型提供商和系统组合都完成了实机验收。

## 获取（Beta）

所有构建都是 Beta（GitHub 预发布）。从 [GitHub 发布页](https://github.com/QwQdoge/meo-ai/releases) 下载：

| 平台 | 文件 | 说明 |
|---|---|---|
| Windows 10/11 (x64) | `…-windows-x64-setup.exe` | 安装包，可从发布页自动更新 |
| Windows 10/11 (x64) | `…-windows-x64-portable.zip` | 解压后运行 `meo-ai-desktop.exe`，免安装、不自动更新 |
| Android 9+ | `…-android.apk` | 测试构建，使用调试密钥签名 |
| Arch Linux | `yay -Syu meo-ai-beta` | 签名的 Meo 软件源的 Beta 通道 |
| 网页 | `chat.meoarch.org` | 在浏览器里使用 |

发布页的文件附有 `SHA256SUMS.txt`，下载后请核对。

## 现在能用的

- 流式对话，可以真正停止；断线重连，处理过期的对话。
- 保存的历史对话：恢复、全文搜索、重命名、删除，导出为 Markdown。
- 附件：文件、图片、长文本，支持拖放和剪贴板；发给纯文本模型前会检查是否支持图片。
- 选择模型、按角色路由模型、记忆、技能（Skills）、MCP 可见性。
- 响应详情：用量、耗时、上下文、来源、工具活动；“AI 活动”视图显示当前请求和历史用量。
- 接入 Meo Account：账号里的模型连接。
- 系统操作通过有类型的 System AI Router，需要确认。

## 常用操作

| 做什么 | 怎么做 |
|---|---|
| 新对话 | `Ctrl+N` |
| 找旧对话 | 响应详情 → 对话，搜索标题和可见的消息文字（不含隐藏的工具内容） |
| 附加上下文 | 点附件按钮选择或拖放文件，粘贴剪贴板的文件或图片，或附加长文本；剪贴板里的网址不会自动下载 |
| 导出或删除 | 对话视图中导出为 Markdown，或确认后永久删除（本地附件一并清理） |
| 查看过程 | 响应详情看元数据和来源，AI 活动看请求状态和用量汇总 |

## 数据与网络

Meo AI 以本地优先，但“本地优先”不等于不联网：

- 你选择的模型提供商会联系它自己的接口；
- Meo Account 可能代理账号里的模型连接和同步；
- 明确启用的工具可以联系它们各自协议允许的服务。

对话内容和待发送的附件留在本机，除非某次请求明确把内容发给你选择的模型。提供商密钥不会成为 Meo AI 自己的第二份密钥库：账号里的密钥放在 Meo Account 和 KWallet 的边界后面。系统操作受 System AI Router 的能力和确认策略约束，不靠提示词授权。更多见 [隐私政策](privacy.md)。

## 排错

出现“AgentService not connected”时：

```bash
python3 -m meo.runtime.main --self-check
systemctl --user status meo-agent-service.service
journalctl --user -u meo-agent-service.service -b
```

原生应用只接受本机回环地址的 AgentService。

## 开发者

仓库：[meo-ai](https://github.com/QwQdoge/meo-ai)。客户端：桌面是 Rust + Qt/QML + MeoUI，网页是 React + TypeScript，安卓是 Kotlin + Jetpack Compose，共享的业务能力是 Meo AI 核心加有版本的 Meo API。调用接口见 [Meo Account API](account-api.md)。
