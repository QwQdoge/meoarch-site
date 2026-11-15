# Meo 软件源

Meo 的软件通过已签名的 pacman 仓库分发，有两个通道：

| 通道 | 仓库名 | 用途 |
|---|---|---|
| Stable | `[meo]` | 稳定版 |
| Beta | `[meo-beta]` | 测试版，更新更快，风险更高 |

仓库地址是 `packages.meoarch.org`。Arch、Plasma、Qt 等上游依赖仍来自你配置的 Arch 软件源，和 Meo 的包在同一次 pacman 事务里解决。

## 怎么用

不需要手动编辑 `pacman.conf`。[安装指南](install.md) 里的安装脚本会核对并固定公开的 Meo 密钥，配置你选的通道，然后用 pacman 安装软件。想用 Beta 通道，在脚本后加 `--beta`。

常见的包（名称以软件源的实际内容为准）：

| 包 | 内容 |
|---|---|
| `meo-desktop` | Meo Desktop |
| `meo-settings` | Meo Settings |
| `omnistore-bin` | OmniStore |
| `meo-ai-beta` | Meo AI（Beta 通道） |
| `meo-plasma-login-manager` | Meo Login |
| `meoui-qml` | MeoUI 的 QML 模块 |
| `meo-account` | Meo Account |

这些包也可以用 yay 从 AUR 单独安装。

## 它是怎么发布的

- 软件源由 [meo-repo](https://github.com/QwQdoge/meo-repo) 管理：包的配方、有版本的发布清单、校验脚本和公开的密钥环输入。各组件的实现留在它自己的项目里，不放在这里。
- 每个通道的组件版本由一份发布清单锁定，记录每个组件所属的仓库、不可变的发布标签、提交、包版本、来源地址和 SHA-256。
- 发布受保护：签名和仓库发布发生在受保护的 GitHub 环境里，签名密钥不会经过本地工具。
- 本地能构建或通过合同测试，不等于已经发布，也不等于能安装。例如 Beta 8 是一次稳定化发布：只接受兼容性、无障碍、失败状态、打包和验证方面的修复，无关的新功能延后。

## 给打包者

配方、清单、发布和密钥管理的约定在 [meo-repo 仓库](https://github.com/QwQdoge/meo-repo) 的 `docs/` 里（AUR、ISO、密钥管理、平台代际、产物存储等）。私钥、签名密钥、令牌和存储凭据永远不进仓库或验证档案。
