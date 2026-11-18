// Builds the shared MeoArch error pages from errors/meo-error-page.src.mjs.
//   node scripts/build_errors.mjs
// Writes errors/meo-error-page.mjs (logo inlined), errors/<kind>.html and 404.html for this Pages site,
// and copies the module (plus 404.html) into sibling repositories that are checked out next to this one.
import { readFile, writeFile, copyFile, access, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const projects = join(root, '..');
const logo = (await readFile(join(root, 'assets/img/meoarch-logo.svg'), 'utf8'))
  .trim().replace(/\n\s*/g, '').replace(/<svg[^>]*?viewBox="([^"]+)"[^>]*>/, '<svg width="58" height="27" viewBox="$1" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">');
const src = await readFile(join(root, 'errors/meo-error-page.src.mjs'), 'utf8');
const out = src.replace("'__LOGO_SVG__'", JSON.stringify(logo));
const module = join(root, 'errors/meo-error-page.mjs');
await writeFile(module, out);

const { renderErrorPage, errorKinds } = await import(pathToFileURL(module).href + `?t=${Date.now()}`);
for (const kind of errorKinds) await writeFile(join(root, `errors/${kind}.html`), renderErrorPage(kind, { lang: 'auto' }));
await writeFile(join(root, '404.html'), renderErrorPage('404', { lang: 'auto' }));

const exists = (p) => access(p).then(() => true, () => false);
const copies = [
  ['workers/paths/src/meo-error-page.mjs', join(root, 'workers/paths/src/meo-error-page.mjs')],
  ['meo-ai-landing', join(projects, 'meo-ai-landing/src/meo-error-page.mjs')],
  ['meo-api', join(projects, 'meo-api/src/meo-error-page.mjs')],
];
for (const [label, target] of copies) {
  if (!(await exists(dirname(target)))) { console.log(`skip ${label} (not checked out)`); continue; }
  await copyFile(module, target);
  console.log(`copied -> ${label}`);
}
const os = join(projects, 'MeoArch-os-webside');
if (await exists(os)) {
  await writeFile(join(os, '404.html'), renderErrorPage('404', { lang: 'auto', product: 'MeoArch OS', home: 'https://os.meoarch.org/' }));
  console.log('wrote -> MeoArch-os-webside/404.html');
}
console.log(`built ${errorKinds.length} error pages`);
