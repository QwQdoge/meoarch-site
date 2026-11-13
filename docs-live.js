/* Guide pages show the latest Markdown without a rebuild: the page is pre-rendered (for search engines and as a
   fallback), then the source in /content is fetched and drawn again when it differs. Editing content/*.md and
   pushing is enough. Same subset of Markdown as scripts/build_docs.py. */
(() => {
  'use strict';
  const article = document.querySelector('article.doc[data-live-src]');
  if (!article) return;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const attr = (s) => esc(s).replace(/"/g, '&quot;');
  const slugify = (t) => t.replace(/`|\*/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const link = (href) => (/^[a-z]+:|^#/i.test(href) ? href : href.replace(/\.md(#|$)/, '.html$1'));
  function inline(text) {
    return text.split(/(`[^`]+`)/).map((part) => {
      if (part.length > 1 && part.startsWith('`') && part.endsWith('`')) return `<code>${esc(part.slice(1, -1))}</code>`;
      let s = esc(part);
      s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, h) => `<a href="${attr(link(h))}">${t}</a>`);
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/(^|[^\w*])_(.+?)_(?![\w*])/g, '$1<em>$2</em>');
      s = s.replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?![\w*])/g, '$1<em>$2</em>');
      return s;
    }).join('');
  }
  function render(md) {
    const lines = md.split(/\r?\n/), out = [], toc = [];
    let i = 0;
    const listRe = /^(\s*)([-*]|\d+\.)\s+(.*)/;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith('```')) {
        const code = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
        out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
        i++;
        continue;
      }
      let m = line.match(/^(#{1,4})\s+(.*)/);
      if (m) {
        const id = slugify(m[2]);
        if (m[1].length === 2) toc.push([id, m[2]]);
        out.push(`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`);
        i++;
        continue;
      }
      if (/^-{3,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
      if (line.startsWith('>')) {
        const quote = [];
        while (i < lines.length && lines[i].startsWith('>')) quote.push(lines[i++].replace(/^>+/, '').trim());
        out.push(`<blockquote>${inline(quote.filter(Boolean).join(' '))}</blockquote>`);
        continue;
      }
      if (line.startsWith('|') && i + 1 < lines.length && /^\|\s*:?-/.test(lines[i + 1])) {
        const row = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const head = row(line), body = [];
        i += 2;
        while (i < lines.length && lines[i].startsWith('|')) body.push(row(lines[i++]));
        out.push('<div class="table-scroll"><table><thead><tr>' + head.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
          body.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
        continue;
      }
      m = line.match(listRe);
      if (m) {
        const tag = /\d/.test(m[2][0]) ? 'ol' : 'ul', items = [];
        while (i < lines.length) {
          const n = lines[i].match(listRe);
          if (n) { items.push(n[3]); i++; }
          else if (lines[i].startsWith('  ') && lines[i].trim() && items.length) { items[items.length - 1] += ' ' + lines[i].trim(); i++; }
          else break;
        }
        out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${tag}>`);
        continue;
      }
      if (!line.trim()) { i++; continue; }
      const para = [line.trim()];
      i++;
      while (i < lines.length && lines[i].trim() && !/^(#|```|\||>|-{3,}\s*$|\s*([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++].trim());
      out.push(`<p>${inline(para.join(' '))}</p>`);
    }
    let html = out.join('\n');
    if (toc.length > 2 && html.includes('</h1>')) {
      const items = toc.map(([a, t]) => `<li><a href="#${a}">${inline(t)}</a></li>`).join('');
      html = html.replace('</h1>', `</h1>\n<nav class="doc-toc" aria-labelledby="toc-title"><p id="toc-title" class="eyebrow" data-i18n="docs.toc">本页</p><ul>${items}</ul></nav>`);
    }
    return html;
  }
  fetch(article.dataset.liveSrc, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
    .then((md) => {
      const banner = article.querySelector('.doc-banner');
      const html = render(md);
      const probe = document.createElement('div');
      probe.innerHTML = html;
      const current = [...article.children].filter((c) => c !== banner).map((c) => c.outerHTML).join('\n');
      if (probe.innerHTML.replace(/\s+/g, ' ') === current.replace(/\s+/g, ' ')) return;
      [...article.children].forEach((c) => { if (c !== banner) c.remove(); });
      article.insertAdjacentHTML('beforeend', html);
      if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    })
    .catch(() => { /* keep the pre-rendered page */ });
})();
