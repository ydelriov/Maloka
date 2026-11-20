// Pone padding 0 en todos los contenedores de las plantillas de Elementor que no tienen padding propio.
// Sin esto, Elementor les aplica el «Container Padding» de Ajustes del sitio (10 px por defecto).
// Uso: node scripts/elementor-padding.mjs            (todas las plantillas de elementor/)
//      node scripts/elementor-padding.mjs archivo.json
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CERO = { unit: 'px', top: '0', right: '0', bottom: '0', left: '0', isLinked: true };

const archivos = process.argv.length > 2
  ? process.argv.slice(2)
  : readdirSync('elementor').filter((f) => f.endsWith('.json')).map((f) => join('elementor', f));

for (const archivo of archivos) {
  const texto = readFileSync(archivo, 'utf8');
  const sangria = (texto.match(/\n( +)"/) || [, '  '])[1];
  const plantilla = JSON.parse(texto);
  let total = 0;
  let cambiados = 0;

  const recorrer = (elementos = []) => {
    for (const el of elementos) {
      if (el.elType === 'container') {
        total++;
        el.settings ??= {};
        if (!('padding' in el.settings)) {
          el.settings.padding = { ...CERO };
          cambiados++;
        }
      }
      recorrer(el.elements);
    }
  };
  recorrer(plantilla.content);

  writeFileSync(archivo, JSON.stringify(plantilla, null, sangria) + '\n');
  console.log(`${archivo}: ${cambiados} de ${total} contenedores quedaron con padding 0`);
}
