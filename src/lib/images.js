// Resuelve el nombre de archivo de los JSON a la imagen importada (Astro la optimiza en el build).
const files = import.meta.glob('../assets/img/*.{jpg,jpeg,png}', { eager: true, import: 'default' });

export function img(name) {
  const key = Object.keys(files).find((p) => p.endsWith('/' + name));
  if (!key) throw new Error(`Imagen no encontrada en src/assets/img: ${name}`);
  return files[key];
}
