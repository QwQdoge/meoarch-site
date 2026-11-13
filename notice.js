/* One small notice for every MeoArch site (meoarch.org and its subdomains). It reads /notice.json, shows the first
   notice meant for this site that the visitor has not closed, and remembers the close for a year in a cookie on
   .meoarch.org, so closing it once hides it everywhere. Edit notice.json and push to publish or change a notice. */
(() => {
  'use strict';
  const SRC = 'https://meoarch.org/notice.json';
  const KEY = 'meo_notice_seen';
  const host = location.hostname;
  const zh = String(document.documentElement.lang || navigator.language || '').toLowerCase().startsWith('zh');
  const pick = (v) => (v && typeof v === 'object' ? (zh ? v.zh : v.en) || v.en || v.zh || '' : String(v || ''));

  const seen = () => {
    let raw = '';
    try { raw = (document.cookie.split('; ').find((c) => c.startsWith(KEY + '=')) || '').slice(KEY.length + 1); } catch (e) { /* no cookies */ }
    if (!raw) { try { raw = localStorage.getItem(KEY) || ''; } catch (e) { /* no storage */ } }
    try { return decodeURIComponent(raw).split(',').filter(Boolean); } catch (e) { return []; }
  };
  const remember = (ids) => {
    const value = ids.join(',');
    const shared = /(^|\.)meoarch\.org$/.test(host) ? '; Domain=.meoarch.org' : '';
    try {
      document.cookie = `${KEY}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}${shared}`;
    } catch (e) { /* no cookies */ }
    try { localStorage.setItem(KEY, value); } catch (e) { /* no storage */ }
  };

  const forThisSite = (n) => {
    if (!n || !n.id || (n.until && Date.now() > Date.parse(n.until))) return false;
    if (Array.isArray(n.exclude) && n.exclude.includes(host)) return false;
    return !Array.isArray(n.sites) || n.sites.includes('*') || n.sites.includes(host);
  };

  function show(n) {
    const root = document.createElement('div');
    root.setAttribute('role', 'status');
    root.style.cssText = 'all:initial;position:fixed;z-index:2147483000;pointer-events:none;inset:0';
    const shadow = root.attachShadow({ mode: 'open' });
    const href = n.href && /^https?:\/\//.test(n.href) ? n.href : '';
    shadow.innerHTML = `<style>
      .bar{position:fixed;right:16px;bottom:16px;max-width:380px;box-sizing:border-box;display:flex;align-items:center;gap:10px;
        padding:8px 8px 8px 14px;border-radius:14px;font:13px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans SC",sans-serif;
        color:#1f1b2d;background:#f6f2ff;border:1px solid #d9d0f0;box-shadow:0 6px 24px rgb(40 20 80 / .16);pointer-events:auto;
        opacity:0;transform:translateY(10px);transition:opacity .28s cubic-bezier(.2,.8,.2,1),transform .28s cubic-bezier(.2,.8,.2,1)}
      .bar.in{opacity:1;transform:none}
      span{flex:1;min-width:0}
      a{color:#5b3fb0;font-weight:600;text-decoration:none;white-space:nowrap}a:hover{text-decoration:underline}
      button{all:unset;cursor:pointer;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;color:inherit;opacity:.7;font-size:15px}
      button:hover{opacity:1;background:rgb(120 90 200 / .14)}button:focus-visible,a:focus-visible{outline:2px solid #7451c7;outline-offset:2px}
      @media (prefers-color-scheme:dark){.bar{color:#ece8f8;background:#2a2540;border-color:#40395c}a{color:#b9a5ff}}
      @media (max-width:700px){.bar{left:12px;right:12px;bottom:auto;top:12px;max-width:none}}
      @media (prefers-reduced-motion:reduce){.bar{transition:none}}
    </style>
    <div class="bar"><span></span>${href ? '<a target="_blank" rel="noopener"></a>' : ''}<button type="button" aria-label="${zh ? '关闭' : 'Close'}">✕</button></div>`;
    const bar = shadow.querySelector('.bar');
    shadow.querySelector('span').textContent = pick(n.text);
    const a = shadow.querySelector('a');
    if (a) { a.href = href; a.textContent = pick(n.label) || (zh ? '了解详情' : 'Details'); }
    shadow.querySelector('button').addEventListener('click', () => {
      remember([...new Set([...seen(), n.id])]);
      bar.classList.remove('in');
      setTimeout(() => root.remove(), 300);
    });
    document.body.appendChild(root);
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('in')));
  }

  const start = () => fetch(SRC, { cache: 'default' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const done = seen();
      const n = ((data && data.notices) || []).find((x) => forThisSite(x) && !done.includes(x.id));
      if (n) show(n);
    })
    .catch(() => { /* a notice is never worth an error */ });
  // Late and idle, so it never competes with the page.
  const later = () => setTimeout(start, 1200);
  if (document.readyState === 'complete') later(); else addEventListener('load', later, { once: true });
})();
