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
    const match = url.pathname.match(/^\/(os|ai)(\/.*)?$/);
    if (!match) return new Response('Not found', { status: 404 });
    const [, name, rest] = match;
    if (!rest) return Response.redirect(`${url.origin}/${name}/${url.search}`, 308);  // relative URLs need the slash
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    const init = { method: request.method, headers: forwarded(request) };
    const upstream = name === 'os'
      ? await fetch(new Request(OS_ORIGIN + rest + url.search, init))
      : await env.AI_LANDING.fetch(new Request(AI_ORIGIN + rest + url.search, init));
    return rewrite(upstream, name);
  },
};
