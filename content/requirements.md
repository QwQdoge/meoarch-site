# 使用要求

下面只列出已经确认的要求。MeoArch 仍在开发中，要求可能随版本变化。

## MeoArch 系统（ISO）

- 处理器架构：x86_64。
- 启动方式：UEFI。
- 安装镜像约 2.5 GiB（当前为测试版）。
- 建议先在虚拟机或备用设备上试用。

## 在已有的 Arch Linux 上安装

- Arch Linux（x86_64），使用 pacman。
- 安装来源：已签名的 Meo 软件源（Stable 和 Beta 两个通道），或用 yay 从 AUR 单独安装某一个应用。
- Meo 桌面基于 KDE Plasma 6，需要 Plasma 6.8 或更新。
- Meo Login 会替换 `plasma-login-manager`，安装前请确认。

## Meo AI

- Windows 10 / 11（x64）：安装包或免安装的便携版。
- Android 9 或更新。
- Arch Linux：来自 Meo 软件源。
- 网页版：在浏览器里使用。
- 目前都是测试版，功能和数据处理仍不完整。

## OmniStore

- Arch Linux，通过 AUR 或 Meo 软件源安装。
- 客户端为原生 Qt 6 / QML，后端为 Python。

## MeoUI

- Qt 6（Qt Quick / QML）。
