// Filtros y pestañas sin dependencias: [data-filtros] contiene botones [data-filtro="id"] (aria-pressed)
// y los elementos filtrables [data-grupos="id id"]. "todo" muestra todo. Anuncia el resultado en [data-filtros-estado].
export function iniciarFiltros() {
  document.querySelectorAll('[data-filtros]').forEach((root) => {
    if (root.dataset.listo) return;
    root.dataset.listo = '1';
    const botones = [...root.querySelectorAll('[data-filtro]')];
    const items = [...root.querySelectorAll('[data-grupos]')];
    const vacio = root.querySelector('[data-filtros-vacio]');
    const estado = root.querySelector('[data-filtros-estado]');
    const aplicar = (id) => {
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtro === id)));
      let n = 0;
      items.forEach((it) => {
        const ok = id === 'todo' || it.dataset.grupos.split(' ').includes(id);
        it.hidden = !ok;
        if (ok) n++;
      });
      if (vacio) vacio.hidden = n > 0;
      if (estado) estado.textContent = n ? `${n} ${n === 1 ? 'resultado' : 'resultados'}` : 'Sin resultados';
    };
    botones.forEach((b) => b.addEventListener('click', () => aplicar(b.dataset.filtro)));
    const inicial = botones.find((b) => b.getAttribute('aria-pressed') === 'true');
    if (inicial) aplicar(inicial.dataset.filtro);
  });
}
