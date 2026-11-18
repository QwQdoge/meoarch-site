import { health } from './health.js';
import { errorResponse, wantsHtml } from './meo-error-page.mjs';

// meoarch.org/health is the public service status page (health.js).
// meoarch.org/os and meoarch.org/ai: the intro pages of MeoArch OS and Meo AI live on their own hosts
// (os.meoarch.org, ai.meoarch.org). This Worker serves them under the main domain, so every project's
// "details" page sits at meoarch.org/<project>. (VRC Memories is served the same way by its own Worker.)
const OS_ORIGIN = 'https://meoarch-os-webside.pages.dev';
const AI_ORIGIN = 'https://ai.meoarch.org';

const forwarded = (request) => {
  const headers = new Headers();
  for (const name of ['accept', 'accept-language']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
};

class Prefix {
  constructor(attribute, prefix) { this.attribute = attribute; this.prefix = prefix; }
  element(element) {
    const value = element.getAttribute(this.attribute);
    if (value && value.startsWith('/') && !value.startsWith('//')) element.setAttribute(this.attribute, this.prefix + value);
  }
}

class Absolute {
  constructor(attribute, value) { this.attribute = attribute; this.value = value; }
  element(element) { element.setAttribute(this.attribute, this.value); }
}

function rewrite(upstream, name) {
  if (!(upstream.headers.get('content-type') || '').includes('text/html')) return upstream;
  const canonical = `https://meoarch.org/${name}/`;
  let rewriter = new HTMLRewriter()
    .on('link[rel="canonical"]', new Absolute('href', canonical))
    .on('meta[property="og:url"]', new Absolute('content', canonical));
  if (name === 'ai') {  // this page uses root-absolute URLs ("/assets/...", "/zh"); keep them inside /ai
    for (const [selector, attribute] of [['a', 'href'], ['link', 'href'], ['img', 'src'], ['script', 'src'], ['source', 'src']]) {
      rewriter = rewriter.on(selector, new Prefix(attribute, '/ai'));
    }
  }
  return rewriter.transform(upstream);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/health/meo-version.json') {
      const build = typeof MEO_BUILD === 'undefined' ? { commit: null } : MEO_BUILD;  // injected by scripts/deploy_paths.mjs
      return new Response(JSON.stringify({ product: 'meoarch-paths', ...build }), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'access-control-allow-origin': '*' } });
    }
    if (/^\/health(\/|$)/.test(url.pathname)) return health(request, env);
    const match = url.pathname.match(/^\/(os|ai)(\/.*)?$/);
    if (!match) return errorResponse('404', request);
    const [, name, rest] = match;
    if (!rest) return Response.redirect(`${url.origin}/${name}/${url.search}`, 308);  // relative URLs need the slash
    if (request.method !== 'GET' && request.method !== 'HEAD') return errorResponse('405', request);
    const init = { method: request.method, headers: forwarded(request) };
    let upstream;
    try {
      upstream = name === 'os'
        ? await fetch(new Request(OS_ORIGIN + rest + url.search, init))
        : await env.AI_LANDING.fetch(new Request(AI_ORIGIN + rest + url.search, init));
    } catch {
      return errorResponse('502', request);
    }
    // Upstream errors become the shared MeoArch error page for browsers.
    if (upstream.status >= 400 && wantsHtml(request)) {
      const kind = [404, 405, 410, 429, 500, 502, 503, 504].includes(upstream.status) ? String(upstream.status) : upstream.status >= 500 ? '502' : '404';
      return errorResponse(kind, request);
    }
    return rewrite(upstream, name);
  },
};
