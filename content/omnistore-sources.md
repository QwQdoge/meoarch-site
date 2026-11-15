# OmniStore 来源

OmniStore 里每个软件来源都是一个独立的“源”。源可以随时存在或不存在：没有它，商店照常工作，只是少一类软件。本页说明源能提供什么、怎么被发现、怎么添加第三方源。

## 原则

- **默认保持干净**：本机用不上的源不会出现。检测到可用的源只列在“可添加的来源”里，由你选择启用。
- **能复用就复用**：每个源只做自己独有的事，安装、卸载、更新都走同一套后台任务，不打断你。
- **不夸大**：清单里写了某项能力，不等于该能力已经可用。只有真正实现并测试过的才算。

## 源可以提供的能力

| 能力 | 含义 |
|---|---|
| `search` | 按关键字搜索软件 |
| `details` | 版本、说明、开发者、许可证等详情，缺失的信息省略 |
| `install` / `uninstall` | 安装和卸载，作为后台任务执行 |
| `update` | 检查某个软件是否有新版本 |
| `list_installed` | 列出这个源管理的已安装软件 |
| `launch` / `locate` | 启动软件、打开所在位置 |
| `size` | 下载和安装大小 |
| `repositories` | 用户可以为该源添加自己的仓库 |

## 清单（plugin.json）字段

| 字段 | 说明 |
|---|---|
| `id`、`name`、`version`、`kind` | 标识。`kind` 目前只有 `source` |
| `platforms` | `linux`、`windows`、`macos` 中的若干个 |
| `capabilities` | 上表中本源真正实现的能力 |
| `permissions` | 需要的权限，例如 `subprocess`、`network`、`filesystem` |
| `detect` | 判断本机能否使用：`commands`（命令存在）或 `paths`（路径存在），满足任一即可 |
| `offer` | `default` 按默认规则；`on_detect` 检测到后只提示“可添加”；`manual` 只能手动添加 |
| `app_class` | `native` 为原生应用；`wrapped` 为通过运行时（如 Wine）运行的应用 |
| `experimental` | 实验性来源，界面上会标注 |
| `index` | 第三方目录的地址 |
| `trusted`、`default_enabled`、`requires_review` | 信任与默认启用。第三方源始终需要审核并默认关闭 |

在设置的“来源”里：检测到的来源列在“可添加的来源”，打开开关才会启用；Bottles 启用后，“Windows 应用容器”里为每个瓶子提供一个开关，决定它的程序是否出现在“已安装”。

## 内置来源

| 平台 | 来源 |
|---|---|
| Linux | Pacman、AUR、Flatpak、AppImage、APT、DNF、Zypper、APK、Bottles（实验）、F-Droid、GitHub |
| Windows | winget、Scoop、Chocolatey、GitHub |
| macOS | Homebrew、Homebrew Cask（实验）、GitHub |

### Bottles（Windows 应用）

Bottles 的“瓶子”是容器，不是应用；瓶子里登记的程序才是应用。检测到 Bottles 后，它只出现在“可添加的来源”里。启用后，每个瓶子要你确认一次是否把它的程序列入正常的软件列表；没确认前，它们不会出现在“已安装”里。启动走同一个任务流程。要安装 Windows 程序，选择一个瓶子和安装文件，OmniStore 在该瓶子里运行安装器。卸载请在瓶子内进行。

Bottles 来源通过 `bottles-cli` 工作，目前还没有在真实 Bottles 环境里验证，所以标为实验。

### macOS（实验）

Homebrew Cask 提供 macOS 的 `.app` 应用，只在 macOS 上、检测到 `brew` 时提供。

## 添加第三方源

第三方源是一个公开的 JSON 目录，**不运行任何代码**：每个软件只指向一个已有内置源能处理的安装目标。

```bash
omnistore --add-catalog https://example.org/apps/index.json
omnistore --list-offers
```

目录必须使用 `https`，不超过 2 MB。添加后源默认关闭，需要你审核后再启用。

```json
{
  "schema": 1,
  "id": "acme",
  "name": "Acme Apps",
  "version": "1.0.0",
  "platforms": ["linux"],
  "apps": [
    {
      "id": "alpha",
      "name": "Alpha",
      "description": "An example app.",
      "version": "1.2.0",
      "homepage": "https://example.org/alpha",
      "install": { "type": "delegate", "source": "flatpak", "id": "org.example.Alpha" }
    }
  ]
}
```

`install.source` 可以是 `flatpak`、`appimage`、`pacman`、`aur`、`apt`、`dnf`、`zypper`、`apk`、`winget`、`scoop`、`chocolatey`、`brew`、`brewcask`、`fdroid`、`github`、`bottles`。目标源在本机不可用时，该软件无法安装。

目前第三方目录只支持 `delegate`，不支持直接下载文件，也不支持哈希校验的下载；这些还没有实现。
