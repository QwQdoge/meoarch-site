# 项目总览

MeoArch 是一整套相互配合的软件：一个基于 Arch Linux 的桌面系统，加上随它一起开发的应用、账号服务和设计系统。本页说明每个项目是什么、怎么拿到、去哪里读更详细的文档。

目前都是测试版，请先在虚拟机或备用设备上试用，并备份重要数据。使用前的条件见 [使用要求](requirements.md)。

## 它们怎么配合

```text
设计系统      MeoUI（Qt Quick / QML，Material 3 Expressive）
                │ 被所有应用使用
桌面与应用    Meo Desktop（Plasma 6 集成） · Meo Settings · OmniStore · Meo AI · Meo Login
                │ 打包、签名、发布
软件源        Meo 软件源（Stable / Beta，签名的 pacman 仓库）
                │ 被组装成
系统镜像      MeoArch ISO（安装器、修复工具）
账号与服务    Meo Account · Meo API（登录、备份、AI 对话、用量）
```

依赖方向：MeoUI → 应用与 Plasma 集成 → 系统镜像的整合 → 软件源的打包与发布。

## 产品一览

| 项目 | 是什么 | 怎么获得 | 文档 |
|---|---|---|---|
| MeoArch 系统 | 基于 Arch 的桌面，默认 Plasma Wayland | ISO，或在已有 Arch 上安装 | [安装指南](install.md)、[MeoArch 镜像与安装器](meoarch-iso.md) |
| Meo Desktop（MeoKDE） | Plasma 6 的原生集成：Shell、Plasmoid、主题、默认配置 | `yay -Syu meo-desktop`，或整套安装脚本 | [Meo Desktop](meo-desktop.md) |
| Meo Settings | 日常系统设置应用 | `yay -Syu meo-settings` | [Meo Settings](meo-settings.md) |
| OmniStore | 软件商店：pacman、AUR、Flatpak、AppImage 等来源 | `yay -Syu omnistore-bin` | [OmniStore](omnistore.md) |
| Meo AI | AI 助手：桌面、网页、安卓 | 见发布页或软件源 | [Meo AI](meo-ai.md) |
| Meo Login | 登录与显示管理器（基于 KDE Plasma Login Manager） | 随整机安装，或从软件源安装 | [Meo Login](meo-login.md) |
| Meo 软件源 | Stable 与 Beta 两个签名的 pacman 仓库 | 安装脚本会配置 | [Meo 软件源](meo-repo.md) |
| Meo Account | 账号：登录、会话、云端备份、AI 连接 | `account.meoarch.org` | [Meo Account](meo-account.md)、[API](account-api.md) |
| MeoUI | 共享的设计系统和 QML 组件 | 随应用安装 | [MeoUI 规范](/docs/meoui/index.html) |

## 开发者从哪里开始

| 我想… | 读 |
|---|---|
| 做一个遵守 MeoArch 风格的应用 | [MeoUI 规范](/docs/meoui/index.html)，从“Rules for Coding Agents”开始 |
| 让应用使用 Meo Account（登录、备份、AI） | [Meo Account API](account-api.md)、[Meo API 参考](api-reference.md)、[原生应用接入](account-native-apps.md) |
| 给 MeoArch 打包软件 | [Meo 软件源](meo-repo.md) |
| 读源码、提交修改 | 各项目的 GitHub 仓库，先读里面的 `AGENTS.md` |

## 仓库

| 仓库 | 内容 |
|---|---|
| [MeoUI](https://github.com/QwQdoge/MeoUI) | 设计系统 |
| [meo-kde](https://github.com/QwQdoge/meo-kde) | Meo Desktop |
| [MeoSettings](https://github.com/QwQdoge/MeoSettings) | 系统设置 |
| [OmniStore](https://github.com/QwQdoge/OmniStore) | 软件商店 |
| [meo-ai](https://github.com/QwQdoge/meo-ai) | AI 助手 |
| [meo-login-manager](https://github.com/QwQdoge/meo-login-manager) | 登录管理器 |
| [meo-repo](https://github.com/QwQdoge/meo-repo) | 软件源的配方与发布清单 |
| [MeoArch-os-workspace](https://github.com/QwQdoge/MeoArch-os-workspace) | ISO、安装器、修复工具 |
| [meoarch-site](https://github.com/QwQdoge/meoarch-site) | 本网站 |

## 许可证

各项目的许可证不同，完整说明见 [法律与许可](legal.md)，以及各仓库里的 `LICENSE` 和 `THIRD_PARTY_NOTICES.md`。
