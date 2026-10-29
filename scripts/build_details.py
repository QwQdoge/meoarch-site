#!/usr/bin/env python3
"""Generate the detail page of every project that has no intro page of its own: /<slug>/index.html.

Text comes from the i18n keys already used by the product cards (app.js), so cards and detail pages never disagree.
Projects with their own intro page are routed instead: /os and /ai (Worker workers/paths) and /vrc-m (Worker vrc-m-intro)."""
import html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
GH = "https://github.com/QwQdoge/"
PROJECTS = [
    # slug, name, badge key, description key, image (src, w, h) or None, install command or None, github repo
    ("omnistore", "OmniStore", "badge.preview", "p.store", ("assets/img/omnistore.webp", 1280, 862), "yay -Syu omnistore-bin", "OmniStore"),
    ("meo-settings", "Meo Settings", "badge.beta", "p.settings", ("assets/img/settings.webp", 1280, 820), "yay -Syu meo-settings", "MeoSettings"),
    ("meoui", "MeoUI", "badge.beta", "p.ui", ("assets/img/meoui.webp", 1280, 800), "yay -Syu meoui-qml", "MeoUI"),
    ("meo-login", "Meo Login", "badge.beta", "p.login", None, "yay -Syu meo-plasma-login-manager", "meo-login-manager"),
    ("meokde", "MeoKDE", "badge.stable", "p.kde", ("assets/img/os-lock.webp", 1280, 720), "yay -Syu meo-desktop", "meo-kde"),
    ("meo-repo", "Meo Repo", "badge.stable", "p.repo", None, None, "meo-repo"),
    ("kde-widgets", "KDE Plasma 6 Widgets", None, "ws.widgets", None, None, "kde-plasma6-widgets"),
]
ZH = {"Back": "← 返回项目列表"}

def page(slug, name, badge, desc, image, install, repo):
    esc = html.escape
    img = (f'<figure class="detail-shot"><img src="/{image[0]}" alt="{esc(name)}" width="{image[1]}" height="{image[2]}"></figure>'
           if image else '<div class="detail-art" aria-hidden="true"><img src="/assets/icons/Logo.svg" alt="" width="96" height="96"></div>')
    code = (f'<code class="install">{esc(install)}</code><p class="detail-note" data-i18n="repo.need">（需要 Meo 软件源）</p>' if install else "")
    badge_html = f'<span class="badge" data-i18n="{badge}"></span>' if badge else ""
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(name)} · MeoArch</title>
  <meta name="theme-color" content="#7451c7">
  <link rel="canonical" href="https://meoarch.org/{slug}/">
  <link rel="icon" href="/assets/icons/Logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <a class="skip-link" href="#main" data-i18n="ui.skip">跳到主要内容</a>
  <header class="site-header" data-header>
    <a class="brand" href="/" aria-label="MeoArch"><img src="/assets/icons/Logo.svg" alt="" width="36" height="36"><span>MeoArch</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle><span class="sr-only" data-i18n="ui.menu">打开菜单</span><i></i><i></i></button>
    <nav id="site-nav" aria-label="Primary" data-nav>
      <a href="/#products" data-i18n="nav.products">产品</a><a href="/#install" data-i18n="nav.install">安装</a><a href="/#workshop" data-i18n="nav.workshop">更多项目</a><a href="/#about" data-i18n="nav.about">关于</a>
    </nav>
    <label class="lang-switcher"><span class="sr-only" data-i18n="ui.lang">语言 / Language</span><select id="lang-select" aria-label="Language"><option value="zh-CN">中文</option><option value="en">English</option></select></label>
    <a class="header-link" href="https://github.com/QwQdoge" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  </header>

  <main id="main">
    <section class="section detail"><div class="wrap detail-grid">
      <div class="detail-copy">
        <p class="eyebrow"><a href="/#products" data-i18n="d.back">← 返回项目列表</a></p>
        {badge_html}
        <h1>{esc(name)}</h1>
        <p class="lead" data-i18n="{desc}"></p>
        <div class="actions">
          <a class="button primary" href="{GH}{repo}" target="_blank" rel="noreferrer" data-i18n="l.open">直接进入 ↗</a>
          <a class="button secondary" href="/#products" data-i18n="d.back">← 返回项目列表</a>
        </div>
        {code}
      </div>
      {img}
    </div></section>
  </main>

  <footer class="footer"><div class="wrap footer-content">
    <div><a class="brand" href="/"><img src="/assets/icons/Logo.svg" alt="" width="30" height="30"><span>MeoArch</span></a><p data-i18n="foot.tag">Calm by design. Built in the open.</p></div>
    <nav aria-label="Footer"><a href="/os/">MeoArch OS</a><a href="/ai/">Meo AI</a><a href="https://sourceforge.net/projects/meoarch/" target="_blank" rel="noreferrer">SourceForge</a><a href="https://github.com/QwQdoge" target="_blank" rel="noreferrer">GitHub</a></nav>
  </div></footer>
  <script src="/app.js"></script>
</body>
</html>
'''

for p in PROJECTS:
    d = ROOT / p[0]
    d.mkdir(exist_ok=True)
    (d / "index.html").write_text(page(*p), encoding="utf-8")
    print("wrote", p[0] + "/index.html")
