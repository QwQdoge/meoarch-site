# MeoArch 镜像与安装器

MeoArch 的 ISO 由 [MeoArch-os-workspace](https://github.com/QwQdoge/MeoArch-os-workspace) 整合：Arch ISO 配置、安装器、修复工具、ISO 用到的配置与品牌资源，以及组装和验收候选镜像的脚本。共享的界面组件属于 [MeoUI](/docs/meoui/index.html)，Plasma 专用的整合属于 [Meo Desktop](meo-desktop.md)，不在这里。

## 要求

x86_64、UEFI；当前测试版镜像约 2.5 GiB。建议先在虚拟机或备用设备上试用。详见 [使用要求](requirements.md)。

## Live 桌面

镜像默认进入 Plasma Wayland，并且**仅在 Live 环境下**自动登录。安装器全屏打开；关闭它或它崩溃后，仍然留在 Meo Desktop 里，可以使用 Konsole、快速修复（Quick Repair）和 NetworkManager。Cage 仍可以在启动菜单里显式选择，作为后备。

## 安装器

安装器是一个独立的应用（QML 界面加后端）。**安装器（向导）和恢复环境里的“快速修复”不适用应用外壳规范**，因为它们是向导或恢复环境（见 [MeoUI 应用外壳](/docs/meoui/app-shell.html)）。

## 修复工具

修复工具（Repair）带有检查和修复动作，用于系统出问题时。Live 桌面里也可以用快速修复。

## 在已有的 Arch 上，而不是用 ISO

见 [安装指南](install.md) 的方式二：同一个仓库提供的安装脚本，从签名的软件源安装整套 Meo 桌面。

## 许可证

原创的 MeoArch 代码和配置采用 MIT 许可证；ISO 配置里源自 Arch ISO 的部分保持 `GPL-3.0-or-later`；随附的第三方资源保留上游许可证。见 [法律与许可](legal.md)。

## 开发者

仓库的 `docs/` 里有构建环境、ISO 构建、虚拟机测试、发布验证、产品成熟度关口和系统体验契约。**生成的 ISO、截图、日志或静态检查都不等于安装成功**：源码或静态检查、暂存的 ISO、Live ISO 启动、已安装系统启动是不同级别的证据，要分开记录。
