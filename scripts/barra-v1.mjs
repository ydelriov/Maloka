// Inserta (o actualiza) la barra de versiones en las páginas HTML estáticas de V1 (public/v1/*.html),
// con la misma lista de src/data/variantes.json. Uso: node scripts/barra-v1.mjs
import { readFile, writeFile, readdir } from 'node:fs/promises';

const BASE = '/Maloka/';
const { items } = JSON.parse(await readFile('src/data/variantes.json', 'utf8'));
const links = [`<a href="${BASE}">Índice</a>`, ...items.map((v) => `<a href="${BASE}${v.ruta}"${v.id === 'v1' ? ' aria-current="page"' : ''}>${v.etiqueta}</a>`)].join('');
const bloque = `<!-- barra-versiones -->
<nav class="mk-vs" aria-label="Versiones del home">${links}</nav>
<style>
.mk-vs{position:fixed;left:16px;bottom:16px;z-index:9999;display:flex;gap:4px;padding:4px;border-radius:999px;background:#1F1428;box-shadow:0 4px 12px rgba(31,14,44,.08),0 20px 36px -14px rgba(31,14,44,.18);font:700 13px/1 Montserrat,Arial,sans-serif;max-width:calc(100vw - 32px);overflow-x:auto;scrollbar-width:none}
.mk-vs a{display:inline-grid;place-items:center;flex:none;min-width:44px;height:36px;padding:0 12px;border-radius:999px;color:#fff;text-decoration:none}
.mk-vs a:hover{background:#3D3447}
.mk-vs a[aria-current="page"]{background:#fff;color:#1F1428}
.mk-vs a:focus-visible{outline:3px solid #fff;outline-offset:2px}
@media (max-width:767px){.mk-vs{left:50%;transform:translateX(-50%);bottom:12px}}
</style>
<!-- /barra-versiones -->`;

for (const f of (await readdir('public/v1')).filter((n) => n.endsWith('.html'))) {
  const p = `public/v1/${f}`;
  let html = await readFile(p, 'utf8');
  html = html.replace(/<!-- barra-versiones -->[\s\S]*?<!-- \/barra-versiones -->\n?/, '');
  html = html.replace('</body>', `${bloque}\n</body>`);
  await writeFile(p, html);
  console.log('barra →', p);
}
