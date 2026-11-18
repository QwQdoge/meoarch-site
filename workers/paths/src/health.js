// meoarch.org/health: public service status. Data comes from Meo API (GET /v1/status) over a service
// binding; the page is rendered here so it works without script, and refreshes itself every 60 s.
import { errorResponse } from './meo-error-page.mjs';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const T = {
  zh: {
    title: 'MeoArch 服务状态', brand: '服务状态', home: '返回官网', updated: '更新于', auto: '每分钟自动刷新',
    overall: { operational: '所有系统运行正常', degraded: '部分服务性能下降', partial_outage: '部分服务中断', major_outage: '服务严重中断', maintenance: '正在进行计划维护' },
    state: { operational: '正常', degraded: '性能下降', partial_outage: '部分中断', major_outage: '严重中断', maintenance: '维护中' },
    impact: { none: '无影响', minor: '轻微', major: '较大', critical: '严重', maintenance: '维护' },
    status: { investigating: '调查中', identified: '已确认原因', monitoring: '观察中', resolved: '已解决', scheduled: '已计划', in_progress: '进行中', completed: '已完成' },
    ago: '90 天前', today: '今天', uptime: '可用率', noData: '暂无数据', active: '当前事件', past: '过去 30 天的事件', none: '没有报告的事件。',
    manual: '人工设置', checks: '次检查', down: '中断', slow: '降级', affected: '影响', lang: 'English', langHref: '?lang=en',
    unavailable: '暂时无法读取服务状态', unavailableBody: '状态服务本身没有回应。这通常意味着 Meo API 正在恢复，请稍后刷新。',
  },
  en: {
    title: 'MeoArch Status', brand: 'Status', home: 'Back to website', updated: 'Updated', auto: 'Refreshes every minute',
    overall: { operational: 'All systems operational', degraded: 'Degraded performance', partial_outage: 'Partial outage', major_outage: 'Major outage', maintenance: 'Scheduled maintenance in progress' },
    state: { operational: 'Operational', degraded: 'Degraded', partial_outage: 'Partial outage', major_outage: 'Major outage', maintenance: 'Maintenance' },
    impact: { none: 'No impact', minor: 'Minor', major: 'Major', critical: 'Critical', maintenance: 'Maintenance' },
    status: { investigating: 'Investigating', identified: 'Identified', monitoring: 'Monitoring', resolved: 'Resolved', scheduled: 'Scheduled', in_progress: 'In progress', completed: 'Completed' },
    ago: '90 days ago', today: 'Today', uptime: 'uptime', noData: 'No data', active: 'Active incidents', past: 'Past 30 days', none: 'No incidents reported.',
    manual: 'Set manually', checks: 'checks', down: 'down', slow: 'degraded', affected: 'Affects', lang: '中文', langHref: '?lang=zh',
    unavailable: 'Status is unavailable right now', unavailableBody: 'The status service itself did not answer. This usually means Meo API is recovering; refresh in a moment.',
  },
};

const fmtTime = (iso, lang) => new Date(iso).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { timeZone: 'Asia/Shanghai', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const fmtDay = (day, lang) => new Date(`${day}T00:00:00Z`).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' });

function barClass(d) {
  if (!d.checks && !d.incidents.length) return 'nodata';
  const impact = d.incidents.map((i) => i.impact);
  if (impact.includes('critical') || d.uptime !== null && d.uptime < 95) return 'major';
  if (impact.includes('major') || d.uptime !== null && d.uptime < 99) return 'partial';
  if (impact.includes('minor') || d.degraded || d.down) return 'minor';
  if (impact.includes('maintenance') || d.maintenance) return 'maint';
  return 'ok';
}

function tip(d, t, lang) {
  const lines = [fmtDay(d.day, lang)];
  lines.push(d.checks ? `${d.uptime}% ${t.uptime} · ${d.checks} ${t.checks}` : t.noData);
  if (d.down) lines.push(`${d.down} × ${t.down}`);
  if (d.degraded) lines.push(`${d.degraded} × ${t.slow}`);
  for (const i of d.incidents) lines.push(`⚠ ${i.title}`);
  return lines.join('\n');
}

export function renderMain(data, lang) {
  const t = T[lang];
  if (!data) return `<section class="banner major_outage"><span class="ico">!</span><div><h1>${t.unavailable}</h1><p>${t.unavailableBody}</p></div></section>`;
  const name = (n) => esc(n?.[lang] ?? n?.zh ?? '');
  const active = data.incidents.filter((i) => !i.resolvedAt && i.status !== 'scheduled');
  const scheduled = data.incidents.filter((i) => i.status === 'scheduled');
  const past = data.incidents.filter((i) => i.resolvedAt);
  const comp = new Map(data.components.map((c) => [c.id, c]));
  const incidentCard = (i) => `<article class="incident ${esc(i.impact)}"><header><h3>${esc(i.title)}</h3><span class="pill">${esc(t.status[i.status] ?? i.status)}</span></header>
    ${i.components.length ? `<p class="affects">${t.affected}: ${i.components.map((id) => name(comp.get(id)?.name)).join(' · ')}</p>` : ''}
    <ol class="timeline">${i.updates.map((u) => `<li><b>${esc(t.status[u.status] ?? u.status)}</b> <span>${esc(u.body)}</span><time>${fmtTime(u.createdAt, lang)}</time></li>`).join('')}</ol></article>`;
  const groups = data.groups.map((g) => {
    const items = data.components.filter((c) => c.group === g.id);
    if (!items.length) return '';
    return `<section class="group"><h2>${name(g.name)}</h2>${items.map((c) => `<div class="comp">
      <div class="row"><div><span class="cname">${name(c.name)}</span><span class="cdesc">${name(c.description)}</span></div>
      <span class="cstate ${esc(c.state)}">${c.manual ? `<span class="manual" title="${t.manual}">●</span>` : ''}${esc(t.state[c.state])}</span></div>
      ${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}
      <div class="bars" role="img" aria-label="${name(c.name)} · ${c.uptime90 ?? '—'}% ${t.uptime}">${c.history.map((d) => `<i class="${barClass(d)}" data-tip="${esc(tip(d, t, lang))}"></i>`).join('')}</div>
      <div class="axis"><span>${t.ago}</span><span>${c.uptime90 === null ? t.noData : `${c.uptime90}% ${t.uptime}`}</span><span>${t.today}</span></div></div>`).join('')}</section>`;
  }).join('');
  return `<section class="banner ${esc(data.overall)}"><span class="ico">${data.overall === 'operational' ? '✓' : data.overall === 'maintenance' ? '⚙' : '!'}</span><div><h1>${esc(t.overall[data.overall])}</h1><p>${t.updated} ${fmtTime(data.checkedAt, lang)} · ${t.auto}</p></div></section>
  ${active.length ? `<section class="list"><h2 class="sec">${t.active}</h2>${active.map(incidentCard).join('')}</section>` : ''}
  ${scheduled.length ? `<section class="list">${scheduled.map(incidentCard).join('')}</section>` : ''}
  ${groups}
  <section class="list"><h2 class="sec">${t.past}</h2>${past.length ? past.map(incidentCard).join('') : `<p class="empty">${t.none}</p>`}</section>`;
}

const CSS = `:root{color-scheme:light dark;--bg:#f8f7fb;--card:#fff;--text:#1d1b20;--muted:#625b70;--line:#e7e1ee;--primary:#65558f;--soft:#eee8fa;--ok:#1e9e5a;--minor:#e2a400;--partial:#ea7a17;--major:#d93636;--maint:#3b82f6;--nodata:#dcd6e3}
@media(prefers-color-scheme:dark){:root{--bg:#141218;--card:#1d1b22;--text:#ece6f0;--muted:#cac2d5;--line:#36313f;--primary:#cfbdfe;--soft:#2b2537;--ok:#3fbf7a;--minor:#f0c040;--partial:#f59a4a;--major:#ef5b5b;--maint:#6aa3ff;--nodata:#3a3543}}
*{box-sizing:border-box}html,body{margin:0;max-width:100%;overflow-x:clip}body{background:var(--bg);color:var(--text);font:15px/1.6 system-ui,-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}
.wrap{max-width:860px;margin:0 auto;padding:0 16px}header.top{display:flex;align-items:center;gap:12px;padding:24px 0}header.top a{color:var(--muted);text-decoration:none;font-size:14px}.brand{display:flex;align-items:center;gap:10px;margin-right:auto;color:var(--text)!important;font-weight:600;font-size:17px!important}
.banner{display:flex;gap:16px;align-items:center;padding:22px 24px;border-radius:20px;color:#fff;margin:8px 0 28px}.banner h1{margin:0;font-size:22px;line-height:1.3}.banner p{margin:2px 0 0;opacity:.9;font-size:13px}.banner .ico{width:40px;height:40px;flex:none;border-radius:50%;background:#ffffff33;display:grid;place-items:center;font-size:22px;font-weight:700}
.banner.operational{background:var(--ok)}.banner.degraded{background:var(--minor);color:#231a00}.banner.partial_outage{background:var(--partial)}.banner.major_outage{background:var(--major)}.banner.maintenance{background:var(--maint)}
.group{background:var(--card);border:1px solid var(--line);border-radius:20px;margin:0 0 18px;overflow:hidden}.group h2{margin:0;padding:14px 20px;font-size:13px;letter-spacing:.04em;color:var(--muted);border-bottom:1px solid var(--line);font-weight:600}
.comp{padding:16px 20px;border-bottom:1px solid var(--line)}.comp:last-child{border-bottom:0}.row{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.cname{font-weight:600}.cdesc{display:block;color:var(--muted);font-size:12px}
.cstate{font-size:13px;font-weight:600;white-space:nowrap;color:var(--ok)}.cstate.degraded{color:var(--minor)}.cstate.partial_outage{color:var(--partial)}.cstate.major_outage{color:var(--major)}.cstate.maintenance{color:var(--maint)}.manual{font-size:9px;margin-right:6px;vertical-align:2px}
.note{margin:6px 0 0;font-size:13px;color:var(--muted)}
.bars{display:flex;gap:2px;height:34px;margin-top:12px}.bars i{flex:1;min-width:0;border-radius:3px;background:var(--ok);cursor:default}.bars i:hover,.bars i.on{opacity:.7}.bars .minor{background:var(--minor)}.bars .partial{background:var(--partial)}.bars .major{background:var(--major)}.bars .maint{background:var(--maint)}.bars .nodata{background:var(--nodata)}
.axis{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;margin-top:6px}
.sec{font-size:17px;margin:32px 0 12px}.incident{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--minor);border-radius:16px;padding:16px 20px;margin:0 0 12px}.incident.major{border-left-color:var(--partial)}.incident.critical{border-left-color:var(--major)}.incident.maintenance{border-left-color:var(--maint)}.incident.none{border-left-color:var(--line)}
.incident header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.incident h3{margin:0;font-size:16px}.pill{font-size:12px;padding:2px 10px;border-radius:999px;background:var(--soft);color:var(--primary);white-space:nowrap}.affects{margin:4px 0 0;font-size:12px;color:var(--muted)}
.timeline{list-style:none;margin:10px 0 0;padding:0}.timeline li{padding:8px 0;border-top:1px dashed var(--line);font-size:14px}.timeline li:first-child{border-top:0}.timeline span{white-space:pre-wrap}.timeline time{display:block;color:var(--muted);font-size:12px}.empty{color:var(--muted)}
footer{color:var(--muted);font-size:12px;padding:28px 0 48px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}footer a{color:var(--muted)}
#tip{position:fixed;z-index:9;pointer-events:none;background:var(--text);color:var(--bg);font-size:12px;line-height:1.5;padding:8px 10px;border-radius:10px;white-space:pre;max-width:260px;display:none}
@media(max-width:600px){.bars{height:28px;gap:1px}.bars i:nth-child(-n+30){display:none}.axis span:first-child{visibility:hidden}.banner{padding:18px}.banner h1{font-size:19px}.comp,.group h2{padding-left:16px;padding-right:16px}}`;

const SCRIPT = `(function(){var tip=document.getElementById('tip'),cur;function hide(){tip.style.display='none';if(cur)cur.classList.remove('on');cur=null}
function show(el){if(cur)cur.classList.remove('on');cur=el;el.classList.add('on');tip.textContent=el.getAttribute('data-tip');tip.style.display='block';var r=el.getBoundingClientRect(),w=tip.offsetWidth;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';tip.style.top=(r.top-tip.offsetHeight-8)+'px'}
document.addEventListener('mouseover',function(e){var b=e.target.closest&&e.target.closest('[data-tip]');b?show(b):hide()});document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-tip]');b?show(b):hide()});addEventListener('scroll',hide,{passive:true});
setInterval(function(){if(document.hidden)return;fetch(location.pathname.replace(/\\/$/,'')+'/fragment'+location.search,{cache:'no-store'}).then(function(r){return r.ok?r.text():null}).then(function(h){if(h)document.getElementById('main').innerHTML=h}).catch(function(){})},60000)})();`;

function page(data, lang) {
  const t = T[lang];
  return `<!doctype html><html lang="${lang === 'zh' ? 'zh-CN' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t.title}</title><meta name="description" content="${t.title}"><link rel="canonical" href="https://meoarch.org/health"><link rel="icon" href="https://account.meoarch.org/meoarch-logo.svg" type="image/svg+xml"><style>${CSS}</style></head>
<body><div class="wrap"><header class="top"><a class="brand" href="https://meoarch.org/"><img src="https://account.meoarch.org/meoarch-logo.svg" width="44" height="20" alt="MeoArch">${t.brand}</a><a href="${t.langHref}">${t.lang}</a><a href="https://meoarch.org/">${t.home}</a></header>
<main id="main">${renderMain(data, lang)}</main><footer><span>MeoArch · ${t.auto}</span><a href="https://api.meoarch.org/v1/status">JSON</a></footer></div><div id="tip" role="tooltip"></div><script>${SCRIPT}</script></body></html>`;
}

async function load(env) {
  try {
    const response = await env.API.fetch(new Request('https://api.meoarch.org/v1/status', { headers: { Accept: 'application/json' } }));
    return response.ok ? await response.json() : null;
  } catch { return null; }
}

export async function health(request, env) {
  const url = new URL(request.url);
  if (request.method !== 'GET' && request.method !== 'HEAD') return errorResponse('405', request);
  const sub = url.pathname.replace(/^\/health\/?/, '');
  if (sub && sub !== 'fragment' && sub !== 'status.json' && sub !== 'meo-version.json') return errorResponse('404', request);
  const q = url.searchParams.get('lang');
  const lang = q === 'en' || q === 'zh' ? q : (/^zh/i.test((request.headers.get('accept-language') || 'zh').trim()) ? 'zh' : 'en');
  const data = await load(env);
  const headers = { 'Cache-Control': 'public, max-age=30', 'X-Content-Type-Options': 'nosniff', Vary: 'Accept-Language' };
  if (sub === 'status.json') return new Response(data ? JSON.stringify(data) : '{"error":{"code":"status_unavailable"}}', { status: data ? 200 : 503, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
  const html = sub === 'fragment' ? renderMain(data, lang) : page(data, lang);
  return new Response(request.method === 'HEAD' ? null : html, { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
}
