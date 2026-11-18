// MeoArch shared error pages: one design for every host (meoarch.org, api., account., ai., os.).
// Canonical source: meoarch-site/errors/meo-error-page.src.mjs. `node scripts/build_errors.mjs` inlines the logo,
// writes meo-error-page.mjs, the static pages (errors/*.html, 404.html) and copies the module into each Worker.
// Copy follows the Meo Account status catalog (MeoArch-account lib/src/core/widgets/account_status_catalog.dart).

const LOGO = '__LOGO_SVG__';
export const STATUS_URL = 'https://meoarch.org/health';

// {p} is the product name of the host that failed (MeoArch, Meo Account, Meo AI ...).
const zh = {
  '400': ['请求有问题', '这个请求没有被接受。', '请求内容可能不完整、格式不正确，或已经失去有效信息。请返回上一页后重新尝试。', '如果你是从 Meo 应用打开这里，请重新发起刚才的操作。', '{!}'],
  '401': ['需要登录', '先确认一下你的身份。', '这个页面需要有效的 Meo Account 登录状态。登录后就可以继续。', '', '⌁'],
  '403': ['无法访问', '这里暂时不对你开放。', '当前账户或网络没有访问这个页面、执行这项操作所需要的权限。', '切换账户或权限发生变化后，可以再试一次。', '⌁'],
  '404': ['页面未找到', '好像走错了一个路口。', '这个页面可能已移动，或链接地址不完整。回到 {p}，继续你要做的事。', '请检查地址是否正确。', '404'],
  '405': ['方法不被允许', '这扇门不能这样打开。', '这个地址不接受当前的请求方式。请从页面上的按钮或链接重新进入。', '', '405'],
  '408': ['请求超时', '这次连接等得有点久。', '服务器没有及时收到完整请求。网络恢复后重新尝试通常就可以继续。', '', '···'],
  '409': ['状态冲突', '这项操作和当前状态对不上。', '状态已经发生变化，刚才的请求不能按原来的方式继续。刷新信息后再尝试。', '', '409'],
  '410': ['内容已失效', '这个入口已经不再有效。', '对应的链接或一次性操作已经结束。为了安全，请从 {p} 重新开始。', '', '410'],
  '429': ['操作太频繁', '先给它一点时间。', '短时间内的请求次数太多。稍后再试可以帮助保护你的账户和服务稳定性。', '', '429'],
  '500': ['服务出错', '这次是我们这边出了问题。', '{p} 没有正确完成请求。你的操作没有被假装完成，可以稍后安全重试。', '', '500'],
  '502': ['上游连接失败', '我们没有收到正确的服务响应。', '{p} 依赖的一个服务暂时没有正常回应。等连接恢复后再试。', '', '502'],
  '503': ['暂时不可用', '{p} 正在休息一下。', '服务可能正在维护或暂时繁忙。你的数据不会因为这个页面而受到影响。', '稍后重新打开通常就可以继续。', '503'],
  '504': ['响应超时', '服务回应得太慢了。', '{p} 依赖的一个服务没有在规定时间内回应。稍后重试通常就可以继续。', '', '504'],
  offline: ['网络已断开', '现在还连不到 {p}。', '检查 Wi‑Fi、移动网络或代理连接。网络恢复以后，可以重新打开这个页面。', '', '⌁'],
  maintenance: ['维护中', '我们正在整理一些东西。', '{p} 正在进行计划维护。完成后服务会恢复，不需要重新操作账户。', '', '···'],
  expired: ['链接已过期', '这个安全链接已经失效。', '为了保护你的账户，一次性登录、验证和恢复链接只会在短时间内有效。', '请使用最新收到的邮件链接。', '↻'],
};
const en = {
  '400': ['Bad request', 'This request could not be accepted.', 'The request may be incomplete, malformed, or missing information that is no longer valid.', 'If you opened this from a Meo app, start the action again there.', '{!}'],
  '401': ['Sign-in required', 'Confirm your identity first.', 'This page needs a valid Meo Account session. Sign in to continue.', '', '⌁'],
  '403': ['Access denied', 'This area is not open to you right now.', 'This account or network does not have permission to view this page or perform this action.', 'Try again after switching accounts or once permissions change.', '⌁'],
  '404': ['Page not found', 'Looks like you took a wrong turn.', 'This page may have moved, or the link may be incomplete. Return to {p} and keep going.', 'Check that the address is correct.', '404'],
  '405': ['Method not allowed', 'This door does not open that way.', 'This address does not accept this kind of request. Come back in through a button or link on the page.', '', '405'],
  '408': ['Request timeout', 'This connection took a little too long.', 'The server did not receive the complete request in time. Try again when the connection is stable.', '', '···'],
  '409': ['Conflict', 'This action no longer matches the current state.', 'Something changed, so the original request cannot continue as-is. Refresh and try again.', '', '409'],
  '410': ['Gone', 'This entry point is no longer valid.', 'The link or one-time action has ended. Start again from {p} for a fresh secure request.', '', '410'],
  '429': ['Too many requests', 'Give it a little time.', 'There were too many requests in a short period. Waiting before trying again helps protect your account and the service.', '', '429'],
  '500': ['Service error', 'This one is on our side.', '{p} could not complete the request correctly. The action was not pretended to have succeeded, so it is safe to retry later.', '', '500'],
  '502': ['Bad gateway', 'We did not receive a valid service response.', 'A service {p} depends on did not respond correctly. Try again after the connection recovers.', '', '502'],
  '503': ['Temporarily unavailable', '{p} is taking a short break.', 'The service may be under maintenance or temporarily busy. Your data is not affected by this page.', 'Reopening it a little later usually works.', '503'],
  '504': ['Gateway timeout', 'The service took too long to answer.', 'A service {p} depends on did not respond in time. Retrying in a moment usually works.', '', '504'],
  offline: ['Offline', '{p} cannot be reached right now.', 'Check Wi‑Fi, mobile data, VPN, or proxy connectivity, then try again when the network is back.', '', '⌁'],
  maintenance: ['Maintenance', 'We are tidying a few things up.', '{p} is undergoing planned maintenance. Service will return when it is complete.', '', '···'],
  expired: ['Link expired', 'This secure link is no longer valid.', 'For your security, one-time sign-in, verification, and recovery links only work for a limited time.', 'Use the newest link you received by email.', '↻'],
};

export const errorKinds = Object.keys(zh);
export const errorStatus = { offline: 503, maintenance: 503, expired: 410 };
export const statusOf = (kind) => errorStatus[kind] ?? Number(kind);

// Host -> product name and home link. Unknown hosts fall back to the MeoArch site.
const HOSTS = {
  'account.meoarch.org': ['Meo Account', 'https://account.meoarch.org/'],
  'api.meoarch.org': ['Meo API', 'https://meoarch.org/'],
  'ai.meoarch.org': ['Meo AI', 'https://ai.meoarch.org/'],
  'chat.meoarch.org': ['Meo AI', 'https://chat.meoarch.org/'],
  'os.meoarch.org': ['MeoArch OS', 'https://os.meoarch.org/'],
};
export function productFor(host = '', path = '') {
  if (host === 'meoarch.org' && /^\/ai(\/|$)/.test(path)) return ['Meo AI', 'https://meoarch.org/ai/'];
  if (host === 'meoarch.org' && /^\/os(\/|$)/.test(path)) return ['MeoArch OS', 'https://meoarch.org/os/'];
  return HOSTS[host] ?? ['MeoArch', 'https://meoarch.org/'];
}

export function preferredLang(acceptLanguage = '') {
  const first = String(acceptLanguage).split(',')[0].trim().toLowerCase();
  if (!first) return 'zh';
  return first.startsWith('zh') ? 'zh' : 'en';
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Renders one full error page. Self-contained: inline CSS and logo, no script, no external requests,
 * so it still renders when every other MeoArch host is down.
 * lang 'auto' (static pages) shows Chinese or English by the browser language with CSS only.
 */
export function renderErrorPage(kind, { lang = 'zh', product = 'MeoArch', home = 'https://meoarch.org/', dark = false, requestId = '' } = {}) {
  if (!zh[kind]) kind = '404';
  const fill = (text) => String(text).replaceAll('{p}', product);
  const block = (table, code) => {
    const [tag, title, body, hint, shape] = table[kind];
    const isZh = code === 'zh';
    const status = statusOf(kind);
    const signIn = kind === '401' || kind === 'expired';
    const primary = kind === '408' || kind === '429' || kind === 'offline' || status >= 500
      ? [isZh ? '重新加载' : 'Reload', '']
      : signIn ? [isZh ? (kind === 'expired' ? '重新开始' : '前往登录') : (kind === 'expired' ? 'Start again' : 'Go to sign in'), 'https://account.meoarch.org/login']
      : [isZh ? `返回 ${product}` : `Back to ${product}`, home];
    const secondary = status >= 500 || kind === 'offline' || kind === 'maintenance'
      ? [isZh ? '查看服务状态' : 'Service status', STATUS_URL]
      : primary[1] === home ? null : [isZh ? `返回 ${product}` : `Back to ${product}`, home];
    // A link to the current address reloads without script.
    const primaryHref = primary[1] || '';
    return `<div class="copy" lang="${isZh ? 'zh-CN' : 'en'}" data-l="${code}"><span class="tag">${esc(fill(tag))}</span><h1>${esc(fill(title))}</h1><p>${esc(fill(body))}</p><div class="actions"><a class="button" href="${esc(primaryHref)}">${esc(primary[0])}&nbsp; ↗</a>${secondary ? `<a class="button secondary" href="${esc(secondary[1])}">${esc(secondary[0])}</a>` : ''}</div>${hint ? `<p class="hint">${esc(fill(hint))}</p>` : ''}<p class="code">${esc(table[kind][4] === '{!}' ? kind : kind.toUpperCase())}${requestId ? ` · ${esc(requestId)}` : ''}</p></div>`;
  };
  const both = lang === 'auto';
  const shape = zh[kind][4] === '{!}' ? '!' : zh[kind][4];
  const titleText = (lang === 'en' ? en : zh)[kind][0];
  const pageLang = lang === 'en' ? 'en' : 'zh-CN';
  return `<!doctype html><html lang="${pageLang}"${dark ? ' data-theme="dark"' : ''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(fill(titleText))} · ${esc(product)}</title><style>
:root{color-scheme:light dark;--bg:#f8f7fb;--card:#fff;--text:#252131;--muted:#625b70;--primary:#65558f;--on:#fff;--soft:#eee8fa;--border:#e7e1ee}html[data-theme=dark]{--bg:#141218;--card:#211f26;--text:#ece6f0;--muted:#cac2d5;--primary:#cfbdfe;--on:#352650;--soft:#352e43;--border:#494252}@media(prefers-color-scheme:dark){html:not([data-theme]){--bg:#141218;--card:#211f26;--text:#ece6f0;--muted:#cac2d5;--primary:#cfbdfe;--on:#352650;--soft:#352e43;--border:#494252}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;min-height:100svh;display:flex;flex-direction:column}header{padding:28px 5vw;display:flex;align-items:center;justify-content:space-between}.brand{display:inline-flex;align-items:center;gap:12px;font-size:14px;color:var(--muted);text-decoration:none}.brand svg{display:block}.meta{font-size:12px;color:var(--muted);text-decoration:none}.meta:hover{color:var(--primary)}main{flex:1;display:grid;place-items:center;padding:30px 24px 60px}.panel{width:min(100%,1000px);display:grid;grid-template-columns:1fr 1.15fr;align-items:center;gap:72px;padding:64px;border:1px solid var(--border);background:var(--card);border-radius:36px}.art{position:relative;aspect-ratio:1;display:grid;place-items:center}.halo{width:88%;height:88%;border-radius:50%;background:var(--soft);position:absolute}.orbit{position:absolute;inset:0;border:1px dashed var(--border);border-radius:50%;transform:rotate(-25deg)}.tile{width:68%;height:62%;background:var(--card);border:1px solid var(--border);border-radius:28px;box-shadow:0 20px 45px #3526500a;transform:rotate(-9deg);display:grid;place-items:center;font-size:65px;font-weight:650;letter-spacing:-5px;color:var(--primary)}.dot{width:42px;height:42px;position:absolute;bottom:8%;right:8%;border-radius:50%;background:var(--primary);color:var(--on);display:grid;place-items:center;font-size:23px}.tag{display:inline-block;font-size:12px;color:var(--primary);background:var(--soft);border-radius:30px;padding:7px 13px;margin-bottom:20px}h1{margin:0 0 18px;font-size:34px;line-height:1.4;letter-spacing:-1px}p{font-size:15px;line-height:1.9;color:var(--muted);margin:0 0 25px}.actions{display:flex;gap:12px;flex-wrap:wrap}.button{display:inline-flex;min-height:48px;align-items:center;padding:13px 22px;border-radius:28px;background:var(--primary);color:var(--on);font-size:14px;font-weight:600;text-decoration:none}.secondary{background:transparent;border:1px solid var(--border);color:var(--primary)}.hint{margin:24px 0 0;font-size:12px}.code{font-size:11px;letter-spacing:2px;margin:24px 0 0;opacity:.75}footer{padding:0 5vw 26px;display:flex;justify-content:space-between;gap:18px;color:var(--muted);font-size:12px}a:focus-visible{outline:3px solid var(--primary);outline-offset:5px}
html:not([lang=en]) .both [data-l=en],html[lang=en] .both [data-l=zh]{display:none}
@media(max-width:720px){header{padding:22px 16px}main{padding:12px 16px 32px}.panel{padding:30px 24px;grid-template-columns:1fr;gap:24px;border-radius:28px}.art{width:180px;margin:auto}.tile{font-size:44px}.dot{width:30px;height:30px;font-size:19px}h1{font-size:27px}.tag{margin-bottom:16px}footer{padding:0 16px 24px;flex-wrap:wrap}}
</style>${both ? `<script>if(!/^zh/i.test(navigator.language||''))document.documentElement.lang='en'</script>` : ''}</head><body${both ? ' class="both"' : ''}><header><a class="brand" href="${esc(home)}">${LOGO}<span>${esc(product)}</span></a><a class="meta" href="${STATUS_URL}">${both ? '<span data-l="zh">服务状态</span><span data-l="en">Service status</span>' : lang === 'en' ? 'Service status' : '服务状态'}</a></header><main><section class="panel" aria-labelledby="title"><div class="art" aria-hidden="true"><div class="halo"></div><div class="orbit"></div><div class="tile">${esc(shape)}</div><div class="dot">↗</div></div><div id="title">${lang === 'en' ? block(en, 'en') : block(zh, 'zh')}${both ? block(en, 'en') : ''}</div></section></main><footer><span>${product === 'MeoArch' ? 'MeoArch' : `${esc(product)} · MeoArch`}</span><span>${both ? '<span data-l="zh">清晰、安全、始终由你掌控。</span><span data-l="en">Clear, safe, always in your hands.</span>' : lang === 'en' ? 'Clear, safe, always in your hands.' : '清晰、安全、始终由你掌控。'}</span></footer></body></html>`;
}

/** Full Response for a Worker. HEAD gets headers only. */
export function errorResponse(kind, request, extra = {}) {
  const url = request ? new URL(request.url) : null;
  const [product, home] = productFor(url?.hostname, url?.pathname);
  const lang = extra.lang ?? preferredLang(request?.headers.get('accept-language') ?? '');
  const status = statusOf(zh[kind] ? kind : '404');
  const headers = {
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Content-Language': lang === 'en' ? 'en' : 'zh-CN', 'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    ...(status === 503 || status === 429 ? { 'Retry-After': '30' } : {}),
  };
  const body = request?.method === 'HEAD' ? null : renderErrorPage(kind, { lang, product, home, ...extra });
  return new Response(body, { status, headers });
}

/** True when the client is a browser asking for a page (API clients keep their JSON errors). */
export const wantsHtml = (request) => (request.headers.get('accept') || '').includes('text/html');
