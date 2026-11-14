# OmniStore

OmniStore 是 MeoArch 的软件商店。它是原生的 Qt 6 / QML 客户端（基于 [MeoUI](/docs/meoui/index.html)），加一个 Python 后端，用来发现软件来源、搜索、安装、卸载和更新。

## 安装

```bash
yay -Syu omnistore-bin
```

要一次装好全部 MeoArch 软件，见 [安装指南](install.md)。

## 能做什么

- **来源**：Meo/Arch 软件源和 Flatpak 是常规来源；AUR 是明确标注的社区来源；GitHub、AppImage 等专门来源放在“高级来源管理”里。当前系统上不可用的来源不会当作已启用的来源显示。
- **页面**：首页（推荐、热门、最近更新）、探索（分类）、已安装、更新、设置。搜索和任务进度在顶栏里，不占主导航。
- **应用详情**：只显示后端真正提供的信息（图标、截图、说明、开发者、来源、版本、许可证、大小）。缺失的信息会省略，不会编造评分、截图或权限。
- **任务**：安装、卸载和更新由后台的事务服务执行。**关闭 OmniStore 不会取消正在进行的任务**，重新打开时会恢复任务状态。同时只有一个任务会修改软件包数据库。
- **自动检查更新**：软件包里带一个用户级的定时器，每 6 小时检查一次，并用 KDE 通知提醒；通知属于 `org.meo.OmniStore`，可在系统设置的通知里按应用调整。

## 自定义仓库

可以按来源添加自己的仓库，不同来源的处理方式不同：

| 方式 | 来源 | 行为 |
|---|---|---|
| 应用 | brew、scoop、chocolatey、winget、fdroid | 调用该来源自己的命令行，成功才记录 |
| 记录 | apt、dnf、zypper、apk、snap | 只记录，OmniStore 不会修改属于 root 的文件 |
| 订阅 | github、bitu | OmniStore 自己读取的地址或 `owner[/repo]` |

“记录”和“订阅”的条目只是配置，不代表该来源已经能搜索到那里的软件。`omnistore --list-custom-repos` 会列出所有仓库和各来源的能力。

## AI 与账号

- OmniStore 里的 AI 助手通过 Meo Account 代理工作，**应用永远拿不到你的密钥**。每次请求前都会显示数据去向和要发送的数据类别（软件包元数据、你的提示词）。
- 旧的内置 AI 助手已停用：命令行的 `--ai-*` 会返回需要明确同意的错误。
- 密钥不会写入配置文件。
- OmniStore 目前没有注册自己的 OAuth 客户端，所以不直接调用 Meo API，也不保存 Meo 令牌。

## 配置

设置保存在 `$XDG_CONFIG_HOME/omnistore/config.yaml`。凭据不放在这里：AI 密钥来自 Meo Account，GitHub 令牌来自环境变量 `OMNISTORE_GITHUB_TOKEN` 或 `GITHUB_TOKEN`。

## 开发者

仓库：[OmniStore](https://github.com/QwQdoge/OmniStore)。`docs/` 里有原生前端契约、事务与发布契约、统一更新、外部安装请求，以及与 Meo 的集成约定。商店页面、安装按钮、进度和错误状态的界面规范见 [MeoUI：商店反馈](/docs/meoui/store-feedback.html)。许可证 `GPL-3.0-only`。

注意：不要仅凭某个来源的开关或清单就认为该来源的所有操作都可用——只有搜索、详情、安装、卸载、更新、平台限制和错误处理都实现并测试过，才算支持。
