/* Maloka · Agéndate
   - MalokaAgenda.ui: piezas de interfaz compartidas (card, destacada, estados).
   - Controlador de la página Agéndate (#agenda-app): navegación temporal, filtros, búsqueda,
     date picker, agrupación por momento/fecha y estados vacíos. El estado vive en la URL.
   - Controlador de la ficha (#actividad-app): landing independiente de cada actividad. */
(() => {
  const A = window.MalokaAgenda;
  const { EVENTS, LABELS, EXPERIENCIAS, F, cap, clean, key, today, sat, sun, DAY } = A;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const I = (id, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

  const TYPE = {
    taller: { icon: 'flask', bg: '#E6F6F2', ink: '#0A7A66' },
    cine: { icon: 'film', bg: 'var(--blue-50)', ink: '#0F5DC7' },
    experiencia: { icon: 'spark', bg: 'var(--purple-50)', ink: 'var(--purple-ink)' },
    conversatorio: { icon: 'mic', bg: 'var(--g50)', ink: 'var(--navy)' },
    especial: { icon: 'star', bg: 'var(--coral-50)', ink: 'var(--coral-ink)' },
    familiar: { icon: 'family', bg: 'var(--y-soft)', ink: 'var(--y-ink)' }
  };
  const MOMENTO = {
    manana: { t: 'Mañana', icon: 'sun', sub: 'Antes del mediodía' },
    tarde: { t: 'Tarde', icon: 'sunset', sub: 'De 12:00 m. a 6:00 p. m.' },
    noche: { t: 'Noche', icon: 'moon', sub: 'Desde las 6:00 p. m.' }
  };

  /* ---------- Piezas compartidas ---------- */
  const dateBits = d => ({ sem: clean(F.sem.format(d)).toUpperCase(), dia: F.dia.format(d), mes: clean(F.mes.format(d)).toUpperCase() });
  const isToday = d => key(d) === key(today);
  const publico = e => e.publico.map(p => LABELS.publico[p]).join(' · ') + (e.edad ? ` · ${e.edad}` : '');
  const typeChip = e => { const t = TYPE[e.tipo]; return `<span class="type" style="--type-bg:${t.bg};--type-ink:${t.ink}">${I(t.icon)}${LABELS.tipo[e.tipo]}</span>`; };

  const avail = (e, cls = '') => ({
    disponible: `<span class="state state--ok ${cls}">${I('check-circle')}Cupos disponibles</span>`,
    ultimos: `<span class="state state--last ${cls}">${I('alert')}Últimos cupos</span>`,
    agotado: `<span class="state state--out ${cls}">${I('x-circle')}Agotado</span>`
  })[e.cupo] || '';
  const price = e => ({
    incluido: `<span class="state state--incl">${I('ticket')}Incluido con tu entrada</span>`,
    gratis: `<span class="state state--free">${I('gift')}Gratuito</span>`,
    costo: `<span class="state state--cost">${I('tag')}${e.valor} · costo adicional</span>`
  })[e.precio];
  const req = e => ({
    inscripcion: `<span class="state state--req">${I('pen')}Requiere inscripción</span>`,
    compra: e.precio === 'incluido' ? '' : `<span class="state state--buy">${I('ticket')}Requiere compra</span>`
  })[e.req] || '';
  /* Acción principal según el tipo de acceso */
  function action(e) {
    const href = `actividad.html?id=${e.id}`;
    if (e.cupo === 'agotado') return null;
    if (e.req === 'inscripcion') return { label: 'Inscríbete', href: `${href}#inscripcion`, cls: 'btn--navy', icon: 'pen' };
    if (e.req === 'compra') return { label: 'Compra entradas', href: 'index.html#entradas', cls: 'btn--buy', icon: 'ticket' };
    return null;
  }
  const actionBtn = (e, extra = '') => { const a = action(e); return a ? `<a class="btn ${a.cls} ${extra}" href="${a.href}">${I(a.icon, a.icon === 'ticket' ? 'ticket' : '')}${a.label}</a>` : ''; };

  function cardHTML(e, { lazyNote = true } = {}) {
    const d = dateBits(e.fecha);
    const sold = e.cupo === 'agotado';
    const a = action(e);
    return `<article class="ev-card${sold ? ' is-soldout' : ''}">
      <div class="ev-media">
        <div class="ph ${e.tone}" role="img" aria-label="${esc(e.foto)}"><div class="ph-img"></div>${lazyNote ? `<span class="ph-note">${I('camera')}<span>${esc(e.foto)}</span></span>` : ''}</div>
        ${avail(e, 'avail')}
      </div>
      <div class="ev-body">
        <p class="ev-when"><time class="ev-date" datetime="${e.dia}"><b>${isToday(e.fecha) ? 'HOY' : d.sem}</b><span>${d.dia}</span></time><time class="ev-time" datetime="${e.dia}T${e.hora}">${e.hora12}</time><span class="ev-dur">${e.dur} min</span></p>
        <h3 class="ev-name"><a href="actividad.html?id=${e.id}">${esc(e.titulo)}</a></h3>
        ${typeChip(e)}
        <ul class="ev-meta2">
          <li>${I('users')}<span><span class="sr-only">Público: </span>${publico(e)}</span></li>
          <li>${I('pin')}<span><span class="sr-only">Lugar: </span>${e.sitio}</span></li>
        </ul>
        <div class="ev-tags">${price(e)}${req(e)}</div>
        <div class="ev-foot"><span class="link-arrow" aria-hidden="true"><span>Ver actividad</span>${I('arrow')}</span>${a && a.label === 'Inscríbete' ? `<a class="btn btn--navy" href="${a.href}" aria-label="Inscríbete: ${esc(e.titulo)}">${I('pen')}Inscríbete</a>` : ''}</div>
      </div>
    </article>`;
  }

  function featHTML(e) {
    const d = dateBits(e.fecha);
    return `<article class="feat on-dark" aria-labelledby="feat-${e.id}">
      <div class="feat-media">
        <div class="ph ${e.tone}" role="img" aria-label="${esc(e.foto)}"><div class="ph-img"></div><span class="ph-note">${I('camera')}<span><b>Fotografía amplia:</b> ${esc(e.foto)}</span></span></div>
        <span class="feat-flag">${I('star')}Destacada</span>
      </div>
      <div class="feat-body">
        <div class="feat-when">
          <time class="feat-date" datetime="${e.dia}"><b>${isToday(e.fecha) ? 'HOY' : d.sem}</b><span>${d.dia}</span><small>${d.mes}</small></time>
          <div class="feat-time"><strong><time datetime="${e.dia}T${e.hora}">${e.hora12}</time></strong><span>${e.dur} minutos</span></div>
        </div>
        ${typeChip(e)}
        <h3 id="feat-${e.id}"><a href="actividad.html?id=${e.id}">${esc(e.titulo)}</a></h3>
        <p class="sum">${esc(e.resumen)}</p>
        <ul class="feat-meta">
          <li>${I('users')}<span><span class="sr-only">Público: </span>${publico(e)}</span></li>
          <li>${I('pin')}<span><span class="sr-only">Lugar: </span>${e.sitio}</span></li>
        </ul>
        <div class="tags">${price(e)}${avail(e)}${req(e)}</div>
        <div class="feat-actions">
          <a class="btn btn--ghost" href="actividad.html?id=${e.id}">Ver actividad${I('arrow')}</a>
          ${actionBtn(e)}
        </div>
      </div>
    </article>`;
  }

  A.ui = { cardHTML, featHTML, avail, price, req, typeChip, publico, action, I, dateBits };

  /* ==================================================================
     PÁGINA AGÉNDATE
     ================================================================== */
  const app = $('#agenda-app');
  if (app) initAgenda();

  function initAgenda() {
    const P = new URLSearchParams(location.search);
    const GROUPS = ['publico', 'tipo', 'lugar', 'precio'];
    const S = {
      range: P.get('f') || 'hoy',
      fecha: P.get('fecha') || null,
      q: P.get('q') || '',
      sel: Object.fromEntries(GROUPS.map(g => [g, new Set((P.get(g) || '').split(',').filter(Boolean))]))
    };
    // Demo de estado vacío: la primera fecha futura sin actividades.
    if (S.range === 'vacio') {
      for (let i = 1; i < 40; i++) { const d = key(new Date(+today + i * DAY)); if (!EVENTS.some(e => e.dia === d)) { S.range = 'fecha'; S.fecha = d; break; } }
    }
    const tomorrow = new Date(+today + DAY);
    const weekendStart = sat < today ? today : sat;
    const parse = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

    const inRange = (e, r = S.range) => {
      if (e.fecha < today) return false;
      if (r === 'hoy') return e.dia === key(today);
      if (r === 'manana') return e.dia === key(tomorrow);
      if (r === 'finde') return e.fecha >= weekendStart && e.fecha <= sun;
      if (r === 'prox') return e.fecha > sun;
      if (r === 'fecha') return e.dia === S.fecha;
      return true; // 'todas'
    };
    const matches = (e, skip) => GROUPS.every(g => {
      if (g === skip || !S.sel[g].size) return true;
      if (g === 'publico') return e.publico.some(p => S.sel.publico.has(p)) || e.publico.includes('todos');
      return S.sel[g].has(e[g]);
    });
    const qMatch = e => !S.q || norm(`${e.titulo} ${e.resumen} ${e.sitio} ${LABELS.tipo[e.tipo]}`).includes(norm(S.q));
    const filtersOn = () => GROUPS.some(g => S.sel[g].size) || !!S.q;

    /* ---------- Hero: fecha de hoy y próxima actividad ---------- */
    $('#today-wd').textContent = F.semLarga.format(today);
    $('#today-dn').textContent = F.dia.format(today);
    $('#today-mo').textContent = 'de ' + new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(today);
    $('#today-label').textContent = cap(F.larga.format(today));
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const todayEv = EVENTS.filter(e => e.dia === key(today));
    const next = todayEv.find(e => e.minutos >= nowMin - 10 && e.cupo !== 'agotado') || EVENTS.find(e => e.fecha > today && e.cupo !== 'agotado');
    if (next) {
      const nc = $('#next-card');
      nc.href = `actividad.html?id=${next.id}`;
      const mins = next.minutos - nowMin;
      $('#next-k').textContent = isToday(next.fecha) ? (mins > 0 && mins <= 120 ? `Empieza en ${mins} min` : 'Próxima actividad') : `Próxima · ${clean(F.corta.format(next.fecha))}`;
      $('#next-t').textContent = next.hora12;
      $('#next-n').textContent = next.titulo;
      $('#next-m').textContent = `${next.sitio} · ${LABELS.tipo[next.tipo]}`;
    }
    $('#today-count').innerHTML = `<b>${plural(todayEv.length, 'actividad', 'actividades')}</b> hoy en Maloka`;

    /* ---------- Tabs temporales ---------- */
    const short = d => clean(F.corta.format(d));
    $('#tab-hoy small').textContent = short(today);
    $('#tab-manana small').textContent = short(tomorrow);
    $('#tab-finde small').textContent = `${short(weekendStart)}${+weekendStart !== +sun ? ' – ' + clean(F.sem.format(sun)) + ' ' + F.dia.format(sun) : ''}`;
    $('#tab-prox small').textContent = `Desde el ${short(new Date(+sun + DAY))}`;
    const tabs = $$('.ag-tab');

    /* ---------- Filtros: popovers (desktop) y hoja (móvil) ---------- */
    const optHTML = (g, k, name) => `<label class="opt"><input type="checkbox" name="${g}" value="${k}"><span>${name}</span><span class="n" data-n="${g}:${k}"></span></label>`;
    GROUPS.forEach(g => {
      $(`#pop-${g} .opts`).innerHTML = Object.entries(LABELS[g]).map(([k, n]) => optHTML(g, k, n)).join('');
      $(`#sheet-${g}`).innerHTML = Object.entries(LABELS[g]).map(([k, n]) => `<label class="tog"><input type="checkbox" name="${g}" value="${k}"><span>${I('check')}${n}</span></label>`).join('');
    });
    const syncInputs = () => $$('input[type=checkbox][name]').forEach(i => { if (S.sel[i.name]) i.checked = S.sel[i.name].has(i.value); });
    document.addEventListener('change', ev => {
      const i = ev.target;
      if (!i.matches('input[type=checkbox][name]') || !S.sel[i.name]) return;
      i.checked ? S.sel[i.name].add(i.value) : S.sel[i.name].delete(i.value);
      syncInputs(); render();
    });

    const fltBtns = $$('.flt[aria-controls]');
    let openPop = null;
    function closePop(focus) {
      if (!openPop) return;
      const b = $(`[aria-controls="${openPop.id}"]`);
      openPop.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false');
      if (focus) b.focus();
      openPop = null;
    }
    fltBtns.forEach(b => b.addEventListener('click', () => {
      const pop = $('#' + b.getAttribute('aria-controls'));
      if (openPop === pop) return closePop();
      closePop(); closeDP();
      pop.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); openPop = pop;
      $('input', pop)?.focus();
    }));
    document.addEventListener('pointerdown', ev => { if (openPop && !ev.target.closest('.flt-wrap')) closePop(); });
    document.addEventListener('focusin', ev => { if (openPop && !ev.target.closest('.flt-wrap')) closePop(); });

    $('#ag-active').addEventListener('click', ev => {
      const x = ev.target.closest('.chip-x');
      if (x) { S.sel[x.dataset.g].delete(x.dataset.v); syncInputs(); render(); $('#ag-results-title').focus(); }
    });
    const clearAll = () => { GROUPS.forEach(g => S.sel[g].clear()); S.q = ''; $('#ag-q').value = ''; syncInputs(); render(); };
    $$('[data-clear]').forEach(b => b.addEventListener('click', clearAll));

    // Hoja móvil
    const sheet = $('#flt-sheet');
    $('#flt-open').addEventListener('click', () => { syncInputs(); sheet.showModal(); });
    $('#sheet-close').addEventListener('click', () => sheet.close());
    $('#sheet-apply').addEventListener('click', () => { sheet.close(); $('#ag-results-title').focus(); });
    sheet.addEventListener('click', ev => { if (ev.target === sheet) sheet.close(); });

    // Búsqueda
    const q = $('#ag-q'); q.value = S.q;
    let qt; q.addEventListener('input', () => { clearTimeout(qt); qt = setTimeout(() => { S.q = q.value.trim(); render(); }, 180); });
    $('#ag-search').addEventListener('submit', ev => { ev.preventDefault(); S.q = q.value.trim(); render(); $('#ag-results-title').focus(); });

    /* ---------- Date picker accesible ---------- */
    const dp = $('#dp'), dpBtn = $('#tab-fecha');
    const dpGrid = $('#dp-grid tbody'), dpTitle = $('#dp-title');
    const maxDate = new Date(+today + 90 * DAY);
    let view = new Date(today.getFullYear(), today.getMonth(), 1), focusDay = today;
    const counts = EVENTS.reduce((m, e) => (m[e.dia] = (m[e.dia] || 0) + 1, m), {});
    function drawDP() {
      dpTitle.textContent = cap(F.mesAnio.format(view));
      $('#dp-prev').disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      $('#dp-next').disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > maxDate;
      const first = (view.getDay() + 6) % 7; // semana empieza el lunes
      const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      let html = '<tr>', col = 0;
      for (let i = 0; i < first; i++, col++) html += '<td></td>';
      for (let d = 1; d <= days; d++, col++) {
        if (col && col % 7 === 0) html += '</tr><tr>';
        const date = new Date(view.getFullYear(), view.getMonth(), d), k = key(date), n = counts[k] || 0;
        const off = date < today || date > maxDate;
        const sel = S.range === 'fecha' && S.fecha === k;
        const label = `${cap(F.larga.format(date))}${isToday(date) ? ', hoy' : ''}, ${n ? plural(n, 'actividad', 'actividades') : 'sin actividades'}`;
        html += `<td><button type="button" class="dp-day${n ? ' has-ev' : ''}${isToday(date) ? ' is-today' : ''}" data-k="${k}" tabindex="${key(focusDay) === k ? 0 : -1}" aria-pressed="${sel}" aria-label="${label}"${off ? ' disabled' : ''}>${d}</button></td>`;
      }
      while (col % 7) { html += '<td></td>'; col++; }
      dpGrid.innerHTML = html + '</tr>';
    }
    function openDP() {
      closePop();
      focusDay = S.fecha ? parse(S.fecha) : today;
      view = new Date(focusDay.getFullYear(), focusDay.getMonth(), 1);
      drawDP();
      const r = dpBtn.getBoundingClientRect(), host = dp.parentElement.getBoundingClientRect();
      dp.style.left = Math.max(0, Math.min(r.left - host.left, host.width - 340)) + 'px';
      dp.style.top = (r.bottom - host.top + 8) + 'px';
      dp.hidden = false; requestAnimationFrame(() => dp.classList.add('is-open'));
      dpBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => $(`.dp-day[data-k="${key(focusDay)}"]`)?.focus(), reduce.matches ? 0 : 30);
    }
    function closeDP(focus) {
      if (dp.hidden) return;
      dp.classList.remove('is-open'); dpBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { dp.hidden = true; }, reduce.matches ? 0 : 220);
      if (focus) dpBtn.focus();
    }
    function moveFocus(d) {
      if (d < today || d > maxDate) return;
      focusDay = d;
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) { view = new Date(d.getFullYear(), d.getMonth(), 1); drawDP(); }
      else $$('.dp-day', dp).forEach(b => b.tabIndex = b.dataset.k === key(d) ? 0 : -1);
      $(`.dp-day[data-k="${key(d)}"]`)?.focus();
    }
    function pickDate(k) {
      S.range = 'fecha'; S.fecha = k;
      $('#tab-fecha b').textContent = cap(clean(F.corta.format(parse(k))));
      $('#tab-fecha small').textContent = 'Cambiar fecha';
      closeDP(true); render();
    }
    dpGrid.addEventListener('click', ev => { const b = ev.target.closest('.dp-day'); if (b && !b.disabled) pickDate(b.dataset.k); });
    dpGrid.addEventListener('keydown', ev => {
      const b = ev.target.closest('.dp-day'); if (!b) return;
      const d = parse(b.dataset.k);
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[ev.key];
      if (step) { ev.preventDefault(); moveFocus(new Date(+d + step * DAY)); }
      else if (ev.key === 'Home') { ev.preventDefault(); moveFocus(new Date(+d - ((d.getDay() + 6) % 7) * DAY)); }
      else if (ev.key === 'End') { ev.preventDefault(); moveFocus(new Date(+d + (6 - (d.getDay() + 6) % 7) * DAY)); }
      else if (ev.key === 'PageUp' || ev.key === 'PageDown') { ev.preventDefault(); const m = ev.key === 'PageUp' ? -1 : 1; moveFocus(new Date(d.getFullYear(), d.getMonth() + m, Math.min(d.getDate(), 28))); }
    });
    $('#dp-prev').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); drawDP(); });
    $('#dp-next').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); drawDP(); });
    $('#dp-today').addEventListener('click', () => { closeDP(true); setRange('hoy'); });
    $('#dp-close').addEventListener('click', () => closeDP(true));
    dp.addEventListener('keydown', ev => { if (ev.key === 'Escape') { ev.stopPropagation(); closeDP(true); } });
    document.addEventListener('pointerdown', ev => { if (!dp.hidden && !dp.contains(ev.target) && ev.target !== dpBtn && !dpBtn.contains(ev.target)) closeDP(); });
    document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && openPop) closePop(true); });

    /* ---------- Tabs: comportamiento ---------- */
    function setRange(r) { S.range = r; if (r !== 'fecha') { S.fecha = null; $('#tab-fecha b').textContent = 'Elegir fecha'; $('#tab-fecha small').textContent = 'Calendario'; } render(); }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => t.dataset.range === 'fecha' ? (dp.hidden ? openDP() : closeDP()) : setRange(t.dataset.range));
      t.addEventListener('keydown', ev => {
        const dir = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        ev.preventDefault();
        const n = tabs[(i + dir + tabs.length) % tabs.length];
        n.focus(); if (n.dataset.range !== 'fecha') setRange(n.dataset.range);
      });
    });
    if (S.range === 'fecha' && S.fecha) { $('#tab-fecha b').textContent = cap(clean(F.corta.format(parse(S.fecha)))); $('#tab-fecha small').textContent = 'Cambiar fecha'; }

    /* ---------- Render ---------- */
    const RANGE_TITLE = {
      hoy: () => 'Encuentra algo para hacer hoy',
      manana: () => 'Mañana en Maloka',
      finde: () => 'Este fin de semana la ciencia se mueve',
      prox: () => 'Hay más por descubrir',
      fecha: () => cap(F.larga.format(parse(S.fecha))),
      todas: () => 'Toda la agenda'
    };
    const RANGE_SUB = {
      hoy: () => cap(F.larga.format(today)), manana: () => cap(F.larga.format(tomorrow)),
      finde: () => `${cap(F.larga.format(weekendStart))} al ${F.larga.format(sun)}`,
      prox: () => 'Las próximas semanas', fecha: () => 'Fecha elegida', todas: () => 'Desde hoy'
    };

    function groupHTML(head, list) {
      return `<section class="ag-group" aria-label="${esc(head.label)}">
        <div class="ag-group-h">${head.badge}<div><h3>${head.title}</h3><p>${head.sub}</p></div><span class="line" aria-hidden="true"></span></div>
        <div class="ev-grid2">${list.map(e => cardHTML(e)).join('')}</div>
      </section>`;
    }

    function render() {
      const inR = EVENTS.filter(e => inRange(e));
      const res = inR.filter(e => matches(e) && qMatch(e));

      // Tabs
      tabs.forEach(t => {
        const on = t.dataset.range === S.range;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on || (S.range === 'todas' && t.dataset.range === 'hoy') ? 0 : -1;
        const c = $('.cnt', t);
        if (c) { const n = EVENTS.filter(e => inRange(e, t.dataset.range) && matches(e) && qMatch(e)).length; c.textContent = n; c.hidden = !n; c.setAttribute('aria-label', plural(n, 'actividad', 'actividades')); }
      });
      // Conteos por opción (en el rango actual, considerando los demás filtros)
      GROUPS.forEach(g => {
        Object.keys(LABELS[g]).forEach(k => {
          const n = inR.filter(e => matches(e, g) && qMatch(e) && (g === 'publico' ? e.publico.includes(k) : e[g] === k)).length;
          $$(`[data-n="${g}:${k}"]`).forEach(x => { x.textContent = n; x.closest('.opt').classList.toggle('is-zero', !n); });
        });
        const n = S.sel[g].size, b = $(`[aria-controls="pop-${g}"]`);
        b.classList.toggle('has-value', !!n);
        $('.badge', b).textContent = n; $('.badge', b).hidden = !n;
        b.setAttribute('aria-label', `${$('.lbl', b).textContent}${n ? `, ${plural(n, 'filtro activo', 'filtros activos')}` : ''}`);
      });
      const total = GROUPS.reduce((s, g) => s + S.sel[g].size, 0);
      $('#flt-open .badge').textContent = total; $('#flt-open .badge').hidden = !total;
      $('#sheet-apply').textContent = `Ver ${plural(res.length, 'actividad', 'actividades')}`;

      // Chips activos
      const chips = GROUPS.flatMap(g => [...S.sel[g]].map(v => `<button type="button" class="chip-x" data-g="${g}" data-v="${v}" aria-label="Quitar filtro: ${LABELS[g][v]}">${LABELS[g][v]}${I('close')}</button>`));
      if (S.q) chips.push(`<span class="chip-x" style="cursor:default">“${esc(S.q)}”</span>`);
      $('#ag-active').hidden = !chips.length;
      $('#ag-active-list').innerHTML = chips.join('');

      // Encabezado de resultados
      $('#ag-results-title').textContent = RANGE_TITLE[S.range]();
      $('#ag-results-sub').innerHTML = `<b>${plural(res.length, 'actividad', 'actividades')}</b> · ${RANGE_SUB[S.range]()}${filtersOn() ? ' · con filtros' : ''}`;

      const out = $('#ag-list');
      if (!res.length) { out.innerHTML = emptyHTML(); bindEmpty(); }
      else {
        let list = res, html = '';
        if (res.length >= 4) {
          const f = res.find(e => e.destacado && e.cupo !== 'agotado') || res.find(e => e.cupo !== 'agotado');
          if (f) { html += featHTML(f); list = res.filter(e => e !== f); }
        }
        const single = ['hoy', 'manana', 'fecha'].includes(S.range);
        if (single) {
          ['manana', 'tarde', 'noche'].forEach(m => {
            const l = list.filter(e => e.momento === m); if (!l.length) return;
            const M = MOMENTO[m];
            html += groupHTML({ label: M.t, title: M.t, sub: `${M.sub} · ${plural(l.length, 'actividad', 'actividades')}`, badge: `<span class="gi">${I(M.icon)}</span>` }, l);
          });
        } else {
          [...new Set(list.map(e => e.dia))].forEach(d => {
            const l = list.filter(e => e.dia === d), b = dateBits(l[0].fecha);
            const t = isToday(l[0].fecha) ? 'Hoy' : cap(F.larga.format(l[0].fecha));
            html += groupHTML({ label: t, title: t, sub: plural(l.length, 'actividad', 'actividades'), badge: `<span class="gd" aria-hidden="true"><b>${b.sem}</b><span>${b.dia}</span></span>` }, l);
          });
        }
        out.innerHTML = html;
      }
      syncURL();
    }

    function emptyHTML() {
      const byFilters = filtersOn() && EVENTS.some(e => inRange(e));
      const elsewhere = S.q ? EVENTS.filter(e => e.fecha >= today && qMatch(e) && matches(e)).length : 0;
      const art = `<svg class="art" viewBox="0 0 160 160" aria-hidden="true"><g fill="none" stroke="#101C4C" stroke-width="2"><circle cx="80" cy="80" r="34"/><ellipse cx="80" cy="80" rx="70" ry="24" transform="rotate(-20 80 80)" stroke-dasharray="4 6"/></g><circle cx="146" cy="58" r="7" fill="#FFC928"/><circle cx="22" cy="104" r="4" fill="#146FE8"/><text x="80" y="92" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="34" fill="#101C4C">?</text></svg>`;
      if (byFilters) return `<div class="empty" role="status">${art}<div>
        <h2>No encontramos actividades con estos filtros.</h2>
        <p>Prueba quitando algún filtro, cambia de fecha o descubre las experiencias permanentes de Maloka.</p>
        <div class="acts"><button type="button" class="btn btn--navy" data-empty="clear">Limpiar filtros</button><a class="btn btn--outline" href="#experiencias-siempre">Explorar experiencias${I('arrow')}</a></div>
        ${elsewhere ? `<p class="hint">Encontramos ${plural(elsewhere, 'resultado', 'resultados')} en otras fechas. <button type="button" data-empty="todas">Buscar en toda la agenda</button></p>` : ''}
      </div></div>`;
      return `<div class="empty" role="status">${art}<div>
        <h2>No encontramos actividades para esta fecha.</h2>
        <p>Prueba otro día o descubre las experiencias permanentes de Maloka: Cine Domo, salas interactivas y laboratorios te esperan cada día que abrimos.</p>
        <div class="acts"><button type="button" class="btn btn--navy" data-empty="prox">Ver próximas actividades${I('arrow')}</button><a class="btn btn--outline" href="#experiencias-siempre">Explorar experiencias${I('arrow')}</a></div>
      </div></div>`;
    }
    function bindEmpty() {
      $$('[data-empty]').forEach(b => b.addEventListener('click', () => {
        const a = b.dataset.empty;
        if (a === 'clear') clearAll();
        if (a === 'prox') { clearAll(); setRange('prox'); }
        if (a === 'todas') setRange('todas');
        $('#ag-results-title').focus();
      }));
    }

    function syncURL() {
      const p = new URLSearchParams();
      if (S.range !== 'hoy') p.set('f', S.range);
      if (S.fecha) p.set('fecha', S.fecha);
      GROUPS.forEach(g => S.sel[g].size && p.set(g, [...S.sel[g]].join(',')));
      if (S.q) p.set('q', S.q);
      ['ir', 'abrir'].forEach(k => P.get(k) && p.set(k, P.get(k)));
      const qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }

    /* ---------- Experiencias permanentes conectadas a la agenda ---------- */
    $('#exp-row').innerHTML = Object.entries(EXPERIENCIAS).map(([k, x]) => {
      const n = EVENTS.filter(e => e.exp === k && e.fecha >= today).length;
      return `<a class="exp-mini" href="index.html#experiencias">
        <div class="ph ${x.tone}" role="img" aria-label="${x.nombre}"><div class="ph-img"></div></div>
        <span class="cnt">${plural(n, 'actividad', 'actividades')} en agenda</span>
        <h3>${x.nombre}</h3><p>${x.texto}</p>
        <span class="link-arrow"><span>${x.cta}</span>${I('arrow')}</span>
      </a>`;
    }).join('');

    /* ---------- Barra sticky: sombra al quedar fija ---------- */
    const bar = $('.ag-bar'), sentinel = $('#ag-sentinel');
    new IntersectionObserver(([en]) => bar.classList.toggle('is-stuck', !en.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(sentinel);
    $('#go-today').addEventListener('click', ev => { ev.preventDefault(); setRange('hoy'); $('#ag-results').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }); $('#ag-results-title').focus({ preventScroll: true }); });
    $('#go-finde').addEventListener('click', ev => { ev.preventDefault(); setRange('finde'); $('#ag-results').scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth' }); $('#ag-results-title').focus({ preventScroll: true }); });

    syncInputs(); render();

    /* ---------- Estados de demostración (agendate-estados.html) ---------- */
    const ir = P.get('ir'), abrir = P.get('abrir');
    if (ir) setTimeout(() => $('#' + ir)?.scrollIntoView({ behavior: 'instant' }), 60);
    if (abrir === 'fecha') setTimeout(openDP, 50);
    if (abrir === 'filtros') setTimeout(() => $('#flt-open').click(), 50);
    if (abrir && GROUPS.includes(abrir)) setTimeout(() => $(`[aria-controls="pop-${abrir}"]`).click(), 50);
  }

  /* ==================================================================
     FICHA DE ACTIVIDAD
     ================================================================== */
  const act = $('#actividad-app');
  if (act) initFicha();

  function initFicha() {
    const id = new URLSearchParams(location.search).get('id');
    const e = A.byId(id) || EVENTS.find(x => x.destacado && x.fecha >= today);
    const d = dateBits(e.fecha);
    const a = action(e);
    const url = location.href.split('#')[0];
    const sold = e.cupo === 'agotado';

    // SEO: título, descripción y datos estructurados (schema.org/Event) para tráfico directo
    document.title = `${e.titulo} · Agéndate · Maloka`;
    $('meta[name=description]').setAttribute('content', e.resumen);
    const ld = document.createElement('script'); ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Event', name: e.titulo, description: e.resumen,
      startDate: `${e.dia}T${e.hora}:00-05:00`, endDate: new Date(+e.fecha + (e.minutos + e.dur) * 6e4).toISOString(),
      eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      isAccessibleForFree: e.precio === 'gratis',
      location: { '@type': 'Place', name: `Maloka · ${e.sitio}`, address: { '@type': 'PostalAddress', streetAddress: 'Cra. 68D #24A-51', addressLocality: 'Bogotá', addressCountry: 'CO' } },
      organizer: { '@type': 'Organization', name: 'Maloka' },
      offers: { '@type': 'Offer', availability: sold ? 'https://schema.org/SoldOut' : e.cupo === 'ultimos' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock', url }
    });
    document.head.appendChild(ld);

    const priceTxt = { incluido: 'Incluido con tu entrada', gratis: 'Gratuito', costo: `${e.valor} (costo adicional)` }[e.precio];
    const availTxt = { disponible: 'Cupos disponibles', ultimos: 'Últimos cupos', agotado: 'Agotado' }[e.cupo] || 'Sin inscripción, hasta completar aforo';
    const ctaMain = sold
      ? `<span class="btn btn--lg" style="background:var(--g100);color:var(--g700);cursor:not-allowed" aria-disabled="true">${I('x-circle')}Agotado</span><a class="btn btn--outline" href="agendate.html">Ver próximas actividades${I('arrow')}</a>`
      : a ? `<a class="btn ${a.cls} btn--lg" href="${a.href}">${I(a.icon, a.icon === 'ticket' ? 'ticket' : '')}${a.label}</a>${e.req === 'compra' && e.precio === 'incluido' ? '' : ''}`
      : `<a class="btn btn--buy btn--lg" href="index.html#entradas">${I('ticket', 'ticket')}Compra entradas</a>`;
    const note = sold ? 'Esta actividad ya no tiene cupos. Mira otras fechas y actividades parecidas.'
      : e.req === 'inscripcion' ? 'La inscripción es gratuita y asegura tu cupo. Llega 15 minutos antes.'
      : e.req === 'compra' && e.precio === 'incluido' ? 'Incluida con tu entrada a Maloka: compra tu entrada y elige esta función.'
      : e.precio === 'gratis' ? 'Actividad gratuita y sin inscripción, hasta completar el aforo.'
      : 'Necesitas tu entrada a Maloka para participar.';

    act.innerHTML = `
    <nav class="crumbs wrap" aria-label="Ruta de navegación"><ol><li><a href="agendate.html">Agéndate</a></li><li><span aria-current="page">${esc(e.titulo)}</span></li></ol></nav>
    <div class="wrap act-top">
      <div class="act-main">
        ${typeChip(e)}
        <h1>${esc(e.titulo)}</h1>
        <p class="sum">${esc(e.resumen)}</p>
        <div class="act-tags">${avail(e)}${price(e)}${req(e)}</div>
        <div class="act-media">
          <div class="ph ${e.tone}" role="img" aria-label="${esc(e.foto)}"><div class="ph-img"></div><span class="ph-note">${I('camera')}<span><b>Foto o video corto:</b> ${esc(e.foto)}</span></span></div>
          <button class="play" type="button" aria-label="Reproducir video de ${esc(e.titulo)}"><i>${I('play')}</i>Mira el video</button>
        </div>
      </div>
      <aside class="book" id="reserva" aria-label="Datos y acceso a la actividad">
        <div class="book-when">
          <time class="feat-date" datetime="${e.dia}"><b>${isToday(e.fecha) ? 'HOY' : d.sem}</b><span>${d.dia}</span><small>${d.mes}</small></time>
          <div class="feat-time"><strong><time datetime="${e.dia}T${e.hora}">${e.hora12}</time></strong><span>${cap(F.larga.format(e.fecha))}</span></div>
        </div>
        <dl class="facts2">
          <div><dt>${I('calendar')}Fecha</dt><dd>${cap(clean(F.corta.format(e.fecha)))}</dd></div>
          <div><dt>${I('clock')}Hora</dt><dd>${e.hora12}</dd></div>
          <div><dt>${I('hourglass')}Duración</dt><dd>${e.dur} minutos</dd></div>
          <div><dt>${I('pin')}Lugar</dt><dd>${e.sitio}</dd></div>
          <div class="wide"><dt>${I('users')}Público</dt><dd>${publico(e)}</dd></div>
          <div><dt>${I('tag')}Precio</dt><dd>${priceTxt}</dd></div>
          <div><dt>${I(sold ? 'x-circle' : e.cupo === 'ultimos' ? 'alert' : 'check-circle')}Disponibilidad</dt><dd>${availTxt}</dd></div>
        </dl>
        ${ctaMain}
        <p class="book-note">${note}</p>
        <div class="share"><span>Compartir</span>
          <button type="button" id="copy-link" aria-label="Copiar enlace">${I('link')}</button>
          <a href="https://wa.me/?text=${encodeURIComponent(e.titulo + ' en Maloka ' + url)}" target="_blank" rel="noopener" aria-label="Compartir por WhatsApp">${I('chat')}</a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="Compartir en Facebook">${I('fb')}</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener" aria-label="Compartir en LinkedIn">${I('in')}</a>
          <p class="share-msg" id="share-msg" role="status"></p>
        </div>
      </aside>
      <div class="act-col">
        <section class="blk" aria-labelledby="h-desc"><h2 id="h-desc">Sobre la actividad</h2><p>${esc(e.descripcion)}</p></section>
        <section class="blk" aria-labelledby="h-vivir"><h2 id="h-vivir">Qué vas a vivir</h2><ul class="live-list">${e.vivir.map(v => `<li>${I('spark')}<span>${v}</span></li>`).join('')}</ul></section>
        ${e.exp ? `<section class="blk" aria-labelledby="h-exp"><h2 id="h-exp">Relacionado con</h2>
          <a class="exp-link" href="index.html#experiencias"><div class="ph ${EXPERIENCIAS[e.exp].tone}" role="img" aria-label="${EXPERIENCIAS[e.exp].nombre}"><div class="ph-img"></div></div>
          <div><small>Experiencia permanente</small><b>${EXPERIENCIAS[e.exp].nombre}</b><p>${EXPERIENCIAS[e.exp].texto} Esta actividad sucede en una fecha y hora específicas; la experiencia te espera todos los días.</p><span class="link-arrow"><span>${EXPERIENCIAS[e.exp].cta}</span>${I('arrow')}</span></div></a></section>` : ''}
        <section class="blk" aria-labelledby="h-rec"><h2 id="h-rec">Recomendaciones</h2><ul class="rec-list">${e.rec.map(r => `<li>${r}</li>`).join('')}</ul></section>
        <section class="blk" aria-labelledby="h-a11y"><h2 id="h-a11y">Accesibilidad</h2><div class="a11y-box"><span class="ic">${I('access')}</span><p>${e.accesibilidad}</p></div></section>
        ${e.req === 'inscripcion' && !sold ? `<section class="blk" id="inscripcion" aria-labelledby="h-ins"><h2 id="h-ins">Inscríbete</h2>
          <form class="signup" id="signup" novalidate>
            <div class="row"><label for="su-name">Nombre completo<input id="su-name" autocomplete="name" required></label>
            <label for="su-mail">Correo electrónico<input id="su-mail" type="email" autocomplete="email" required></label></div>
            <label for="su-n">Número de personas<select id="su-n"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
            <p class="msg" id="su-msg" role="status"></p>
            <button class="btn btn--navy btn--lg" type="submit">${I('pen')}Confirmar inscripción</button>
          </form></section>` : ''}
        <section class="blk" aria-labelledby="h-llegar"><h2 id="h-llegar">Cómo llegar</h2>
          <div class="howto"><div class="ph tone-arch" role="img" aria-label="Mapa de ubicación de Maloka en el sector de Salitre, Bogotá."><div class="ph-img"></div><span class="ph-note">${I('pin')}<span>Mapa estático (enlaza a Google Maps)</span></span></div>
          <div class="howto-info"><p>${I('pin')}<span><b>Cra. 68D #24A-51, Bogotá</b><br>${e.sitio} · dentro de Maloka</span></p><p>${I('route')}<span>Consulta rutas de transporte público y opciones de parqueo.</span></p><a class="link-arrow" href="index.html#entradas"><span>Cómo llegar</span>${I('arrow')}</a></div></div>
        </section>
      </div>
    </div>`;

    // Relacionadas: puntúa por fecha, público y tipo
    const rel = EVENTS.filter(x => x !== e && x.fecha >= today)
      .map(x => {
        const why = [];
        let s = 0;
        if (x.dia === e.dia) { s += 3; why.push('Mismo día'); }
        if (x.publico.some(p => e.publico.includes(p))) { s += 2; why.push('Mismo público'); }
        if (x.tipo === e.tipo) { s += 2; why.push(`También es ${LABELS.tipo[x.tipo].toLowerCase()}`); }
        if (x.cupo === 'agotado') s -= 3;
        return { x, s, why };
      }).sort((a, b) => b.s - a.s || a.x.fecha - b.x.fecha).slice(0, 3);
    $('#rel-grid').innerHTML = rel.map(r => `<div><p class="why">${I('spark')}${r.why[0] || 'Próximamente'}</p>${cardHTML(r.x)}</div>`).join('');

    // Barra fija móvil
    const bar = $('#act-bar');
    $('#act-bar .info b').textContent = `${isToday(e.fecha) ? 'Hoy' : cap(clean(F.corta.format(e.fecha)))} · ${e.hora12}`;
    $('#act-bar .info span').textContent = sold ? 'Agotado' : priceTxt;
    $('#act-bar-cta').outerHTML = sold ? `<a class="btn btn--outline" href="agendate.html">Ver agenda</a>` : a ? `<a class="btn ${a.cls}" href="${a.href}">${a.label}</a>` : `<a class="btn btn--buy" href="index.html#entradas">${I('ticket', 'ticket')}Compra entradas</a>`;
    new IntersectionObserver(([en]) => { const on = !en.isIntersecting; bar.classList.toggle('is-on', on); bar.toggleAttribute('inert', !on); }).observe($('#reserva'));

    // Compartir: copiar enlace
    $('#copy-link').addEventListener('click', () => {
      const msg = $('#share-msg');
      navigator.clipboard?.writeText(url).then(() => { msg.textContent = 'Enlace copiado.'; }, () => { msg.textContent = url; });
    });
    $('.play').addEventListener('click', ev => { ev.currentTarget.lastChild.textContent = 'Video de ejemplo (por producir)'; });

    // Inscripción (prototipo)
    const f = $('#signup');
    if (f) f.addEventListener('submit', ev => {
      ev.preventDefault();
      const m = $('#su-msg'), n = $('#su-name'), mail = $('#su-mail');
      m.className = 'msg';
      if (!n.value.trim()) { n.setAttribute('aria-invalid', 'true'); m.classList.add('err'); m.textContent = 'Escribe tu nombre para completar la inscripción.'; n.focus(); return; }
      n.removeAttribute('aria-invalid');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim())) { mail.setAttribute('aria-invalid', 'true'); m.classList.add('err'); m.textContent = 'Escribe un correo válido, por ejemplo nombre@correo.com.'; mail.focus(); return; }
      mail.removeAttribute('aria-invalid');
      m.classList.add('ok'); m.innerHTML = `${I('check-circle')}¡Listo! Te enviamos la confirmación de tu cupo por correo.`;
      f.reset();
    });
    if (location.hash === '#inscripcion') requestAnimationFrame(() => $('#inscripcion')?.scrollIntoView());
  }
})();
