const toggle=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('[data-nav]'),langSelect=document.getElementById('lang-select');
const zh={
  'badge.stable':'Stable 通道','p.kde':'MeoArch 的 KDE Plasma 6 原生集成：Shell、Plasmoid、主题、默认配置和 KDE/Qt 桥接，打包为 meo-desktop。','p.repo':'已签名的 pacman 软件源和发布流程：配方、发布清单、校验工具，分 Stable 和 Beta 两个通道。',
  'ui.skip':'跳到主要内容','ui.menu':'打开菜单','ui.lang':'语言 / Language',
  'nav.products':'产品','nav.install':'安装','nav.workshop':'更多项目','nav.about':'关于',
  'hero.title':'一个 Arch 桌面，<br><em>和围绕它的一切。</em>',
  'hero.lead':'MeoArch 是一个公开开发的项目：从系统、应用商店、AI 助手到设计系统，目标是让 Linux 更容易理解，同时不拿走它的自由。',
  'hero.cta1':'浏览产品','hero.cta2':'怎么安装','hero.caption':'开发版系统截图',
  'products.eyebrow':'产品','products.title':'做了什么。','products.lead':'下面这些都在公开开发中，状态各不相同，卡片上会写明。截图来自开发版本。',
  'badge.testiso':'测试版 ISO 可下载','badge.preview':'开发预览','badge.beta':'Beta','badge.soon':'即将提供',
  'l.site':'网站 ↗','l.iso':'下载测试版 ISO ↗',
  'p.os':'基于 Arch Linux 的桌面系统：设置会解释自己，高风险修改可以预览和恢复，底层仍然是真正的 Linux。',
  'p.ai':'MeoArch 的助手：日常对话、本地或远程的代理工作，以及受控的系统操作；桌面和网页保持同一种体验。',
  'p.store':'应用商店：发现软件来源，管理软件的安装与更新；原生 Qt/QML + MeoUI 客户端，Python 后端。',
  'p.settings':'日常系统设置：基于 MeoUI，使用 KDE 和 Linux 已验证的系统组件，不取代 NetworkManager、BlueZ、PipeWire 等。',
  'p.ui':'MeoArch 共用的 Qt Quick / QML Material Design 3 设计系统：主题、组件和模式，让各个应用保持一致。MIT 许可。',
  'p.login':'MeoArch 的登录与显示管理器：在 KDE Plasma Login Manager 6.8 之上只改外观，认证和会话逻辑保持上游。',
  'install.eyebrow':'安装','install.title':'三种方式。','install.lead':'MeoArch 仍在开发中，请先在虚拟机或备用设备上试用，并备份重要数据。',
  'i.iso.t':'下载 ISO','i.iso.p':'新装一台机器或虚拟机。目前只有测试版（2026-10-25 构建）。','i.iso.b':'从 SourceForge 下载',
  'i.pac.t':'pacman（Meo 软件源）','i.pac.p':'已有 Arch？一条命令配置已签名的 Meo 软件源并安装 Meo 桌面。','i.pac.n':'加 --beta 使用 Beta 通道。运行前请先阅读脚本。之后单个应用用 pacman -S 安装。',
  'i.yay.p':'AUR 上目前有两个独立可构建的包；其余软件依赖 Meo 软件源，请用 pacman 安装。','i.yay.n':'meo-plasma-login-manager 会替换 plasma-login-manager，安装前请确认。',
  'ws.eyebrow':'更多项目','ws.title':'工作坊里的其他东西。','ws.lead':'除了 MeoArch 本身，还有一些公开的小项目；学校作业和个人小实验会陆续整理放进来。',
  'ws.widgets':'一组自制的 KDE Plasma 6 小部件：时钟、系统监视器、媒体工具等。GPL-3.0。',
  'about.eyebrow':'关于','about.title':'为什么叫 MeoArch。',
  'about.p1':'<b>MEO = Modern · Expressive · Open。</b>交互和呈现要现代，动效和视觉语言要有表现力，Linux 的基础和用户的控制权要保持开放。',
  'about.p2':'<b>为什么是 Arch？</b>因为自由和新：滚动更新让软件保持较新，也不替你做决定。MeoArch 在这份自由之上，加一层更容易理解、更容易恢复的操作界面。',
  'about.p3':'<b>适合日常使用吗？</b>目前还不建议作为唯一的日常系统，它仍在开发中。欢迎试用、反馈，也欢迎一起做。',
  'foot.tag':'Calm by design. Built in the open.'
};
const en={
  'badge.stable':'Stable channel','p.kde':'MeoArch’s native KDE Plasma 6 integration: shell, plasmoids, themes, default configuration and KDE/Qt bridges, packaged as meo-desktop.','p.repo':'The signed pacman repository and release flow: recipes, release manifests and validation tooling, in a Stable and a Beta channel.',
  'ui.skip':'Skip to main content','ui.menu':'Open menu','ui.lang':'Language',
  'nav.products':'Products','nav.install':'Install','nav.workshop':'More projects','nav.about':'About',
  'hero.title':'An Arch desktop,<br><em>and everything around it.</em>',
  'hero.lead':'MeoArch is an open project: from the system to the app store, the AI assistant and the design system. The goal is to make Linux easier to understand without taking its freedom away.',
  'hero.cta1':'Browse products','hero.cta2':'How to install','hero.caption':'Screenshot of a development build',
  'products.eyebrow':'Products','products.title':'What we build.','products.lead':'All of these are in public development at different stages, which each card states. Screenshots come from development builds.',
  'badge.testiso':'Test ISO available','badge.preview':'Development preview','badge.beta':'Beta','badge.soon':'Coming soon',
  'l.site':'Website ↗','l.iso':'Download test ISO ↗',
  'p.os':'A desktop system based on Arch Linux: settings explain themselves, risky changes can be previewed and recovered, and underneath it is still real Linux.',
  'p.ai':'The MeoArch assistant: everyday chat, local or remote agent work and guarded system actions, with one experience across desktop and web.',
  'p.store':'The app store: discover software sources and manage installing and updating; a native Qt/QML + MeoUI client with a Python backend.',
  'p.settings':'Everyday system settings built on MeoUI, using proven KDE and Linux components rather than replacing NetworkManager, BlueZ, PipeWire and friends.',
  'p.ui':'The Qt Quick / QML Material Design 3 design system shared by MeoArch: themes, components and patterns that keep every app consistent. MIT licensed.',
  'p.login':'The MeoArch login and display manager: only the look changes on top of KDE Plasma Login Manager 6.8, authentication and session logic stay upstream.',
  'install.eyebrow':'Install','install.title':'Three ways.','install.lead':'MeoArch is still in development; please try it in a virtual machine or on a spare device and back up important data.',
  'i.iso.t':'Download the ISO','i.iso.p':'For a new machine or virtual machine. Only a test build (built 2026-10-25) is available for now.','i.iso.b':'Download from SourceForge',
  'i.pac.t':'pacman (Meo repository)','i.pac.p':'Already on Arch? One command sets up the signed Meo repository and installs the Meo desktop.','i.pac.n':'Add --beta for the Beta channel. Read the script before you run it. Install single apps afterwards with pacman -S.',
  'i.yay.p':'Two self-contained packages are on the AUR for now; everything else depends on the Meo repository, so install it with pacman.','i.yay.n':'meo-plasma-login-manager replaces plasma-login-manager; check before installing.',
  'ws.eyebrow':'More projects','ws.title':'Other things from the workshop.','ws.lead':'Besides MeoArch itself there are a few small public projects; school work and personal experiments will be collected here over time.',
  'ws.widgets':'A collection of custom KDE Plasma 6 widgets: clocks, system monitors, media tools and more. GPL-3.0.',
  'about.eyebrow':'About','about.title':'Why MeoArch.',
  'about.p1':'<b>MEO = Modern · Expressive · Open.</b> Modern in interaction and presentation, expressive in motion and visual language, and open in its Linux foundation and the control it leaves with the user.',
  'about.p2':'<b>Why Arch?</b> Freedom and freshness: rolling releases keep software current and Arch does not make choices for you. MeoArch adds an easier-to-understand, easier-to-recover layer on top of that freedom.',
  'about.p3':'<b>Ready for daily use?</b> Not yet as your only system; it is still in development. Try it, send feedback, and build it with us.',
  'foot.tag':'Calm by design. Built in the open.'
};
const translations={'zh-CN':zh,en};
function getLang(){try{const s=localStorage.getItem('site-lang');if(translations[s])return s}catch(e){}return (navigator.language||'').startsWith('en')?'en':'zh-CN'}
function apply(lang){const c=translations[lang]||zh;document.documentElement.lang=lang;document.querySelectorAll('[data-i18n]').forEach(el=>{const v=c[el.dataset.i18n];if(v!==undefined)el.innerHTML=v})}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}));
langSelect.value=getLang();langSelect.addEventListener('change',e=>{try{localStorage.setItem('site-lang',e.target.value)}catch(err){}apply(e.target.value)});
apply(getLang());
