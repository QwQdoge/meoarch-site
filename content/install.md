# 安装指南

三种方式：用 ISO 装整个系统、在已有的 Arch 上装整套 Meo 桌面、或只装某一个应用。目前都是测试版，请先在虚拟机或备用设备上试用，并备份重要数据。条件见 [使用要求](requirements.md)。

## 方式一：MeoArch ISO

镜像见 [MeoArch OS 站点](/os/)。写入 U 盘或在虚拟机中启动（x86_64，UEFI）。镜像默认进入 Plasma Wayland 的 Live 桌面，并自动打开全屏安装器。安装器、修复工具和 Live 桌面见 [MeoArch 镜像与安装器](meoarch-iso.md)。

## 方式二：在已有的 Arch 上装整套 Meo 桌面

这条路径从已签名的 Meo 软件源，用 pacman 安装**整套** MeoArch 软件。脚本会核对并固定公开的 Meo 密钥、配置你选的通道、安装软件源控制包，然后用 pacman 安装一个 Meo 元包。**它不会在你的机器上克隆或编译 Meo 组件的源码。**

```bash
curl -fsSL https://raw.githubusercontent.com/QwQdoge/MeoArch-os-workspace/main/scripts/install.sh | bash
```

常用选项（加在 `bash -s --` 后面）：

| 选项 | 作用 |
|---|---|
| `--full` | 推荐：完整桌面，含可选的 Meo 应用 |
| `--core` | 只装 Meo KDE 集成，不装可选应用 |
| `--beta` | 使用 Beta 通道 |

例如：

```bash
curl -fsSL https://raw.githubusercontent.com/QwQdoge/MeoArch-os-workspace/main/scripts/install.sh | bash -s -- --full
```

Meo 自己的软件从 `packages.meoarch.org` 的 `[meo]`（Stable）或 `[meo-beta]`（Beta）取得；Arch、Plasma、Qt 等上游依赖仍来自你配置的 Arch 软件源，在同一次 pacman 事务里安装。装好之后，Meo 的更新就是普通的 pacman / OmniStore 更新，不再需要重新编译。

安装完成后，登录界面会多出一个独立的 **Meo Desktop** Wayland 会话。它使用自己的配置和状态目录，底层直接启动系统里的 Plasma 和 KWin，所以 Arch 或 KDE 升级时它也一起更新。你原来的 **Plasma (Wayland)** 会话不受影响。详情见 [Meo Desktop](meo-desktop.md)。

## 方式三：只装一个应用（AUR）

```bash
yay -Syu meo-desktop       # Meo Desktop
yay -Syu meo-settings      # Meo Settings
yay -Syu omnistore-bin     # OmniStore
yay -Syu meo-ai-beta       # Meo AI（Beta 通道）
```

## 更新与卸载

- 更新：用 pacman 或 OmniStore，和别的软件一样。
- 卸载：用 `pacman -R` 删除对应的包。Meo Login 会替换 `plasma-login-manager`，安装前请确认。

## 出问题时

- 先看 [使用要求](requirements.md)，确认系统和 Plasma 版本满足条件。
- 在虚拟机里重试，排除硬件影响。
- 安装器、Live 桌面和修复工具见 [MeoArch 镜像与安装器](meoarch-iso.md)。
