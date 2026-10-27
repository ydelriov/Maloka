/* Maloka · capa global compartida por todas las páginas:
   iconos, franja de prototipo, header + mega menú, menú móvil, footer y búsqueda.
   Se carga de forma síncrona justo después del enlace "Saltar al contenido";
   el footer se inserta con Maloka.footer() donde se llame. */
(() => {
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-ticket" viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2.5"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></symbol>
  <symbol id="i-hourglass" viewBox="0 0 24 24"><path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></symbol>
  <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M15.5 5.2a3.5 3.5 0 0 1 0 6.6M18 14.8c1.9.7 3.2 2.4 3.5 5.2"/></symbol>
  <symbol id="i-access" viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3 6.5M12 14.5l3 6.5"/></symbol>
  <symbol id="i-services" viewBox="0 0 24 24"><path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 9V7M10.5 7h3"/></symbol>
  <symbol id="i-route" viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-camera" viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></symbol>
  <symbol id="i-spark" viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></symbol>
  <symbol id="i-flask" viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/></symbol>
  <symbol id="i-dome" viewBox="0 0 24 24"><path d="M3 19h18M4.5 19a7.5 7.5 0 0 1 15 0"/><path d="M12 11.5V5M9 6.5l3-1.5 3 1.5"/></symbol>
  <symbol id="i-mic" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></symbol>
  <symbol id="i-walk" viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6 3 3v3M8 11l3-4 3 3 3 1M12 15l-1-5"/></symbol>
  <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></symbol>
  <symbol id="i-headphones" viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/></symbol>
  <symbol id="i-tel" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/></symbol>
  <symbol id="i-ig" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></symbol>
  <symbol id="i-yt" viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor"/></symbol>
  <symbol id="i-fb" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M13 21v-7.5h2.5M10.5 13.5H13M13 13.5V10a2 2 0 0 1 2-2h1.5"/></symbol>
  <symbol id="i-tt" viewBox="0 0 24 24"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.3 4.5 5 4.7"/></symbol>
  <symbol id="i-in" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6S16 11.3 16 13v3"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-cap" viewBox="0 0 24 24"><path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.6V16c1.6 1.6 3.5 2.4 5.5 2.4s3.9-.8 5.5-2.4v-4.4M21.5 9.5V15"/></symbol>
  <symbol id="i-cake" viewBox="0 0 24 24"><path d="M4 20.5h16M5 20.5v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"/><path d="M5 15.5c1.2 1 2.3 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0M12 11.5V8M12 5.5c-.8-.8-.8-1.8 0-2.5.8.7.8 1.7 0 2.5z"/></symbol>
  <symbol id="i-briefcase" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M10.5 12.5v1.5h3v-1.5"/></symbol>
  <symbol id="i-door" viewBox="0 0 24 24"><path d="M4 21h16M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21"/><path d="M6 21l7-2V5l-7-2"/><circle cx="10.5" cy="12" r=".6" fill="currentColor"/></symbol>
  <symbol id="i-shapes" viewBox="0 0 24 24"><circle cx="7.5" cy="7.5" r="4"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><path d="M17 3l4 7h-8zM3.5 20.5l7-7"/></symbol>
  <symbol id="i-handshake" viewBox="0 0 24 24"><path d="M2.5 7.5l3-1.5 4 1.5M21.5 7.5l-3-1.5-5 2-3.5 3a1.4 1.4 0 0 0 2 2l2.5-1.5 4.5 4.5"/><path d="M2.5 14.5l3 .5 4.5 4a1.4 1.4 0 0 0 2-2M11 18.5a1.4 1.4 0 0 0 2-2M13.5 17a1.4 1.4 0 0 0 2-2M21.5 14.5l-3 .5"/></symbol>
  <symbol id="i-cube" viewBox="0 0 24 24"><path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="M4 7.4l8 4.6 8-4.6M12 12v9.2"/></symbol>
  <symbol id="i-chart" viewBox="0 0 24 24"><path d="M3.5 20.5h17M6.5 17v-5M11 17V8M15.5 17v-3.5M20 17V5"/></symbol>
  <symbol id="i-film" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></symbol>
  <symbol id="i-family" viewBox="0 0 24 24"><circle cx="8" cy="6" r="2.5"/><circle cx="17" cy="9" r="2"/><path d="M4 21v-6a4 4 0 0 1 8 0v6M14 21v-4a3 3 0 0 1 6 0v4"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></symbol>
  <symbol id="i-sunset" viewBox="0 0 24 24"><path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 3.5v4M9.5 6l2.5 2 2.5-2M4.2 11.2l1.4 1.4M19.8 11.2l-1.4 1.4M5 21.5h14"/></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></symbol>
  <symbol id="i-check-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16.5 9.5"/></symbol>
  <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.2v.1"/></symbol>
  <symbol id="i-x-circle" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></symbol>
  <symbol id="i-pen" viewBox="0 0 24 24"><path d="M4 20l1-4.5L16 4.5a2.1 2.1 0 0 1 3 3L8 18.5zM14 6.5l3 3M13 20h7"/></symbol>
  <symbol id="i-tag" viewBox="0 0 24 24"><path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z"/><circle cx="8" cy="8" r="1.5"/></symbol>
  <symbol id="i-gift" viewBox="0 0 24 24"><rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8.5h14V12M12 8v12.5M12 8C10 4 6.5 4.5 7 6.5S12 8 12 8zM12 8c2-4 5.5-3.5 5-1.5S12 8 12 8z"/></symbol>
  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></symbol>
  <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></symbol>
</svg>`;
const PROTO = `<div class="proto" role="note">
  <div class="wrap">
    <p><strong>Prototipo de alta fidelidad.</strong> Fotografías, horarios, precios, fechas y cifras son marcadores de posición. <a href="menu.html" style="color:#fff;font-weight:700">Ver estados del menú →</a></p>
    <button class="switch" type="button" id="notes-toggle" aria-pressed="true"><span class="switch-track" aria-hidden="true"></span>Notas de fotografía</button>
  </div>
</div>`;
const HEADER = `<header class="site-header" id="header">
  <div class="wrap header-bar">
    <a class="logo" href="index.html" aria-label="Maloka, ir al inicio"><svg class="logo-mark" viewBox="10 3 78 94" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="square"><path d="M15 6.5V55M45.5 6.5V93.5" stroke-width="2.2"/><path d="M45.5 15A39 39 0 0 1 45.5 93" stroke-width="1.6"/></g>
        <path d="M14 54H46.6V69C36 64 24 59 14 54Z" fill="currentColor"/>
        <g fill="currentColor" font-family="Manrope, 'Avenir Next', sans-serif" font-weight="700" font-size="11.5" text-anchor="middle"><text x="24.5" y="19.5">M</text><text x="36.5" y="19.5">A</text><text x="24" y="34.5">L</text><text x="36.5" y="34.5">O</text><text x="24" y="49">K</text><text x="36.5" y="49">A</text></g>
      </svg></a>

    <nav class="nav" aria-label="Principal">
      <ul class="nav-list">
        <!-- VISÍTANOS · acento teal -->
        <li style="--acc:var(--teal);--acc-ink:var(--teal-ink);--acc-soft:#E6F6F2">
          <button class="nav-trigger" type="button" id="nt-visitanos" data-nav="visitanos" aria-expanded="false" aria-controls="mm-visitanos">Visítanos<svg class="icon chev"><use href="#i-chev"/></svg></button>
          <div class="mm-panel" id="mm-visitanos" data-acc="var(--teal)">
            <div class="wrap mm-inner">
              <div class="mm-intro">
                <span class="mm-badge"><svg class="icon"><use href="#i-pin"/></svg></span>
                <p class="mm-title">Visítanos</p>
                <p class="mm-text">Todo lo que necesitas para preparar tu visita a Maloka.</p>
                <a class="mm-landing" href="index.html#entradas"><span>Ir a Visítanos</span><svg class="icon"><use href="#i-arrow"/></svg></a>
              </div>
              <div class="mm-col">
                <p class="mm-label">Planea tu visita</p>
                <ul class="mm-links">
                  <li><a class="mm-link mm-link--key" href="index.html#entradas"><span class="mm-ic"><svg class="icon"><use href="#i-ticket"/></svg></span><b>Horarios y tarifas</b><small>Consulta precios, días y horarios de apertura.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                  <li><a class="mm-link" href="index.html#entradas"><b>Cómo llegar</b><small>Dirección y opciones de transporte.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                  <li><a class="mm-link" href="index.html#entradas"><b>Servicios</b><small>Lo que encuentras durante tu visita.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                </ul>
                <p class="mm-label">Explora</p>
                <ul class="mm-links">
                  <li><a class="mm-link" href="index.html#experiencias"><b>Experiencias</b><small>Todo lo que puedes vivir en Maloka.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                </ul>
              </div>
              <aside class="mm-today" aria-label="¿Vienes hoy?">
                <p class="mm-today-k"><svg class="icon"><use href="#i-clock"/></svg>¿Vienes hoy?</p>
                <div class="mm-today-row"><span>Horario de hoy</span><strong>XX:XX – XX:XX</strong></div>
                <p class="mm-today-note">Dato dinámico: se conecta al calendario oficial de apertura.</p>
                <a class="btn btn--buy" href="index.html#entradas"><svg class="icon ticket"><use href="#i-ticket"/></svg>Compra entradas</a>
              </aside>
            </div>
          </div>
        </li>

        <!-- AGÉNDATE · enlace directo, sin submenú -->
        <li style="--acc:var(--yellow);--acc-ink:#7A5A00">
          <a class="nav-trigger nav-trigger--link" href="agendate.html" data-nav="agendate">Agéndate</a>
        </li>

        <!-- VEN EN GRUPO · acento morado -->
        <li style="--acc:var(--purple);--acc-ink:var(--purple-ink);--acc-soft:var(--purple-50)">
          <button class="nav-trigger" type="button" id="nt-grupo" data-nav="grupo" aria-expanded="false" aria-controls="mm-grupo">Ven en grupo<svg class="icon chev"><use href="#i-chev"/></svg></button>
          <div class="mm-panel" id="mm-grupo" data-acc="var(--purple)">
            <div class="wrap mm-inner">
              <div class="mm-intro">
                <span class="mm-badge"><svg class="icon"><use href="#i-users"/></svg></span>
                <p class="mm-title">Ven en grupo</p>
                <p class="mm-text">Encuentra la experiencia que mejor se adapta a tu grupo.</p>
                <a class="mm-landing" href="ven-en-grupo.html"><span>Ir a Ven en grupo</span><svg class="icon"><use href="#i-arrow"/></svg></a>
                <a class="btn btn--purple-outline" href="ven-en-grupo.html#cotiza">Cotiza tu visita<svg class="icon"><use href="#i-arrow"/></svg></a>
              </div>
              <ul class="mm-tiles">
                <li><a class="mm-tile" href="ven-en-grupo.html#colegios"><span class="mm-ic"><svg class="icon"><use href="#i-cap"/></svg></span><b>Colegios y universidades</b><small>Visitas que conectan con el aula.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                <li><a class="mm-tile" href="ven-en-grupo.html#cumpleanos"><span class="mm-ic"><svg class="icon"><use href="#i-cake"/></svg></span><b>Cumpleaños</b><small>Una celebración llena de experimentos.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                <li><a class="mm-tile" href="ven-en-grupo.html#empresas"><span class="mm-ic"><svg class="icon"><use href="#i-briefcase"/></svg></span><b>Empresas y eventos</b><small>Experiencias y espacios para equipos.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                <li><a class="mm-tile" href="ven-en-grupo.html#mpa"><span class="mm-ic"><svg class="icon"><use href="#i-door"/></svg></span><b><abbr title="Maloka Puertas Abiertas">MPA</abbr></b><small>Maloka Puertas Abiertas: ciencia para comunidades.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
              </ul>
            </div>
          </div>
        </li>

        <!-- DESCUBRE · acento azul, tratamiento editorial -->
        <li style="--acc:var(--blue);--acc-ink:#0F5DC7;--acc-soft:var(--blue-50)">
          <button class="nav-trigger" type="button" id="nt-descubre" data-nav="descubre" aria-expanded="false" aria-controls="mm-descubre">Descubre<svg class="icon chev"><use href="#i-chev"/></svg></button>
          <div class="mm-panel" id="mm-descubre" data-acc="var(--blue)">
            <div class="wrap mm-inner">
              <div class="mm-intro">
                <span class="mm-badge"><svg class="icon"><use href="#i-spark"/></svg></span>
                <p class="mm-title">Descubre</p>
                <p class="mm-text">Conoce las experiencias, proyectos y el impacto de Maloka.</p>
                <a class="mm-landing" href="index.html#descubre"><span>Ir a Descubre</span><svg class="icon"><use href="#i-arrow"/></svg></a>
              </div>
              <div class="mm-col">
                <ul class="mm-links mm-links--lg">
                  <li><a class="mm-link" href="index.html#descubre"><b>Programas y proyectos</b><small>Ciencia que llega a territorios y comunidades.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                  <li><a class="mm-link" href="index.html#experiencias"><b>Experiencias</b><small>Salas, laboratorios, Cine Domo y más.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                  <li><a class="mm-link" href="index.html#descubre"><b>Conoce Maloka</b><small>Quiénes somos y qué nos mueve.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                </ul>
              </div>
              <a class="mm-feature" href="index.html#descubre">
                <div class="ph tone-teal" role="img" aria-label="Una mediadora de Maloka trabaja con niños de una escuela rural alrededor de un experimento con agua."><div class="ph-img"></div><span class="ph-note"><svg class="icon"><use href="#i-camera"/></svg><span>Proyecto en territorio</span></span></div>
                <span class="mm-feature-k">Programas y proyectos</span>
                <span class="mm-feature-t">La ciencia también transforma territorios.</span>
                <span class="mm-landing"><span>Descubre los proyectos</span><svg class="icon"><use href="#i-arrow"/></svg></span>
              </a>
            </div>
          </div>
        </li>

        <!-- CREA CON MALOKA · acento coral, tono B2B -->
        <li style="--acc:var(--coral);--acc-ink:var(--coral-ink);--acc-soft:var(--coral-50)">
          <button class="nav-trigger" type="button" id="nt-crea" data-nav="crea" aria-expanded="false" aria-controls="mm-crea">Crea con Maloka<svg class="icon chev"><use href="#i-chev"/></svg></button>
          <div class="mm-panel" id="mm-crea" data-acc="var(--coral)">
            <div class="wrap mm-inner">
              <div class="mm-intro">
                <span class="mm-badge"><svg class="icon"><use href="#i-shapes"/></svg></span>
                <p class="mm-title">Crea con Maloka</p>
                <p class="mm-text">Desarrollamos soluciones y experiencias junto a organizaciones, empresas y comunidades.</p>
                <a class="btn btn--coral" href="index.html#crea">Hablemos de tu proyecto<svg class="icon"><use href="#i-arrow"/></svg></a>
              </div>
              <ul class="mm-services">
                <li><a class="mm-svc" href="index.html#crea"><span class="mm-ic"><svg class="icon"><use href="#i-handshake"/></svg></span><b>Patrocinios y alianzas</b><small>Sumemos esfuerzos para que más personas vivan la ciencia.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                <li><a class="mm-svc" href="index.html#crea"><span class="mm-ic"><svg class="icon"><use href="#i-cube"/></svg></span><b>Experiencias museográficas</b><small>Diseño y producción de exposiciones y módulos interactivos.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                <li><a class="mm-svc" href="index.html#crea"><span class="mm-ic"><svg class="icon"><use href="#i-book"/></svg></span><b>Acompañamiento pedagógico</b><small>Procesos con docentes e instituciones educativas.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
                <li><a class="mm-svc" href="index.html#crea"><span class="mm-ic"><svg class="icon"><use href="#i-chart"/></svg></span><b>Investigación y consultoría</b><small>Estudios de públicos, evaluación y estrategia.</small><svg class="icon"><use href="#i-arrow"/></svg></a></li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </nav>

    <div class="actions">
      <button class="icon-btn" type="button" id="search-open" aria-label="Buscar"><svg class="icon"><use href="#i-search"/></svg></button>
      <a class="util-link" href="#contacto"><svg class="icon"><use href="#i-mail"/></svg><span>Contacto</span></a>
      <a class="btn btn--buy header-buy" href="index.html#entradas"><svg class="icon ticket"><use href="#i-ticket"/></svg>Compra entradas</a>
      <a class="btn btn--buy m-buy" href="index.html#entradas"><svg class="icon ticket"><use href="#i-ticket"/></svg><span>Entradas</span></a>
      <button class="m-toggle" type="button" id="m-toggle" aria-expanded="false" aria-controls="drawer"><svg class="icon"><use href="#i-menu"/></svg><span>Menú</span></button>
    </div>
  </div>
  <div class="mm-shell" id="mm-shell" aria-hidden="true"></div>
</header>
<div class="mm-scrim" id="mm-scrim" aria-hidden="true"></div>

<!-- ===== Menú móvil: navegación progresiva ===== -->
<div class="drawer" id="drawer" hidden>
  <nav class="d-screen d-root" id="d-root" aria-label="Menú principal">
    <p class="d-kicker" aria-hidden="true">Menú</p>
    <ul class="d-list">
      <li style="--acc-ink:var(--teal-ink);--acc-soft:#E6F6F2"><button class="d-row" type="button" data-nav="visitanos" aria-expanded="false" aria-controls="ds-visitanos"><span class="d-ic"><svg class="icon"><use href="#i-pin"/></svg></span><span class="d-txt">Visítanos</span><span class="d-end"><svg class="icon"><use href="#i-plus"/></svg></span></button></li>
      <li style="--acc-ink:#0F5DC7;--acc-soft:#FFF6D9"><a class="d-row" href="agendate.html" data-nav="agendate"><span class="d-ic" style="color:#7A5A00"><svg class="icon"><use href="#i-calendar"/></svg></span><span class="d-txt">Agéndate</span><span class="d-end"><svg class="icon"><use href="#i-arrow"/></svg></span></a></li>
      <li style="--acc-ink:var(--purple-ink);--acc-soft:var(--purple-50)"><button class="d-row" type="button" data-nav="grupo" aria-expanded="false" aria-controls="ds-grupo"><span class="d-ic"><svg class="icon"><use href="#i-users"/></svg></span><span class="d-txt">Ven en grupo</span><span class="d-end"><svg class="icon"><use href="#i-plus"/></svg></span></button></li>
      <li style="--acc-ink:#0F5DC7;--acc-soft:var(--blue-50)"><button class="d-row" type="button" data-nav="descubre" aria-expanded="false" aria-controls="ds-descubre"><span class="d-ic"><svg class="icon"><use href="#i-spark"/></svg></span><span class="d-txt">Descubre</span><span class="d-end"><svg class="icon"><use href="#i-plus"/></svg></span></button></li>
      <li style="--acc-ink:var(--coral-ink);--acc-soft:var(--coral-50)"><button class="d-row" type="button" data-nav="crea" aria-expanded="false" aria-controls="ds-crea"><span class="d-ic"><svg class="icon"><use href="#i-shapes"/></svg></span><span class="d-txt">Crea con Maloka</span><span class="d-end"><svg class="icon"><use href="#i-plus"/></svg></span></button></li>
    </ul>
    <ul class="d-utils">
      <li><button class="d-util" type="button" id="m-search"><svg class="icon"><use href="#i-search"/></svg>Buscar</button></li>
      <li><a class="d-util" href="#contacto"><svg class="icon"><use href="#i-mail"/></svg>Contacto</a></li>
    </ul>
    <a class="btn btn--buy btn--lg d-buy" href="index.html#entradas"><svg class="icon ticket"><use href="#i-ticket"/></svg>Compra entradas</a>
  </nav>

  <section class="d-screen d-sub" id="ds-visitanos" aria-label="Visítanos" style="--acc:var(--teal);--acc-ink:var(--teal-ink)">
    <div class="d-sub-head"><button class="d-back" type="button"><svg class="icon"><use href="#i-arrow"/></svg><span class="sr-only">Volver al menú: </span>Visítanos</button><p class="d-desc">Todo lo que necesitas para preparar tu visita a Maloka.</p></div>
    <ul class="d-links">
      <li><a class="d-link d-link--key" href="index.html#entradas">Horarios y tarifas<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#entradas">Cómo llegar<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#entradas">Servicios<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#experiencias">Experiencias<svg class="icon"><use href="#i-arrow"/></svg></a></li>
    </ul>
    <a class="btn btn--buy btn--lg" href="index.html#entradas"><svg class="icon ticket"><use href="#i-ticket"/></svg>Compra entradas</a>
  </section>

  <section class="d-screen d-sub" id="ds-grupo" aria-label="Ven en grupo" style="--acc:var(--purple);--acc-ink:var(--purple-ink)">
    <div class="d-sub-head"><button class="d-back" type="button"><svg class="icon"><use href="#i-arrow"/></svg><span class="sr-only">Volver al menú: </span>Ven en grupo</button><p class="d-desc">Encuentra la experiencia que mejor se adapta a tu grupo.</p></div>
    <ul class="d-links">
      <li><a class="d-link" href="ven-en-grupo.html#colegios">Colegios y universidades<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="ven-en-grupo.html#cumpleanos">Cumpleaños<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="ven-en-grupo.html#empresas">Empresas y eventos<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="ven-en-grupo.html#mpa"><span>MPA<small>Maloka Puertas Abiertas</small></span><svg class="icon"><use href="#i-arrow"/></svg></a></li>
    </ul>
    <a class="btn btn--purple btn--lg" href="ven-en-grupo.html#cotiza">Cotiza tu visita<svg class="icon"><use href="#i-arrow"/></svg></a>
  </section>

  <section class="d-screen d-sub" id="ds-descubre" aria-label="Descubre" style="--acc:var(--blue);--acc-ink:#0F5DC7">
    <div class="d-sub-head"><button class="d-back" type="button"><svg class="icon"><use href="#i-arrow"/></svg><span class="sr-only">Volver al menú: </span>Descubre</button><p class="d-desc">Conoce las experiencias, proyectos y el impacto de Maloka.</p></div>
    <ul class="d-links">
      <li><a class="d-link" href="index.html#descubre">Programas y proyectos<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#experiencias">Experiencias<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#descubre">Conoce Maloka<svg class="icon"><use href="#i-arrow"/></svg></a></li>
    </ul>
  </section>

  <section class="d-screen d-sub" id="ds-crea" aria-label="Crea con Maloka" style="--acc:var(--coral);--acc-ink:var(--coral-ink)">
    <div class="d-sub-head"><button class="d-back" type="button"><svg class="icon"><use href="#i-arrow"/></svg><span class="sr-only">Volver al menú: </span>Crea con Maloka</button><p class="d-desc">Desarrollamos soluciones y experiencias junto a organizaciones, empresas y comunidades.</p></div>
    <ul class="d-links">
      <li><a class="d-link" href="index.html#crea">Patrocinios y alianzas<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#crea">Experiencias museográficas<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#crea">Acompañamiento pedagógico<svg class="icon"><use href="#i-arrow"/></svg></a></li>
      <li><a class="d-link" href="index.html#crea">Investigación y consultoría<svg class="icon"><use href="#i-arrow"/></svg></a></li>
    </ul>
    <a class="btn btn--coral btn--lg" href="index.html#crea">Hablemos de tu proyecto<svg class="icon"><use href="#i-arrow"/></svg></a>
  </section>
</div>`;
const FOOTER = `<footer class="site-footer on-dark" id="contacto">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="logo" href="index.html" aria-label="Maloka, ir al inicio">
          <svg class="logo-mark" viewBox="10 3 78 94" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="square"><path d="M15 6.5V55M45.5 6.5V93.5" stroke-width="2.2"/><path d="M45.5 15A39 39 0 0 1 45.5 93" stroke-width="1.6"/></g>
        <path d="M14 54H46.6V69C36 64 24 59 14 54Z" fill="currentColor"/>
        <g fill="currentColor" font-family="Manrope, 'Avenir Next', sans-serif" font-weight="700" font-size="11.5" text-anchor="middle"><text x="24.5" y="19.5">M</text><text x="36.5" y="19.5">A</text><text x="24" y="34.5">L</text><text x="36.5" y="34.5">O</text><text x="24" y="49">K</text><text x="36.5" y="49">A</text></g>
      </svg>
        </a>
        <p>La ciencia se vive.</p>
        <a class="btn btn--buy" href="index.html#entradas"><svg class="icon ticket"><use href="#i-ticket"/></svg>Compra entradas</a>
      </div>
      <div class="footer-cols">
        <nav class="footer-col" aria-labelledby="f1"><h2 id="f1">Visítanos</h2><ul>
          <li><a href="index.html#entradas">Horarios y tarifas</a></li><li><a href="index.html#entradas">Cómo llegar</a></li><li><a href="index.html#entradas">Servicios</a></li><li><a href="index.html#experiencias">Experiencias</a></li><li><a href="agendate.html">Agéndate</a></li><li><a href="index.html#entradas">Compra entradas</a></li></ul></nav>
        <nav class="footer-col" aria-labelledby="f2"><h2 id="f2">Ven en grupo</h2><ul>
          <li><a href="ven-en-grupo.html#colegios">Colegios y universidades</a></li><li><a href="ven-en-grupo.html#cumpleanos">Cumpleaños</a></li><li><a href="ven-en-grupo.html#empresas">Empresas y eventos</a></li><li><a href="ven-en-grupo.html#mpa">MPA · Maloka Puertas Abiertas</a></li><li><a href="ven-en-grupo.html#cotiza">Cotiza tu visita</a></li></ul></nav>
        <nav class="footer-col" aria-labelledby="f3"><h2 id="f3">Descubre</h2><ul>
          <li><a href="index.html#descubre">Programas y proyectos</a></li><li><a href="index.html#experiencias">Experiencias</a></li><li><a href="index.html#descubre">Conoce Maloka</a></li><li><a href="index.html#noticias">Noticias</a></li></ul></nav>
        <nav class="footer-col" aria-labelledby="f5"><h2 id="f5">Crea con Maloka</h2><ul>
          <li><a href="index.html#crea">Patrocinios y alianzas</a></li><li><a href="index.html#crea">Experiencias museográficas</a></li><li><a href="index.html#crea">Acompañamiento pedagógico</a></li><li><a href="index.html#crea">Investigación y consultoría</a></li></ul></nav>
        <nav class="footer-col" aria-labelledby="f4"><h2 id="f4">Corporación Maloka</h2><ul>
          <li><a href="#">Informes de gestión</a></li><li><a href="#">Sistema Integrado de Gestión</a></li><li><a href="#">Junta Directiva</a></li><li><a href="#">Contratación</a></li><li><a href="#">PQRSF</a></li><li><a href="#">Registro de proveedores</a></li><li><a href="#">Tratamiento de datos</a></li><li><a href="#">Intranet</a></li></ul></nav>
        <div class="footer-col"><h2>Contacto</h2>
          <address>
            <a href="#"><svg class="icon" style="width:18px;height:18px;margin-right:8px"><use href="#i-pin"/></svg>Cra. 68D #24A-51, Bogotá</a>
            <a href="#"><svg class="icon" style="width:18px;height:18px;margin-right:8px"><use href="#i-tel"/></svg>(601) XXX XXXX</a>
            <a href="#"><svg class="icon" style="width:18px;height:18px;margin-right:8px"><use href="#i-chat"/></svg>WhatsApp +57 XXX XXX XXXX</a>
            <a href="#"><svg class="icon" style="width:18px;height:18px;margin-right:8px"><use href="#i-mail"/></svg>correo@maloka.org</a>
          </address>
          <div class="footer-social">
            <a href="#" aria-label="Instagram"><svg class="icon"><use href="#i-ig"/></svg></a>
            <a href="#" aria-label="YouTube"><svg class="icon"><use href="#i-yt"/></svg></a>
            <a href="#" aria-label="TikTok"><svg class="icon"><use href="#i-tt"/></svg></a>
            <a href="#" aria-label="Facebook"><svg class="icon"><use href="#i-fb"/></svg></a>
            <a href="#" aria-label="LinkedIn"><svg class="icon"><use href="#i-in"/></svg></a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Corporación Maloka. Centro Interactivo de Ciencia, Tecnología e Innovación.</p>
      <ul><li><a href="#">Política de privacidad</a></li><li><a href="#">Términos de uso</a></li><li><a href="#">Mapa del sitio</a></li></ul>
    </div>
  </div>
</footer>`;
const SEARCH = `<dialog class="search-dlg" id="search-dlg" aria-label="Buscar en Maloka">
  <form method="dialog" class="search-box" role="search" onsubmit="return false">
    <svg class="icon"><use href="#i-search"/></svg>
    <label for="q" class="sr-only">Buscar</label>
    <input id="q" type="search" placeholder="¿Qué quieres descubrir?" autocomplete="off">
    <button class="icon-btn" type="button" id="search-close" aria-label="Cerrar búsqueda"><svg class="icon"><use href="#i-close"/></svg></button>
  </form>
  <div class="search-sugg">
    <h2>Lo más buscado</h2>
    <ul>
      <li><a class="chip-link" href="index.html#entradas">Horarios y tarifas</a></li>
      <li><a class="chip-link" href="index.html#experiencias">Experiencias</a></li>
      <li><a class="chip-link" href="ven-en-grupo.html#cumpleanos">Cumpleaños</a></li>
      <li><a class="chip-link" href="ven-en-grupo.html#colegios">Colegios y universidades</a></li>
      <li><a class="chip-link" href="agendate.html">Agéndate</a></li>
      <li><a class="chip-link" href="index.html#entradas">Cómo llegar</a></li>
    </ul>
  </div>
</dialog>`;

const bare = document.currentScript.dataset.layout === 'bare';
document.currentScript.insertAdjacentHTML('beforebegin', bare ? SPRITE : SPRITE + PROTO + HEADER);
window.Maloka = {
  footer() { document.currentScript.insertAdjacentHTML('beforebegin', FOOTER + SEARCH); }
};

document.addEventListener('DOMContentLoaded', () => {
  if (bare) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Sección activa (body[data-section]) ---------- */
  const section = document.body.dataset.section;
  if (section) {
    $$(`[data-nav="${section}"]`).forEach(el => { el.classList.add('is-current'); if (el.tagName === 'A') el.setAttribute('aria-current', 'page'); });
  }

  /* ---------- Notas de fotografía ---------- */
  const notesBtn = $('#notes-toggle');
  notesBtn.addEventListener('click', () => {
    const on = notesBtn.getAttribute('aria-pressed') !== 'true';
    notesBtn.setAttribute('aria-pressed', String(on));
    document.body.classList.toggle('hide-notes', !on);
  });

  /* ---------- Header sticky: se compacta suavemente al hacer scroll ---------- */
  const header = $('#header');
  let compact = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (!compact && y > 48) { compact = true; header.classList.add('is-scrolled'); }
    else if (compact && y < 12) { compact = false; header.classList.remove('is-scrolled'); }
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Mega menú (desktop / tablet horizontal) ----------
     Patrón "disclosure navigation": botón con aria-expanded + aria-controls.
     Un solo contenedor (.mm-shell) anima la altura entre categorías: no se cierra y reabre. */
  const triggers = $$('.nav-trigger[aria-controls]');
  const shell = $('#mm-shell'), mmScrim = $('#mm-scrim');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const panelOf = btn => document.getElementById(btn.getAttribute('aria-controls'));
  let current = null, tOpen, tClose, hoverOpened = false;

  function sizeShell() { if (current) shell.style.height = panelOf(current).offsetHeight + 'px'; }
  function openMenu(btn) {
    clearTimeout(tClose);
    if (current === btn) return;
    if (current) { current.setAttribute('aria-expanded', 'false'); panelOf(current).classList.remove('is-active'); }
    current = btn;
    const panel = panelOf(btn);
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-active');
    shell.style.setProperty('--shell-acc', panel.dataset.acc);
    sizeShell();
    shell.classList.add('is-open'); mmScrim.classList.add('is-open'); header.classList.add('mm-open');
  }
  function closeMenu(returnFocus) {
    clearTimeout(tOpen); clearTimeout(tClose);
    if (!current) return;
    const btn = current; current = null;
    btn.setAttribute('aria-expanded', 'false');
    panelOf(btn).classList.remove('is-active');
    shell.classList.remove('is-open'); mmScrim.classList.remove('is-open'); header.classList.remove('mm-open');
    if (returnFocus) btn.focus();
  }

  triggers.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (current === btn && !hoverOpened) closeMenu(); else openMenu(btn);
      hoverOpened = false;
    });
    btn.addEventListener('mouseenter', () => {
      if (!finePointer.matches) return;
      clearTimeout(tOpen); clearTimeout(tClose);
      tOpen = setTimeout(() => { if (current !== btn) { openMenu(btn); hoverOpened = true; setTimeout(() => { hoverOpened = false; }, 600); } }, current ? 40 : 140);
    });
    btn.addEventListener('mouseleave', () => clearTimeout(tOpen));
    btn.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(btn); panelOf(btn).querySelector('a')?.focus(); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const items = $$('.nav-trigger');
        const n = items[(items.indexOf(btn) + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length];
        e.preventDefault(); n.focus();
      }
    });
  });
  // Agéndate: enlace directo. Al pasar por encima solo cambia su estado visual y cierra cualquier panel abierto.
  $$('.nav-trigger--link').forEach(a => {
    a.addEventListener('mouseenter', () => { if (finePointer.matches) { clearTimeout(tOpen); tClose = setTimeout(() => closeMenu(), 120); } });
    a.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const items = $$('.nav-trigger');
        e.preventDefault(); items[(items.indexOf(a) + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length].focus();
      }
    });
  });
  header.addEventListener('mouseleave', () => { if (finePointer.matches && current) { clearTimeout(tOpen); tClose = setTimeout(() => closeMenu(), 260); } });
  header.addEventListener('mouseenter', () => clearTimeout(tClose));
  mmScrim.addEventListener('click', () => closeMenu());
  document.addEventListener('pointerdown', e => { if (current && !header.contains(e.target)) closeMenu(); });
  document.addEventListener('focusin', e => {
    if (current && e.target !== current && !panelOf(current).contains(e.target)) closeMenu();
  });
  $$('.mm-panel a').forEach(a => a.addEventListener('click', () => closeMenu()));
  window.addEventListener('resize', () => { sizeShell(); if (window.innerWidth <= 1024) closeMenu(); });

  /* ---------- Menú móvil: drawer con navegación progresiva ---------- */
  const drawer = $('#drawer'), mToggle = $('#m-toggle');
  const outside = () => [$('main'), $('.site-footer'), $('.proto'), $('#buy-bar')].filter(Boolean);
  let activeSub = null, subTrigger = null;

  function openDrawer(focus = true) {
    drawer.style.setProperty('--drawer-top', header.getBoundingClientRect().bottom + 'px');
    drawer.hidden = false;
    drawer.offsetHeight; // reflow para que la transición arranque
    drawer.classList.add('is-open');
    mToggle.setAttribute('aria-expanded', 'true');
    mToggle.querySelector('span').textContent = 'Cerrar';
    mToggle.querySelector('use').setAttribute('href', '#i-close');
    document.body.style.overflow = 'hidden';
    outside().forEach(el => el.inert = true);
    if (focus) $('.d-row', drawer).focus();
  }
  function closeDrawer(returnFocus) {
    if (drawer.hidden) return;
    drawer.classList.remove('is-open');
    mToggle.setAttribute('aria-expanded', 'false');
    mToggle.querySelector('span').textContent = 'Menú';
    mToggle.querySelector('use').setAttribute('href', '#i-menu');
    document.body.style.overflow = '';
    outside().forEach(el => el.inert = false);
    setTimeout(() => { drawer.hidden = true; closeSub(false); }, reduce.matches ? 0 : 250);
    if (returnFocus) mToggle.focus();
  }
  function openSub(btn, focus = true) {
    activeSub = document.getElementById(btn.getAttribute('aria-controls'));
    subTrigger = btn;
    btn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('show-sub');
    activeSub.classList.add('is-active');
    activeSub.scrollTop = 0;
    if (focus) setTimeout(() => $('.d-back', activeSub).focus(), reduce.matches ? 0 : 60);
  }
  function closeSub(returnFocus = true) {
    if (!activeSub) return;
    activeSub.classList.remove('is-active');
    drawer.classList.remove('show-sub');
    subTrigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) subTrigger.focus();
    activeSub = subTrigger = null;
  }
  mToggle.addEventListener('click', () => drawer.hidden ? openDrawer() : closeDrawer());
  $$('.d-row[aria-controls]', drawer).forEach(b => b.addEventListener('click', () => openSub(b)));
  $$('.d-back', drawer).forEach(b => b.addEventListener('click', () => closeSub()));
  drawer.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) closeDrawer(); });
  $('#m-search').addEventListener('click', () => { closeDrawer(); setTimeout(() => { $('#search-dlg').showModal(); $('#q').focus(); }, 50); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeDrawer(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (current) closeMenu(true);
    else if (activeSub) closeSub();
    else closeDrawer(true);
  });

  /* ---------- Estados de demostración (menu.html los usa en iframes) ----------
     ?estado=visitanos | grupo | descubre | crea | hover | hover-link | sticky | movil | movil-visitanos | movil-grupo */
  const estado = new URLSearchParams(location.search).get('estado');
  if (estado) {
    document.body.classList.add('demo');
    const now = el => { el.style.transition = 'none'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ''; })); };
    const openNow = id => { [shell, ...$$('.mm-panel')].forEach(now); openMenu($('#nt-' + id)); };
    if (['visitanos', 'grupo', 'descubre', 'crea'].includes(estado)) openNow(estado);
    if (estado === 'hover') $('.nav-trigger--link').classList.add('is-hover');
    if (estado === 'hover-link') { openNow('visitanos'); $$('#mm-visitanos .mm-link')[1].classList.add('is-hover'); }
    if (estado === 'hover-tile') { openNow('grupo'); $$('#mm-grupo .mm-tile')[1].classList.add('is-hover'); }
    if (estado === 'sticky') window.scrollTo({ top: 900, behavior: 'instant' });
    if (estado.startsWith('movil')) {
      now(drawer); openDrawer(false);
      const sub = estado.split('-')[1];
      if (sub) { [...$$('.d-screen')].forEach(now); openSub($(`.d-row[aria-controls="ds-${sub}"]`), false); }
    }
  }

  /* ---------- Búsqueda ---------- */
  const dlg = $('#search-dlg');
  $('#search-open').addEventListener('click', () => { dlg.showModal(); $('#q').focus(); });
  $('#search-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.search-sugg a')) dlg.close(); });
});
})();
