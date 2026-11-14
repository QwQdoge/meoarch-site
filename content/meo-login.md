# Meo Login

Meo Login 是 MeoArch 的登录与显示管理器。它是 KDE Plasma Login Manager（源自 SDDM）的下游分支：保留成熟的上游认证和会话后端，只替换登录界面的呈现，并加入 MeoArch 的整合。

## 兼容性边界

公开的产品名是 **Meo Login**。内部的运行时标识（例如 `plasmalogin`、`/etc/plasmalogin.conf`、PAM 服务名、翻译域和相关的 systemd 单元）有意保持不变，以兼容上游。它们是实现标识，不是另一个产品名。改名会带来不必要的 PAM、systemd、配置和升级风险。

## 目标

- 多显示器、高 DPI 和 HDR 开箱即用；
- 键盘布局切换和虚拟键盘；
- 实用的中日韩输入支持；
- 读屏和无障碍音频；
- 上游后端支持的远程登录；
- 与 Meo Desktop 更深的整合（显示与键盘亮度、电源管理、受信任的蓝牙设备、已知 Wi-Fi）；
- 与 Meo 的 Material 3 视觉和动效一致的登录界面。

## 安装与使用

最终用户请安装签名的 Meo 软件包，不要自己编译显示管理器。Meo Login 会替换 `plasma-login-manager`，安装前请确认。服务名仍是 `plasmalogin`：

```bash
sudo systemctl disable sddm
sudo systemctl enable plasmalogin
```

**显示管理器出问题会导致无法进入图形界面**，所以开发构建请先在虚拟机里测试。当前的上游架构要求 systemd。

## 配置

界面前端读取 `/etc/plasmalogin.conf`（用户覆盖）和 `/usr/lib/plasmalogin/defaults.conf`（发行版默认值）。这些路径为了贴近上游而保留。

## 开发者

仓库：[meo-login-manager](https://github.com/QwQdoge/meo-login-manager)，默认分支 `meo/6.7`。分支策略和被审阅的改动范围见仓库里的 `docs/MEO_FORK_POLICY.md`。Meo 特有的呈现和整合改动要保持足够小，才能对照 KDE Plasma Login Manager 审阅安全、认证、会话启动和上游修复。基于 KDE Plasma Login Manager，保留适用的上游版权与许可证声明。
