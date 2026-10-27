// Prefija rutas internas con la base del sitio (GitHub Pages publica en /Maloka/).
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
