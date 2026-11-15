# Meo Desktop（MeoKDE）

Meo Desktop 是 MeoArch 对 KDE Plasma 6 的原生集成：Shell、Plasmoid、主题、默认配置，以及 KDE/Qt 的原生桥接。通用的界面组件和设计令牌来自 [MeoUI](/docs/meoui/index.html)，Meo Desktop 不复制它们。

## 它做什么，不做什么

- Plasma、KWin 和 KDE 服务始终是窗口、任务、网络、音频、电源和会话状态的**权威**。Meo Desktop 通过真实的 KDE/D-Bus/系统接口，或明确交接到维护中的 KDE 设置页，不用装饰性的本地假开关。
- 它在 Plasma 之上工作，Arch 或 KDE 正常升级时 Meo 也继续跟随。

## 安装

只装 Meo Desktop（AUR）：

```bash
yay -Syu meo-desktop
```

在已经配置了官方签名 MeoArch 软件源的系统上，公开的安装入口是：

```bash
curl -fsSL https://raw.githubusercontent.com/QwQdoge/meo-kde/main/bootstrap.sh | bash
```

| 选项 | 作用 |
|---|---|
| `-y` | 非交互安装 |
| `--dry-run` | 只检查仓库和包是否满足安全安装条件，不安装 |

它通过 pacman 安装软件源里的 `meo-desktop` 包。它**不会**从源码覆盖当前 Plasma，也不会修改你现有 KDE 的面板、主题、`~/.config`、`/etc/xdg`、显示管理器或默认登录会话。如果软件源里的包版本低于要求，安装器会停下来，而不是退回旧的“直接改当前 KDE”的方式。

要装整套 MeoArch 软件，用 [安装指南](install.md) 里的整套脚本。

## 会话

装好后，显示管理器会新增一个独立的 **Meo Desktop** Wayland 会话：

- 它使用自己的配置与状态目录（默认 `~/.config/meo-desktop` 和 `~/.local/state/meo-desktop`）；
- 普通的 **Plasma (Wayland)** 会话保留原配置，不会因为装了 Meo Desktop 被改写；
- Meo Desktop 本身不强制安装或替换显示管理器。完整 ISO 的安装流程会另外安装 [Meo Login](meo-login.md) 并预选 Meo 会话，这是整机的安装策略。

## 开发者

源码、架构与契约在 [meo-kde 仓库](https://github.com/QwQdoge/meo-kde) 的 `docs/` 里，包括 Shell 配置、主题、动态色、输入法、快捷键、快速设置后端和锁屏。改动前先读仓库里的 `AGENTS.md`。构建或离屏预览不能证明真实 Plasma/KWin 会话的行为，涉及用户配置、显示或会话的动作需要最小范围、可恢复的处理。

许可证：原创代码为 `GPL-3.0-or-later`；KDE/Plasma 衍生文件、第三方实现、字体和上游小部件保留各自的许可证。
