# Meo Settings

Meo Settings 是 MeoArch 的日常系统设置应用。它以 [MeoUI](/docs/meoui/index.html) 的通用界面为基础，通过稳定的 Qt/KDE 接口、已安装的 Meo Desktop 运行时，和明确的 KDE 设置页交接来提供真实的设置流程。

## 它的边界

Meo Settings **不取代** NetworkManager、BlueZ、PipeWire、KScreen、PowerDevil、KWin 或 KDE 系统设置。

- 只使用可验证的 KDE、Qt 和 Meo.System 公共接口。
- 原生控制没有完整的安全和恢复路径时，会清楚地交接到维护中的 KDE 设置页，而不是伪造一个本地状态。
- 敏感、特权、破坏性或与恢复相关的操作，保留在权威的系统工具里。

## 安装

```bash
yay -Syu meo-settings
```

要一次装好全部 MeoArch 软件，见 [安装指南](install.md)。

## 和其他部分的关系

- 设置应用的界面规范：[MeoUI 的设置规范](/docs/meoui/settings.html) 和 [应用外壳](/docs/meoui/app-shell.html)。
- 云端备份：设置清单可以通过 Meo Account 备份和恢复（恢复前会先预览，只应用受支持的外观设置，不恢复凭据、文件或自动重装应用）。清单格式见 [Meo Account API](account-api.md) 的“云端备份”一节。
- 设备和系统信息（关于页面）只在 Meo Settings 里显示，其他应用不重复。

## 开发者

仓库：[MeoSettings](https://github.com/QwQdoge/MeoSettings)。`docs/` 里有架构、备份与恢复、日常控制、隐私与权限、运行时系统信息、存储用量和设置覆盖范围等契约。许可证 `GPL-3.0-or-later`。
