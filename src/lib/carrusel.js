// Carrusel horizontal con scroll-snap (móvil). Botones opcionales [data-car-prev]/[data-car-next] en la misma sección.
export function iniciarCarruseles() {
  document.querySelectorAll('[data-carrusel]').forEach((track) => {
    if (track.dataset.listo) return;
    track.dataset.listo = '1';
    const sec = track.closest('section');
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sec?.querySelector('[data-car-prev]')?.addEventListener('click', () => track.scrollBy({ left: -paso(), behavior: reduce ? 'auto' : 'smooth' }));
    sec?.querySelector('[data-car-next]')?.addEventListener('click', () => track.scrollBy({ left: paso(), behavior: reduce ? 'auto' : 'smooth' }));
  });
}
