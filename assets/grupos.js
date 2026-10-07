/* Maloka · Ven en grupo
   Subnavegación con sección activa, bloques de información (abiertos en desktop, acordeón en móvil),
   timeline progresivo, preguntas frecuentes, formulario de cotización por pasos y CTA fijo en móvil. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 720px)');
  const I = id => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  /* ---------- Bloques de información: abiertos en desktop, acordeón en móvil ---------- */
  const setInfo = () => $$('[data-acc] details').forEach((d, i) => { d.open = !mobile.matches || i === 0; });
  setInfo(); mobile.addEventListener?.('change', setInfo);

  /* ---------- Subnavegación: sección activa ---------- */
  const links = $$('.subnav a[href^="#"]').filter(a => !a.closest('.sub-cta'));
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.removeAttribute('aria-current'));
      const a = map.get(en.target.id); // secciones sin enlace (p. ej. testimonios) limpian el estado
      if (a) { a.setAttribute('aria-current', 'true'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach(s => spy.observe(s));

  /* ---------- Timeline progresivo ---------- */
  $$('[data-steps]').forEach(ol => {
    const steps = $$('.step', ol);
    const light = () => {
      if (reduce.matches) { steps.forEach(s => s.classList.add('is-on')); ol.style.setProperty('--prog', 1); return; }
      ol.style.setProperty('--prog', 1);
      steps.forEach((s, i) => setTimeout(() => s.classList.add('is-on'), 120 + i * 170));
    };
    new IntersectionObserver(([en], obs) => { if (en.isIntersecting) { light(); obs.disconnect(); } }, { threshold: .4 }).observe(ol);
  });

  /* ---------- Preguntas frecuentes ----------
     Respuestas de ejemplo: deben validarse con el equipo de grupos antes de publicar. */
  const FAQ = [
    ['¿Con cuántas personas se considera una visita grupal?', 'Respuesta por validar. Indicará el número mínimo de personas para acceder a las condiciones de grupo.'],
    ['¿Cómo solicito una cotización?', 'Completa el formulario «Cotiza tu visita» de esta página. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo.', true],
    ['¿Puedo elegir las experiencias?', 'Respuesta por validar. Explicará qué experiencias se pueden elegir según el tipo de visita y la disponibilidad.'],
    ['¿Con cuánto tiempo debo reservar?', 'Respuesta por validar. Indicará la anticipación recomendada para cada tipo de visita.'],
    ['¿Los docentes o acompañantes pagan entrada?', 'Respuesta por validar. Aclarará las condiciones para docentes y acompañantes.'],
    ['¿Puedo cambiar la fecha?', 'Respuesta por validar. Describirá la política de cambios y cancelaciones.']
  ];
  const faq = $('#faq');
  faq.innerHTML = FAQ.map(([q, a, ok], i) => `
    <h3><button type="button" aria-expanded="false" aria-controls="fa-${i}" id="fq-${i}">${q}<span class="pm">${I('plus')}</span></button></h3>
    <div class="ans" id="fa-${i}" role="region" aria-labelledby="fq-${i}" hidden><p>${a}</p>${ok ? '' : '<span class="tbd">Respuesta por validar</span>'}</div>`).join('');
  faq.addEventListener('click', e => {
    const b = e.target.closest('button[aria-controls]'); if (!b) return;
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = open;
  });

  /* ---------- Formulario de cotización por pasos ---------- */
  const form = $('#quote-form'), sent = $('#q-sent'), stepper = $$('.stepper li');
  const steps = $$('.qf-step', form), next = $('#q-next'), back = $('#q-back'), count = $('#q-count');
  const TIPOS = {
    colegio: { name: 'Colegio o universidad', label: 'Nivel educativo', opts: ['Primera infancia', 'Primaria', 'Bachillerato', 'Educación superior', 'Grupo mixto'] },
    cumpleanos: { name: 'Cumpleaños', label: 'Edad de quien cumple años', opts: ['3 a 5 años', '6 a 8 años', '9 a 12 años', '13 años o más'] },
    empresa: { name: 'Empresa o evento', label: 'Tipo de evento', opts: ['Evento corporativo', 'Encuentro o conferencia', 'Actividad de equipo', 'Otro'] },
    mpa: { name: 'MPA · Maloka Puertas Abiertas', label: 'Tipo de organización', opts: ['Organización comunitaria', 'Fundación u ONG', 'Entidad pública', 'Otra'] }
  };
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  $('#q-fecha').min = iso(tomorrow);
  let cur = 1;

  const tipo = () => form.tipo.value;
  function fillPublico() {
    const t = TIPOS[tipo()] || TIPOS.colegio, sel = $('#q-publico'), prev = sel.value;
    $('#l-publico').textContent = t.label;
    sel.innerHTML = '<option value="">Elige una opción</option>' + t.opts.map(o => `<option${o === prev ? ' selected' : ''}>${o}</option>`).join('');
  }
  const fmtDate = v => v ? new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(v + 'T12:00')) : 'Por definir';
  const summary = () => `
    <div><dt>Tipo de visita</dt><dd>${TIPOS[tipo()]?.name || '—'}</dd></div>
    <div><dt>Fecha solicitada</dt><dd>${fmtDate(form.fecha.value)}</dd></div>
    <div><dt>Número de personas</dt><dd>${form.personas.value || '—'}</dd></div>`;

  function show(n, focus = true) {
    cur = n;
    steps.forEach(s => { s.hidden = +s.dataset.step !== n; });
    stepper.forEach(li => {
      const s = +li.dataset.s;
      li.classList.toggle('is-current', s === n); li.classList.toggle('is-done', s < n);
      li.toggleAttribute('aria-current', s === n); if (s === n) li.setAttribute('aria-current', 'step');
      $('.n', li).innerHTML = s < n ? I('check') : s;
    });
    back.hidden = n === 1;
    count.textContent = `Paso ${n} de 4`;
    next.innerHTML = n === 4 ? `Solicitar cotización${I('arrow')}` : `Continuar${I('arrow')}`;
    if (n === 2) fillPublico();
    if (n === 4) $('#q-review').innerHTML = summary();
    if (focus) $(`[data-step="${n}"] h3`).focus();
  }

  function setErr(input, errId, bad) {
    const e = document.getElementById(errId);
    e.hidden = !bad;
    if (input) bad ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
    return bad;
  }
  function validate(n) {
    const bad = [];
    if (n === 1) { if (setErr(null, 'err-tipo', !tipo())) bad.push($('input[name=tipo]')); }
    if (n === 2) {
      const p = form.personas, f = form.fecha, s = form.publico;
      if (setErr(p, 'e-personas', !(+p.value >= 1))) bad.push(p);
      if (setErr(f, 'e-fecha', !f.value || f.value < f.min)) bad.push(f);
      if (setErr(s, 'e-publico', !s.value)) bad.push(s);
    }
    if (n === 3) {
      const nm = form.nombre, c = form.correo, t = form.tel;
      if (setErr(nm, 'e-nombre', !nm.value.trim())) bad.push(nm);
      if (setErr(c, 'e-correo', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value.trim()))) bad.push(c);
      if (setErr(t, 'e-tel', t.value.replace(/\D/g, '').length < 7)) bad.push(t);
    }
    if (n === 4) { const ok = $('#q-ok'); if (setErr(ok, 'e-ok', !ok.checked)) bad.push(ok); }
    if (bad.length) bad[0].focus();
    return !bad.length;
  }
  // Limpia el error de un campo en cuanto se corrige
  form.addEventListener('input', e => { const el = e.target; if (el.getAttribute('aria-invalid') === 'true') { const id = el.getAttribute('aria-describedby'); if (id) setErr(el, id, false); } });
  form.addEventListener('change', e => { if (e.target.name === 'tipo') setErr(null, 'err-tipo', false); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate(cur)) return;
    if (cur < 4) return show(cur + 1);
    $('#q-summary').innerHTML = summary();
    form.hidden = true; $('.stepper').hidden = true; sent.hidden = false;
    $('h3', sent).focus();
  });
  back.addEventListener('click', () => show(cur - 1));
  $('#q-again').addEventListener('click', () => { form.reset(); sent.hidden = true; form.hidden = false; $('.stepper').hidden = false; show(1); });

  // Botones "Cotiza…" de la página: preseleccionan el tipo y saltan al paso 2
  $$('[data-quote]').forEach(a => a.addEventListener('click', () => {
    const t = a.dataset.quote;
    if (!sent.hidden) return;
    if (t) { form.tipo.value = t; setErr(null, 'err-tipo', false); setTimeout(() => show(2), reduce.matches ? 0 : 350); }
  }));
  show(1, false);

  /* ---------- CTA fijo en móvil: aparece tras el hero y se oculta junto al formulario ---------- */
  const bar = $('#vg-bar');
  let pastHero = false, atForm = false;
  const upd = () => { const on = pastHero && !atForm; bar.classList.toggle('is-on', on); bar.toggleAttribute('inert', !on); };
  new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting && en.boundingClientRect.top < 0; upd(); }).observe($('.vg-hero'));
  new IntersectionObserver(([en]) => { atForm = en.isIntersecting; upd(); }).observe($('#cotiza'));

  /* ---------- Estados de demostración (ven-en-grupo-estados.html) ---------- */
  const P = new URLSearchParams(location.search);
  if (P.get('tipo')) { form.tipo.value = P.get('tipo'); }
  if (P.get('paso')) {
    const n = +P.get('paso');
    if (n >= 3) { form.personas.value = 30; form.fecha.value = iso(new Date(Date.now() + 20 * 864e5)); }
    show(Math.min(n, 4), false);
    if (n >= 2) { fillPublico(); $('#q-publico').selectedIndex = 3; }
    if (n === 4) { form.nombre.value = 'Nombre de ejemplo'; form.correo.value = 'docente@colegio.edu.co'; form.tel.value = '300 000 0000'; $('#q-review').innerHTML = summary(); }
  }
  if (P.get('error')) { show(+P.get('error'), false); validate(+P.get('error')); }
  if (P.get('enviado')) {
    form.tipo.value = P.get('tipo') || 'colegio'; form.personas.value = 30; form.fecha.value = iso(new Date(Date.now() + 20 * 864e5));
    $('#q-summary').innerHTML = summary(); form.hidden = true; $('.stepper').hidden = true; sent.hidden = false;
  }
  if (P.get('faq')) { const b = $('#faq button'); b.click(); }
  const ir = P.get('ir');
  if (ir) setTimeout(() => document.getElementById(ir)?.scrollIntoView({ behavior: 'instant' }), 80);
})();
