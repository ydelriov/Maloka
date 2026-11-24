// Noticias (entradas del blog): slug de la página de cada noticia, igual al de maloka.org (/noticias/<slug>/).
import n from '../data/n/noticias.json';
export const noticias = n;
export const slugNoticia = (it) => it.url.replace(/\/$/, '').split('/').pop();
export const categoria = (it) => n.categorias.find((c) => c.id === it.categoria);
export const fechaLarga = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
