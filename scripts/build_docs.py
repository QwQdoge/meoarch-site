#!/usr/bin/env python3
"""Generate /docs/ from the canonical sources in the product repositories.

Sources (never edit the generated files; change the source and regenerate):
  - MeoUI specification: $MEO_UI_ROOT/docs (default: ../MeoUI next to this repository)
  - Public overview pages for people: content/ in this repository (hand-written)
Output for people: /docs/index.html, /docs/meoui/<slug>.html and /docs/guide/<slug>.html.
Output for agents: the same pages as .md (verbatim, links rewritten) and /llms.txt.
The sync-docs workflow runs this on a schedule so the site follows the repositories."""
import html, os, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
UI = pathlib.Path(os.environ.get("MEO_UI_ROOT") or ROOT.parent / "MeoUI") / "docs"
CONTENT = ROOT / "content"
CONTENT_REPO = "https://github.com/QwQdoge/meoarch-site/blob/main/content/"
SITE = "https://meoarch.org"
REPO = "https://github.com/QwQdoge/MeoUI/blob/main/docs/"
DOCS = [
    # slug, source path under MeoUI/docs, title, one-line summary
    ("index", "design/README.md", "MeoUI Specification", "Index and core rules: ownership, tokens, components, localization, evidence, files."),
    ("app-shell", "design/APP_SHELL.md", "App Shell", "Window chrome and toolbar, where app settings live and how they are grouped, About, open-source credits."),
    ("settings", "design/SETTINGS.md", "Settings Pattern", "Settings rows, groups, sidebar, task sheet, state layer and motion."),
    ("page-types", "design/PAGE_TYPES.md", "Page Types", "Page kinds, the two-level rule and registry metadata."),
    ("store-feedback", "design/STORE_FEEDBACK.md", "Store Feedback", "Store pages, install button states, progress indicators, error and empty states."),
    ("dynamic-color", "design/DYNAMIC_COLOR.md", "Dynamic Color", "The mandatory dynamic color role table and who generates it."),
    ("api-lifecycle", "api-lifecycle.md", "API Lifecycle", "Current, deprecated, experimental and internal components."),
    ("localization", "localization.md", "Localization", "Language precedence, translation catalogs and accessible names."),
    ("for-agents", "design/FOR_AGENTS.md", "Rules for Coding Agents", "The same rules as decision tables and checklists for AI coding agents."),
]
GUIDE_DOCS = [
    ("about", "about.md", "About MeoArch", "What MeoArch is and why it is called that."),
    ("requirements", "requirements.md", "Requirements", "What you need to try MeoArch, Meo AI and the Meo apps."),
    ("legal", "legal.md", "Legal", "All policies and open-source licenses of MeoArch's sites and apps in one place."),
    ("terms", "terms.md", "Terms of Service", "The terms for using Meo Account and Meo AI: accounts, your content, AI output, tools, acceptable use, liability."),
    ("privacy", "privacy.md", "Privacy Policy", "What Meo Account and Meo AI store, who receives data, how long, and how to export or delete it."),
    ("account-api", "account-api.md", "Meo Account API", "How to sign in, read account data, manage sessions and backups, and call Meo AI."),
]
EXTERNAL_DOCS = [
    ("隐私、数据与测试版说明", "https://vrc.meoarch.org/legal.html", "VRC Memories 的隐私、数据处理、测试版风险和使用条款摘要。"),
    ("VRC Memories 介绍", "/vrc-m/", "VRC Memories 是什么、能做什么、怎么登录。"),
]
BY_SOURCE = {src: slug for slug, src, _, _ in DOCS}
GUIDE_BY_SOURCE = {src: slug for slug, src, _, _ in GUIDE_DOCS}


PRIVATE = re.compile(
    r"[A-Za-z0-9._-]+@(gmail|outlook|hotmail|qq|163|icloud|yahoo)[.]com|/home/[a-z]|C:/Users|wsl[$]|[/]Users[/][A-Za-z0-9._]+|cii_evidence",
    re.IGNORECASE)


def check_public(text, name):
    """The site is public: refuse to publish personal or machine-specific details."""
    hits = sorted({m.group(0) for m in PRIVATE.finditer(text)})
    if hits:
        sys.exit(f"{name} contains private/local details {hits}; remove them from the source repository (see AGENTS.md)")


def resolve(link, current, by_source=BY_SOURCE):
    """Map a relative link between docs of one group to a site slug, or None."""
    target = os.path.normpath(os.path.join(os.path.dirname(current), link)).replace("\\", "/")
    return by_source.get(target)


def rewrite_links(md, current, ext, by_source=BY_SOURCE, repo=REPO):
    def sub(m):
        text, link = m.group(1), m.group(2)
        if re.match(r"[a-z]+:|#", link):
            return m.group(0)
        path, _, frag = link.partition("#")
        slug = resolve(path, current, by_source)
        if slug:
            return f"[{text}]({slug}{ext}{'#' + frag if frag else ''})"
        return f"[{text}]({repo}{os.path.normpath(os.path.join(os.path.dirname(current), path)).replace(chr(92), chr(47))})"
    return re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", sub, md)


def inline(text):
    parts = re.split(r"(`[^`]+`)", text)
    out = []
    for part in parts:
        if part.startswith("`") and part.endswith("`") and len(part) > 1:
            out.append(f"<code>{html.escape(part[1:-1])}</code>")
            continue
        s = html.escape(part, quote=False)
        s = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", lambda m: f'<a href="{html.escape(m.group(2))}">{m.group(1)}</a>', s)
        s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
        s = re.sub(r"(?<![\w*])_(.+?)_(?![\w*])", r"<em>\1</em>", s)
        s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)\*(?![\w*])", r"<em>\1</em>", s)
        out.append(s)
    return "".join(out)


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"`|\*", "", text).lower()).strip("-")


def render(md):
    """Small Markdown renderer for the subset the MeoUI docs use."""
    lines, out, i, toc = md.splitlines(), [], 0, []
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                code.append(lines[i]); i += 1
            out.append(f"<pre><code>{html.escape(chr(10).join(code))}</code></pre>")
            i += 1
            continue
        m = re.match(r"(#{1,4})\s+(.*)", line)
        if m:
            level, text = len(m.group(1)), m.group(2)
            anchor = slugify(text)
            if level == 2:
                toc.append((anchor, text))
            out.append(f'<h{level} id="{anchor}">{inline(text)}</h{level}>')
            i += 1
            continue
        if re.match(r"-{3,}\s*$", line):
            out.append("<hr>")
            i += 1
            continue
        if line.startswith(">"):
            quote = []
            while i < len(lines) and lines[i].startswith(">"):
                quote.append(lines[i].lstrip(">").strip()); i += 1
            out.append(f"<blockquote>{inline(' '.join(q for q in quote if q))}</blockquote>")
            continue
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"\|\s*:?-", lines[i + 1]):
            row = lambda l: [c.strip() for c in l.strip().strip("|").split("|")]
            head = row(line)
            i += 2
            body = []
            while i < len(lines) and lines[i].startswith("|"):
                body.append(row(lines[i])); i += 1
            out.append('<div class="table-scroll"><table><thead><tr>' + "".join(f"<th>{inline(c)}</th>" for c in head)
                       + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body)
                       + "</tbody></table></div>")
            continue
        m = re.match(r"(\s*)([-*]|\d+\.)\s+(.*)", line)
        if m:
            tag = "ol" if m.group(2)[0].isdigit() else "ul"
            items = []
            while i < len(lines):
                m = re.match(r"(\s*)([-*]|\d+\.)\s+(.*)", lines[i])
                if m:
                    items.append(m.group(3)); i += 1
                elif lines[i].startswith("  ") and lines[i].strip() and items:
                    items[-1] += " " + lines[i].strip(); i += 1
                else:
                    break
            lis = []
            for item in items:
                box = re.match(r"\[( |x)\]\s+(.*)", item)
                if box:
                    lis.append(f'<li class="check"><span aria-hidden="true">{"☑" if box.group(1) == "x" else "☐"}</span> {inline(box.group(2))}</li>')
                else:
                    lis.append(f"<li>{inline(item)}</li>")
            out.append(f"<{tag}>{''.join(lis)}</{tag}>")
            continue
        if not line.strip():
            i += 1
            continue
        para = [line.strip()]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"(#|```|\||>|-{3,}\s*$|\s*([-*]|\d+\.)\s)", lines[i]):
            para.append(lines[i].strip()); i += 1
        out.append(f"<p>{inline(' '.join(para))}</p>")
    return "\n".join(out), toc


HEADER = '''  <a class="skip-link" href="#main" data-i18n="ui.skip">跳到主要内容</a>
  <header class="site-header" data-header>
    <a class="brand" href="/" aria-label="MeoArch"><img src="/assets/icons/Logo.svg" alt="" width="36" height="36"><span>MeoArch</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle><span class="sr-only" data-i18n="ui.menu">打开菜单</span><i></i><i></i></button>
    <nav id="site-nav" aria-label="Primary" data-nav>
      <a href="/#products" data-i18n="nav.products">产品</a><a href="/#install" data-i18n="nav.install">安装</a><a href="/docs/" data-i18n="nav.docs">文档</a><a href="/#workshop" data-i18n="nav.workshop">更多项目</a><a href="/#about" data-i18n="nav.about">关于</a>
    </nav>
    <label class="lang-switcher"><span class="sr-only" data-i18n="ui.lang">语言 / Language</span><select id="lang-select" aria-label="Language"><option value="zh-CN">中文</option><option value="en">English</option></select></label>
    <a class="header-link" href="https://github.com/QwQdoge" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  </header>'''
FOOTER = '''  <footer class="footer"><div class="wrap footer-content">
    <div><a class="brand" href="/"><img src="/assets/icons/Logo.svg" alt="" width="30" height="30"><span>MeoArch</span></a><p data-i18n="foot.tag">Calm by design. Built in the open.</p></div>
    <nav aria-label="Footer"><a href="/os/">MeoArch OS</a><a href="/ai/">Meo AI</a><a href="/docs/" data-i18n="nav.docs">文档</a><a href="https://sourceforge.net/projects/meoarch/" target="_blank" rel="noreferrer">SourceForge</a><a href="https://github.com/QwQdoge" target="_blank" rel="noreferrer">GitHub</a></nav>
  </div></footer>
  <script src="/app.js"></script>
  <script src="/docs-live.js" defer></script>
  <script src="/notice.js" defer></script>'''


def shell(title, canonical, body, md_href=None):
    alt = f'\n  <link rel="alternate" type="text/markdown" href="{md_href}">' if md_href else ""
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} · MeoArch Docs</title>
  <meta name="theme-color" content="#7451c7">
  <link rel="canonical" href="{SITE}{canonical}">{alt}
  <link rel="icon" href="/assets/icons/Logo.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <!-- AI agents: read {SITE}/llms.txt and the Markdown versions of these pages instead of this HTML. -->
</head>
<body>
{HEADER}

  <main id="main">
{body}
  </main>

{FOOTER}
</body>
</html>
'''


GROUPS = [
    # key (url dir), nav title, docs, source dir, github base, by_source
    ("guide", "MeoArch", GUIDE_DOCS, CONTENT, CONTENT_REPO, GUIDE_BY_SOURCE, "content/"),
    ("meoui", "MeoUI", DOCS, UI, REPO, BY_SOURCE, "MeoUI/docs/"),
]


def doc_nav(group, active):
    current = ' aria-current="page"'
    nav = ""
    for key, title_g, docs, _, _, _, _ in GROUPS:
        items = "".join(
            f'<li><a href="/docs/{key}/{slug}.html"{current if (key == group and slug == active) else ""}>{html.escape(title)}</a></li>'
            for slug, _, title, _ in docs)
        nav += f'<p class="eyebrow">{title_g}</p><ul>{items}</ul>'
    return f'<nav class="doc-nav" aria-label="Docs">{nav}</nav>'


def main():
    for _, _, _, root, _, _, _ in GROUPS:
        if not root.is_dir():
            sys.exit(f"docs not found at {root}; set MEO_UI_ROOT")
    for key, _, docs, root, repo_base, by_source, label in GROUPS:
        out_dir = ROOT / "docs" / key
        out_dir.mkdir(parents=True, exist_ok=True)
        for slug, src, title, summary in docs:
            md = (root / src).read_text(encoding="utf-8")
            check_public(md, f"{label}{src}")
            live = key == "guide"
            if live:
                # Our own pages are served live from content/ (see docs-live.js and _redirects): no generated copy.
                (out_dir / f"{slug}.md").unlink(missing_ok=True)
            else:
                note = f"<!-- Generated from {label}{src}. Edit the source, not this copy. -->\n\n"
                (out_dir / f"{slug}.md").write_text(note + rewrite_links(md, src, ".md", by_source, repo_base), encoding="utf-8")
            body_html, toc = render(rewrite_links(md, src, ".html", by_source, repo_base))
            toc_html = ("<nav class=\"doc-toc\" aria-labelledby=\"toc-title\"><p id=\"toc-title\" class=\"eyebrow\" data-i18n=\"docs.toc\">本页</p><ul>"
                        + "".join(f'<li><a href="#{a}">{inline(t)}</a></li>' for a, t in toc) + "</ul></nav>") if len(toc) > 2 else ""
            if toc_html and "</h1>" in body_html:
                body_html = body_html.replace("</h1>", "</h1>\n" + toc_html, 1)
                toc_html = ""
            agent = slug == "for-agents"
            banner = (f'<p class="doc-banner"><span data-i18n="docs.{"agentpage" if agent else "source"}"></span> '
                      f'<a href="{repo_base}{src}" target="_blank" rel="noreferrer">{label}{src} ↗</a> · '
                      f'<a href="/docs/{key}/{slug}.md" data-i18n="docs.markdown">Markdown</a></p>')
            body = f'''    <div class="wrap doc-layout">
      {doc_nav(key, slug)}
      <article class="doc"{f' data-live-src="/content/{src}"' if live else ""}>
        {banner}
        {toc_html}
{body_html}
      </article>
    </div>'''
            (out_dir / f"{slug}.html").write_text(shell(title, f"/docs/{key}/{slug}", body, f"/docs/{key}/{slug}.md"), encoding="utf-8")

    def card_group(key, title_g, docs):
        cards = "".join(
            f'<a class="mini" href="/docs/{key}/{slug}.html"><h3>{html.escape(title)}</h3><p>{html.escape(summary)}</p><span>{"Markdown · " if slug == "for-agents" else ""}→</span></a>'
            for slug, _, title, summary in docs)
        return f'<h2 class="docs-group">{title_g}</h2>\n      <div class="mini-grid">{cards}</div>'
    groups_html = "\n      ".join(card_group(k, t, d) for k, t, d, *_ in GROUPS)
    # Documents that live with another product are listed here too, and open where they are kept.
    external = "".join(
        f'<a class="mini" href="{href}"><h3>{html.escape(title)}</h3><p>{html.escape(summary)}</p><span>→</span></a>'
        for title, href, summary in EXTERNAL_DOCS)
    groups_html += f'\n      <h2 class="docs-group">VRC Memories</h2>\n      <div class="mini-grid">{external}</div>'
    hub = f'''    <section class="section docs-hub"><div class="wrap">
      <div class="heading">
        <p class="eyebrow" data-i18n="docs.eyebrow">文档</p>
        <h1 data-i18n="docs.title">规范与文档。</h1>
        <p data-i18n="docs.lead"></p>
      </div>
      <div class="doc-audience">
        <div><h2 class="h3" data-i18n="docs.human.t">给人看</h2><p data-i18n="docs.human.p"></p></div>
        <div><h2 class="h3" data-i18n="docs.agent.t">给 AI Agent</h2><p data-i18n="docs.agent.p"></p><code class="install">{SITE}/llms.txt</code></div>
      </div>
      {groups_html}
    </div></section>'''
    (ROOT / "docs" / "index.html").write_text(shell("Docs", "/docs/", hub), encoding="utf-8")

    llms = [
        "# MeoArch",
        "",
        "> MeoArch is an Arch Linux based desktop system (Meo = Modern, Expressive, Open). Its apps share the MeoUI Qt Quick / QML design system.",
        "> This file is for coding agents that build on MeoUI. Repository-specific rules live in each repository's AGENTS.md; read it first, it takes precedence.",
        "",
        "## About",
        "",
    ]
    llms += [f"- [{title}]({SITE}/docs/guide/{slug}.md): {summary}" for slug, _, title, summary in GUIDE_DOCS]
    llms += ["", "## MeoUI specification", "", "Start with \"Rules for Coding Agents\", then read only the document that matches the task.", ""]
    llms += [f"- [{title}]({SITE}/docs/meoui/{slug}.md): {summary}" for slug, _, title, summary in DOCS]
    llms += [""]
    (ROOT / "llms.txt").write_text("\n".join(llms), encoding="utf-8")
    # The Markdown of our own pages is the file in content/ itself, so editing it needs no build.
    rules = "\n".join(f"/docs/guide/{slug}.md /content/{src} 200" for slug, src, _, _ in GUIDE_DOCS)
    (ROOT / "_redirects").write_text("# Generated by scripts/build_docs.py\n" + rules + "\n", encoding="utf-8")
    print(f"generated {sum(len(g[2]) for g in GROUPS)} documents")


if __name__ == "__main__":
    main()
