// Capturas de cada variante en 390, 834 y 1440 px → screenshots/, y miniaturas del índice → public/miniaturas/.
// Uso: con el sitio corriendo (npm run dev o npm run preview), ejecuta `npm run screenshots`.
// Cambia la URL con BASE_URL=http://localhost:4321/Maloka/ si usas otro puerto.
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';

const BASE = process.env.BASE_URL || 'http://localhost:4321/Maloka/';
const { items } = JSON.parse(await readFile('src/data/variantes.json', 'utf8'));
const variantes = items.map((v) => [v.id, v.ruta]);
const anchos = [390, 834, 1440];

await mkdir('screenshots', { recursive: true });
await mkdir('public/miniaturas', { recursive: true });
const browser = await chromium.launch();

for (const [v, ruta] of variantes) {
  for (const w of anchos) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const errores = [];
    page.on('pageerror', (e) => errores.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
    await page.goto(`${BASE}${ruta}`, { waitUntil: 'networkidle' });
    // Recorre la página para que carguen las imágenes diferidas
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `screenshots/${v}-${w}.png`, fullPage: true });
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`${v} @ ${w}px → screenshots/${v}-${w}.png${ancho > w ? `  ⚠ scroll horizontal (${ancho}px)` : ''}${errores.length ? `  ⚠ ${errores.join(' | ')}` : ''}`);
    await page.close();
  }
  const thumb = await browser.newPage({ viewport: { width: 1440, height: 1800 }, deviceScaleFactor: 0.5, reducedMotion: 'reduce' });
  await thumb.goto(`${BASE}${ruta}`, { waitUntil: 'networkidle' });
  await thumb.addStyleTag({ content: '.vs,.pb{display:none!important}' }); // la barra del prototipo no va en la miniatura
  await thumb.screenshot({ path: `public/miniaturas/${v}.jpg`, type: 'jpeg', quality: 80 });
  await thumb.close();
}
await browser.close();
