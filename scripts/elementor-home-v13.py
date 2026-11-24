#!/usr/bin/env python3
"""Genera elementor/home-v13-secciones.json: las secciones de la home V13 que van debajo del hero en Elementor.

Lee el contenido de src/data/n/home.json (el mismo del prototipo) y el mapa ya renderizado del build de Astro
(dist/seleccion/index.html), así que antes hay que correr `npm run build`.

    python3 scripts/elementor-home-v13.py [--medios medios.json]

--medios: JSON {"cine-domo-cupula": [id, url], ...} con las fotos ya subidas a la Biblioteca de medios de WordPress.
Sin él, las fotos apuntan a public/elementor/img en GitHub Pages y Elementor las descarga al importar.

Solo contenedores y widgets nativos (Encabezado, Editor de texto, Icono, Lista de iconos, HTML) con el CSS
personalizado de Elementor Pro, igual que el hero «Hero · Inicio V13».
"""
import json, re, random, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
d = json.loads((RAIZ / 'src/data/n/home.json').read_text())
random.seed(13)

# Design System v3 · Noche y pastel (mismos valores que el Kit de Elementor del sitio)
NOCHE, HUESO, BLANCO, AMARILLO = '#231B2B', '#F4F1EC', '#FFFFFF', '#FFE25C'
TEXTO2, TEXTO2_OSC, LAV_OSC = '#4F4955', '#D9D3E0', '#6B5BD6'
PASTEL = {'cielo': '#9CCBF2', 'lavanda': '#B4A5F5', 'menta': '#9FE8C8', 'salmon': '#F4A39A', 'amarillo': AMARILLO}

# Páginas del sitio (slugs de pruebas.maloka.org)
RUTAS = {
    'Ver funciones': '/agendate/#programacion', 'Salas interactivas': '/visitanos/#experiencias',
    'Laboratorios': '/visitanos/#experiencias', 'Sala Digital': '/visitanos/#experiencias',
    'Programación': '/agendate/', 'Toda la programación': '/agendate/',
    'Colegios y universidades': '/ven-en-grupo/#colegios', 'Cumpleaños': '/ven-en-grupo/#cumpleanos',
    'Empresas y eventos': '/ven-en-grupo/#empresas', 'Maloka Puertas Abiertas': '/ven-en-grupo/#mpa',
    'Programas y proyectos': '/descubre/#programas', 'Recursos educativos': '/descubre/#recursos',
    'Conoce Maloka': '/descubre/#conoce', 'Noticias': '/noticias/', 'Ver todas': '/noticias/',
    'Patrocinios y alianzas': '/crea-con-maloka/#patrocinios', 'Experiencias museográficas': '/crea-con-maloka/#museografia',
    'Acompañamiento pedagógico': '/crea-con-maloka/#pedagogia', 'Investigación y consultoría': '/crea-con-maloka/#investigacion',
    'Maloka viajera': '/crea-con-maloka/#viajera', 'Hablemos de tu proyecto': '/crea-con-maloka/#contacto',
}
ruta = lambda t: RUTAS.get(t, '#')

medios = {}
if '--medios' in sys.argv:
    medios = json.loads(pathlib.Path(sys.argv[sys.argv.index('--medios') + 1]).read_text())
GH = 'https://ydelriov.github.io/Maloka/elementor/img/'


def foto(nombre):
    clave = nombre.rsplit('.', 1)[0]
    if clave in medios:
        i, u = medios[clave]
        return {'id': i, 'url': u, 'alt': '', 'source': 'library', 'size': ''}
    return {'id': '', 'url': GH + nombre, 'alt': '', 'source': 'library', 'size': ''}


# ---------- utilidades de Elementor ----------
def nid():
    return '%07x' % random.getrandbits(28)


def px(v, u='px'):
    return {'unit': u, 'size': v, 'sizes': []}


def caja(t, r=None, b=None, l=None, u='px'):
    r = t if r is None else r; b = t if b is None else b; l = r if l is None else l
    return {'unit': u, 'top': str(t), 'right': str(r), 'bottom': str(b), 'left': str(l), 'isLinked': False}


def gap(v, c=None):
    c = v if c is None else c
    return {'column': str(c), 'row': str(v), 'isLinked': c == v, 'unit': 'px', 'size': c}


def cont(titulo, hijos, interno=True, **s):
    base = {'_title': titulo, 'content_width': 'full', 'flex_direction': 'column', 'padding': caja(0)}
    base.update(s)
    if '_css_classes' in base:  # en los contenedores el ajuste «Clases CSS» se llama css_classes
        base['css_classes'] = base.pop('_css_classes')
    return {'id': nid(), 'elType': 'container', 'settings': base, 'elements': hijos, 'isInner': interno}


def enlace(url):
    return {'url': url, 'is_external': '', 'nofollow': '', 'custom_attributes': ''}


def tipo(tam, peso='700', alto=1.2, tab=None, mov=None, ls=None, pre='typography'):
    t = {f'{pre}_typography': 'custom', f'{pre}_font_family': 'Montserrat', f'{pre}_font_size': px(tam),
         f'{pre}_font_weight': peso, f'{pre}_line_height': px(alto, 'em')}
    if tab: t[f'{pre}_font_size_tablet'] = px(tab)
    if mov: t[f'{pre}_font_size_mobile'] = px(mov)
    if ls is not None: t[f'{pre}_letter_spacing'] = px(ls, 'em')
    return t


def titulo(texto, tag='h2', color=NOCHE, tam=40, peso='700', alto=1.1, tab=None, mov=None, ls=None, css='', **s):
    st = {'title': texto, 'header_size': tag, 'title_color': color, **tipo(tam, peso, alto, tab, mov, ls)}
    if css: st['custom_css'] = css
    st.update(s)
    return {'id': nid(), 'elType': 'widget', 'settings': st, 'elements': [], 'widgetType': 'heading'}


def texto(html, color=TEXTO2, tam=18, alto=1.55, mov=None, ancho=None, **s):
    st = {'editor': f'<p>{html}</p>', 'text_color': color, **tipo(tam, '400', alto, None, mov),
          'custom_css': 'selector p { margin: 0; }\n'}
    if ancho:
        st.update({'_element_width': 'initial', '_element_custom_width': px(ancho), '_element_custom_width_mobile': px(100, '%')})
    st.update(s)
    return {'id': nid(), 'elType': 'widget', 'settings': st, 'elements': [], 'widgetType': 'text-editor'}


def icono(fa, color=NOCHE, tam=20, lib='fa-solid', css='', **s):
    st = {'selected_icon': {'value': fa, 'library': lib}, 'primary_color': color, 'size': px(tam)}
    if css: st['custom_css'] = css
    st.update(s)
    return {'id': nid(), 'elType': 'widget', 'settings': st, 'elements': [], 'widgetType': 'icon'}


def html(codigo, t=''):
    return {'id': nid(), 'elType': 'widget', 'settings': {'_title': t, 'html': codigo}, 'elements': [], 'widgetType': 'html'}


def etiqueta(t, color):
    """Etiqueta pastel: rectángulo de 30 px de alto, texto 14/700."""
    return titulo(t, 'span', NOCHE, 14, '700', 1, css=(
        'selector { align-self: flex-start; }\n'
        f'selector .elementor-heading-title {{ display: inline-flex; align-items: center; height: 30px; padding: 0 12px; background: {PASTEL[color]}; white-space: nowrap; }}\n'),
        _element_width='auto')


def ante(t, oscuro=False, color=None):
    return titulo(t, 'p', color or (PASTEL['lavanda'] if oscuro else LAV_OSC), 18, '600', 1.3, mov=16)


def lead(t, oscuro=False, color=None):
    return texto(t, color or (TEXTO2_OSC if oscuro else TEXTO2), 18, 1.55, mov=16, ancho=620)


def h2(t, color=NOCHE, idx=None):
    w = titulo(t, 'h2', color, 40, '700', 1.1, tab=34, mov=28, ls=-0.015)
    if idx: w['settings']['_element_id'] = idx
    return w


def enlace_grande(t, url, color=NOCHE):
    """Patrón B: texto 24/700 con línea de 3 px y flecha que se mueve en hover."""
    return cont('Enlace · ' + t, [
        titulo(t, 'span', color, 24, '700', 1.2, tab=22, mov=20),
        icono('fas fa-arrow-right', color, 24, css='selector .elementor-icon { transition: transform .15s; }\n'),
    ], html_tag='a', link=enlace(url), flex_direction='row', flex_direction_mobile='row', flex_align_items='center',
        flex_gap=gap(14),
        padding=caja(0, 0, 4, 0), border_border='solid', border_width=caja(0, 0, 3, 0), border_color=color,
        custom_css='selector { align-self: flex-start; --width: auto; width: auto; }\nselector:hover .elementor-icon { transform: translateX(6px); }\n')


def enlace_chico(t, url):
    """Patrón A: texto 16/700 con línea de 2 px."""
    return cont('Enlace · ' + t, [
        titulo(t, 'span', NOCHE, 16, '700', 1.3),
        icono('fas fa-arrow-right', NOCHE, 18, css='selector .elementor-icon { transition: transform .15s; }\n'),
    ], html_tag='a', link=enlace(url), flex_direction='row', flex_direction_mobile='row', flex_align_items='center',
        flex_gap=gap(8), padding=caja(0, 0, 2, 0), border_border='solid', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
        custom_css='selector { --width: auto; width: auto; }\nselector:hover .elementor-icon { transform: translateX(4px); }\n')


def por_validar(t):
    return titulo(t, 'span', '#8A5A00', 12, '700', 1.4, css=(
        'selector { align-self: flex-start; }\n'
        'selector .elementor-heading-title { display: inline-block; padding: 3px 10px; background: #FFF4D6; }\n'),
        _element_width='auto')


def seccion(t, bg, hijos, idx=None, color_texto=NOCHE, **s):
    """Sección: banda a sangre con contenido de 1280 px y márgenes 80/40/16, relleno vertical 96/80/64."""
    interior = cont(t + ' · contenido', hijos, boxed_width=px(1280), content_width='boxed', flex_gap=gap(40),
                    padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16))
    st = dict(html_tag='section', background_background='classic', background_color=bg,
              padding=caja(96, 0), padding_tablet=caja(80, 0), padding_mobile=caja(64, 0), flex_gap=gap(0))
    st.update(s)
    if idx: st['_element_id'] = idx
    c = cont(t, [interior], interno=False, **st)
    return c, interior


def cabeza(hijos_izq, derecha=None):
    izq = cont('Encabezado · textos', hijos_izq, flex_gap=gap(10), _element_width='initial',
               custom_css='selector { flex: 1 1 520px; }\n')
    h = [izq] + ([derecha] if derecha else [])
    return cont('Encabezado', h, flex_direction='row', flex_wrap='wrap', flex_justify_content='space-between',
                flex_align_items='flex-end', flex_gap=gap(16, 32))


def foto_caja(t, nombre, **s):
    """Contenedor con la foto de fondo (cover)."""
    hijos = s.pop('hijos', [])
    st = dict(background_background='classic', background_color='#3A3242', background_image=foto(nombre),
              background_position='center center', background_size='cover', background_repeat='no-repeat',
              _css_classes='mk-foto')
    st.update(s)
    return cont(t, hijos, **st)


# ---------- 1 · Imperdibles (V10): una grande y tres ----------
np_ = d['noTePierdas']
g, *chicas = np_['items']
sec1, in1 = seccion('Inicio · Imperdibles', HUESO, [], idx='imperdibles')
in1['elements'].append(cabeza([ante('Imperdibles'), h2(np_['titulo']), lead(np_['texto'])]))

grande = cont('Imperdible grande · ' + g['etiqueta'], [
    foto_caja('Foto', g['imagen'], flex_grow=1, min_height=px(360), min_height_tablet=px(0),
              custom_css='@media (max-width: 1024px) { selector { aspect-ratio: 16 / 10; } }\n'),
    cont('Textos', [
        etiqueta(g['etiqueta'], g['color']),
        titulo(g['titulo'], 'h3', BLANCO, 40, '700', 1.1, tab=34, mov=28),
        texto(g['texto'], TEXTO2_OSC, 17, 1.5),
        cont('Meta', [titulo(g['meta'], 'span', AMARILLO, 15, '700', 1.3),
                      icono('fas fa-arrow-right', AMARILLO, 18, css='selector .elementor-icon { transition: transform .15s; }\n')],
             flex_direction='row', flex_direction_mobile='row', flex_align_items='center', flex_gap=gap(8)),
    ], flex_gap=gap(12), padding=caja(32), padding_mobile=caja(24)),
], html_tag='a', link=enlace(ruta(g['ruta'])), background_background='classic', background_color=NOCHE,
    width=px(58.33, '%'), width_tablet=px(100, '%'), min_height=px(620), min_height_tablet=px(0),
    custom_css='selector:hover .elementor-icon { transform: translateX(4px); }\n')

filas = []
for i, c in enumerate(chicas):
    ultima = i == len(chicas) - 1
    filas.append(cont('Imperdible · ' + c['etiqueta'], [
        foto_caja('Foto', c['imagen'], width=px(200), width_mobile=px(120),
                  custom_css='selector { aspect-ratio: 1; flex: none; }\n'),
        cont('Textos', [etiqueta(c['etiqueta'], c['color']),
                        titulo(c['titulo'], 'h3', NOCHE, 24, '700', 1.2, tab=22, mov=20),
                        titulo(c['meta'], 'span', NOCHE, 15, '700', 1.3)],
             flex_gap=gap(8), custom_css='selector { flex: 1; }\n'),
    ], html_tag='a', link=enlace(ruta(c['ruta'])), flex_direction='row', flex_direction_mobile='row',
        flex_align_items='center', flex_gap=gap(20, 20), flex_gap_mobile=gap(14, 14),
        padding=caja(0, 0, 0 if ultima else 24, 0),
        border_border='solid' if not ultima else '', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
        custom_css='selector:hover h3 { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }\n'))

in1['elements'].append(cont('Imperdibles · grilla', [
    grande, cont('Imperdibles · tres', filas, flex_gap=gap(24), width=px(41.67, '%'), width_tablet=px(100, '%')),
], flex_direction='row', flex_direction_tablet='column', flex_gap=gap(24, 24), flex_gap_tablet=gap(40, 40),
    flex_align_items='stretch'))

# ---------- 2 · Agenda (V12): filas con fecha grande y filtros ----------
ag = d['agenda']
filtros_html = (
    '<div class="mk-filtros" role="group" aria-label="Filtrar programación">\n'
    + ''.join(f'  <button type="button" aria-pressed="{"true" if i == 0 else "false"}" data-f="{f["id"]}">{f["label"]}</button>\n'
              for i, f in enumerate(ag['filtros']))
    + '  <p class="mk-sr" role="status" aria-live="polite"></p>\n</div>\n'
    '<style>\n'
    '.mk-filtros { display: flex; flex-wrap: wrap; gap: 8px; font-family: Montserrat, sans-serif; }\n'
    f'.mk-filtros button {{ min-height: 44px; padding: 0 18px; border: 2px solid {NOCHE}; border-radius: 0; background: transparent; color: {NOCHE}; font: 600 15px Montserrat, sans-serif; cursor: pointer; }}\n'
    '.mk-filtros button:hover, .mk-filtros button:focus { background: rgba(35,27,43,.08); color: #231B2B; }\n'
    f'.mk-filtros button[aria-pressed="true"] {{ background: {NOCHE}; color: {AMARILLO}; }}\n'
    f'.mk-filtros button:focus-visible {{ outline: 3px solid {LAV_OSC}; outline-offset: 2px; }}\n'
    '.mk-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); margin: 0; }\n'
    '@media (max-width: 767px) { .mk-filtros { gap: 6px; } .mk-filtros button { padding: 0 12px; font-size: 14px; } }\n'
    '</style>\n<script>\n'
    '(function () {\n'
    '  /* Filtra las filas de la agenda (contenedores con la clase mk-f-todo, mk-f-hoy o mk-f-finde) */\n'
    '  document.querySelectorAll(".mk-filtros").forEach(function (g) {\n'
    '    var msg = g.querySelector(".mk-sr");\n'
    '    g.querySelectorAll("[data-f]").forEach(function (b) {\n'
    '      b.addEventListener("click", function () {\n'
    '        g.querySelectorAll("[data-f]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });\n'
    '        var n = 0;\n'
    '        document.querySelectorAll(".mk-agenda-fila").forEach(function (el) {\n'
    '          var ok = b.dataset.f === "todo" || el.classList.contains("mk-f-" + b.dataset.f);\n'
    '          el.style.display = ok ? "" : "none"; if (ok) n++;\n'
    '        });\n'
    '        msg.textContent = n + " actividades: " + b.textContent;\n'
    '      });\n'
    '    });\n'
    '  });\n'
    '})();\n</script>\n')

sec2, in2 = seccion('Inicio · Agenda', BLANCO, [], idx='agenda')
in2['elements'].append(cabeza([ante('Agéndate'), h2(ag['titulo'])],
                              cont('Filtros', [html(filtros_html, 'Filtros de la agenda (no borrar)')], _element_width='auto',
                                   custom_css='selector { --width: auto; width: auto; }\n')))


def meta_lista(items):
    return {'id': nid(), 'elType': 'widget', 'widgetType': 'icon-list', 'elements': [], 'settings': {
        'icon_list': [{'_id': nid(), 'text': t, 'selected_icon': {'value': ic, 'library': lib}} for t, ic, lib in items],
        'space_between': px(6), 'icon_color': NOCHE, 'icon_size': px(16), 'text_color': NOCHE, 'text_indent': px(8),
        **tipo(15, '600', 1.4, pre='icon_typography'),
        'space_between_mobile': px(4),
        'custom_css': '@media (max-width: 1024px) { selector .elementor-icon-list-items { display: flex; flex-wrap: wrap; gap: 6px 16px; } selector .elementor-icon-list-item { margin: 0 !important; padding: 0 !important; } }\n',
    }}


filas_ag = []
for a in ag['items']:
    clase = 'mk-agenda-fila mk-f-' + a['filtro']
    filas_ag.append(cont(f"Actividad · {a['dia']} {a['mes']}", [
        cont('Fecha', [titulo(a['dia'], 'span', NOCHE, 64, '700', 1, tab=48, mov=38, ls=-0.03),
                       titulo(a['mes'], 'span', NOCHE, 16, '600', 1.2)],
             flex_gap=gap(6), width=px(120), width_tablet=px(96), width_mobile=px(64), custom_css='selector { flex: none; }\n'),
        cont('Textos', [etiqueta(a['categoria'], a['color']),
                        titulo(a['titulo'], 'h3', NOCHE, 24, '700', 1.2, tab=22, mov=20),
                        texto(a['texto'], TEXTO2, 16, 1.5)],
             flex_gap=gap(8), custom_css='selector { flex: 1 1 0; min-width: 0; }\n'),
        cont('Datos', [meta_lista([(a['hora'], 'far fa-clock', 'fa-regular'), (a['lugar'], 'fas fa-map-marker-alt', 'fa-solid'),
                                   (a['costo'], 'fas fa-ticket-alt', 'fa-solid')])],
             width=px(260), custom_css=(
                 'selector { flex: none; }\n'
                 '@media (max-width: 1024px) { selector { order: 3; flex-basis: 100%; width: 100%; padding-left: 128px; } }\n'
                 '@media (max-width: 767px) { selector { padding-left: 80px; } }\n')),
        icono('fas fa-arrow-right', NOCHE, 26, css=(
            'selector { flex: none; }\nselector .elementor-icon { transform: rotate(-45deg); transition: transform .15s; }\n'
            '@media (max-width: 767px) { selector { display: none; } }\n')),
    ], html_tag='a', link=enlace(ruta('Programación')), flex_direction='row', flex_direction_mobile='row',
        flex_wrap='wrap', flex_align_items='center', flex_gap=gap(16, 32), flex_gap_mobile=gap(12, 16),
        padding=caja(28, 16), padding_mobile=caja(20, 4), border_border='solid', border_width=caja(0, 0, 2, 0),
        border_color=NOCHE, _css_classes=clase,
        custom_css=('selector { flex-wrap: nowrap; transition: background-color .15s; }\n'
                    f'selector:hover, selector:focus-visible {{ background-color: {PASTEL[a["color"]]}; }}\n'
                    'selector:hover .elementor-icon { transform: rotate(-45deg) translate(4px, 0); }\n'
                    '@media (max-width: 1024px) { selector { flex-wrap: wrap; } }\n')))

in2['elements'].append(cont('Agenda · filas', filas_ag, border_border='solid', border_width=caja(2, 0, 0, 0),
                            border_color=NOCHE, flex_gap=gap(0)))
in2['elements'].append(cont('Agenda · pie', [enlace_grande(ag['enlace'], ruta(ag['enlace'])),
                                             por_validar('Contenido de ejemplo · fechas por validar')],
                            flex_direction='row', flex_wrap='wrap', flex_justify_content='space-between',
                            flex_align_items='center', flex_gap=gap(16), custom_css='selector { margin-top: 0; }\n'))

# ---------- 3 · Ven en grupo (V12): carrusel de tarjetas altas sobre noche ----------
gr = d['grupos']
sec3, in3 = seccion('Inicio · Ven en grupo', NOCHE, [], idx='ven-en-grupo')
in3['elements'].append(cabeza([ante('Ven en grupo', True), h2('Maloka se vive mejor en compañía.', BLANCO), lead(gr['texto'], True)]))

tarjetas = []
for it in gr['items']:
    recorte = it.get('recorte')
    st = dict(background_image=foto(it['imagen']), background_color=NOCHE, background_position='center center',
              background_size='cover')
    if recorte:
        st.update(background_color=AMARILLO, background_size='contain', background_position='bottom center')
    tarjetas.append(cont('Tarjeta · ' + it['titulo'], [
        cont('Pie', [
            cont('Textos', [titulo(it['titulo'], 'h3', BLANCO, 24, '700', 1.2, tab=22, mov=20),
                            texto(it['texto'], HUESO, 15, 1.45)], flex_gap=gap(6), custom_css='selector { flex: 1; }\n'),
            icono('fas fa-arrow-right', BLANCO, 26, css='selector .elementor-icon { transform: rotate(-45deg); transition: transform .3s; }\n'),
        ], flex_direction='row', flex_direction_mobile='row', flex_align_items='flex-end', flex_gap=gap(16), padding=caja(24),
            custom_css='selector { position: relative; z-index: 2; }\n'),
    ], html_tag='a', link=enlace(ruta(it['titulo'])), flex_justify_content='flex-end',
        background_background='classic', background_repeat='no-repeat', _css_classes='mk-carrusel-item',
        background_overlay_background='classic', background_overlay_color='rgba(35,27,43,0.42)',
        custom_css=('selector { aspect-ratio: 3 / 4; flex: none; width: min(340px, 26vw); scroll-snap-align: start; overflow: hidden; }\n'
                    'selector::before { transition: background-color .3s, opacity .3s !important; }\n'
                    'selector::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 55%; background: rgba(35,27,43,.45); pointer-events: none; z-index: 1; }\n'
                    'selector:hover::before { opacity: .3 !important; }\n'
                    'selector:hover .elementor-icon { transform: rotate(-45deg) translateX(4px); }\n'
                    'selector:focus-visible { outline: 3px solid #B4A5F5; outline-offset: 3px; }\n'
                    '@media (max-width: 767px) { selector { width: 82%; } }\n'), **st))

carrusel_html = (
    '<div class="mk-car-ctrl">\n'
    '  <button type="button" class="mk-car-btn" data-car="-1" aria-label="Anterior"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>\n'
    '  <button type="button" class="mk-car-btn" data-car="1" aria-label="Siguiente"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>\n'
    '</div>\n<style>\n'
    '.mk-car-ctrl { display: flex; justify-content: flex-end; gap: 8px; color: #fff; }\n'
    '.mk-car-btn { display: grid; place-items: center; width: 52px; height: 52px; padding: 0; border: 2px solid currentColor; border-radius: 50%; background: none; color: inherit; cursor: pointer; transition: background-color .15s, color .15s; }\n'
    f'.mk-car-btn:hover, .mk-car-btn:focus {{ background: {AMARILLO}; border-color: {AMARILLO}; color: {NOCHE}; }}\n'
    '.mk-car-btn:focus-visible { outline: 3px solid #B4A5F5; outline-offset: 2px; }\n'
    '.mk-car-btn:disabled { opacity: .3; cursor: default; background: none; color: #fff; border-color: currentColor; }\n'
    '@media (max-width: 767px) { .mk-car-ctrl { display: none; } }\n'
    '</style>\n<script>\n'
    '(function () {\n'
    '  /* Flechas del carrusel «Ven en grupo»: desplazan la pista (contenedor con la clase mk-carrusel) una tarjeta */\n'
    '  var pista = document.querySelector(".mk-carrusel"); if (!pista) return;\n'
    '  var btns = document.querySelectorAll(".mk-car-btn");\n'
    '  var suave = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";\n'
    '  var paso = function () { var c = pista.querySelector(".mk-carrusel-item"); return (c ? c.getBoundingClientRect().width : 300) + 20; };\n'
    '  var estado = function () { btns[0].disabled = pista.scrollLeft < 8; btns[1].disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 8; };\n'
    '  btns.forEach(function (b) { b.addEventListener("click", function () { pista.scrollBy({ left: paso() * Number(b.dataset.car), behavior: suave }); }); });\n'
    '  pista.addEventListener("scroll", estado, { passive: true }); window.addEventListener("resize", estado); estado();\n'
    '})();\n</script>\n')

pista = cont('Carrusel · pista (desliza con el dedo o el trackpad)', tarjetas, flex_direction='row',
             flex_direction_tablet='row', flex_direction_mobile='row', flex_wrap='nowrap', flex_gap=gap(20, 20),
             flex_gap_mobile=gap(12, 12), _css_classes='mk-carrusel',
             custom_css=('selector { overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; '
                         'padding-inline: max(80px, calc((100vw - 1280px) / 2 + 80px)) !important; '
                         'scroll-padding-inline: max(80px, calc((100vw - 1280px) / 2 + 80px)); padding-bottom: 4px !important; }\n'
                         'selector::-webkit-scrollbar { display: none; }\n'
                         '@media (max-width: 1024px) { selector { padding-inline: 40px !important; scroll-padding-inline: 40px; } }\n'
                         '@media (max-width: 767px) { selector { padding-inline: 16px !important; scroll-padding-inline: 16px; } }\n'))
sec3['elements'].append(pista)
sec3['elements'].append(cont('Carrusel · flechas', [html(carrusel_html, 'Flechas del carrusel (no borrar)')],
                             content_width='boxed', boxed_width=px(1280), padding=caja(0, 80), padding_tablet=caja(0, 40),
                             padding_mobile=caja(0, 16)))
sec3['settings']['flex_gap'] = gap(20)
in3['settings']['custom_css'] = 'selector { margin-bottom: 20px; }\n'

# ---------- 4 · Descubre (V11) en menta con el mapa de territorios ----------
te, de = d['territorios'], d['descubre']
svg = None
dist = RAIZ / 'dist/seleccion/index.html'
if dist.exists():
    h = dist.read_text()
    m = re.search(r'<svg class="nma-svg".*?</svg>', h, re.S)
    if m:
        svg = re.sub(r' data-astro-cid-[a-z0-9]+', '', m.group(0))
if not svg:
    sys.exit('Falta el mapa: corre `npm run build` antes.')
mapa_html = (
    f'<div class="nma">\n  <figure class="nma-fig">\n    {svg}\n'
    '    <figcaption class="nma-cap"><span><i class="nma-ley nma-ley--ok"></i>Territorios con presencia de Maloka</span><span><i class="nma-ley"></i>Por llegar</span></figcaption>\n'
    f'  </figure>\n  <p class="nma-total"><b>{len(te["items"])}</b><span>departamentos donde ha estado Maloka</span></p>\n</div>\n'
    '<style>\n'
    '/* Mapa base: @svg-maps/colombia (CC BY 4.0). Departamentos con Maloka en noche; el nombre y el programa salen al pasar el mouse. */\n'
    '.nma { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 24px; align-items: end; font-family: Montserrat, sans-serif; color: #231B2B; }\n'
    '.nma-fig { margin: 0; display: grid; gap: 12px; grid-row: span 2; }\n'
    '.nma-svg { width: 100%; height: auto; max-width: 280px; overflow: visible; }\n'
    '.nma-dep { fill: rgba(255,255,255,.55); stroke: #231B2B; stroke-width: .8; stroke-linejoin: round; transition: fill .15s; }\n'
    '.nma-dep.is-ok { fill: #231B2B; stroke: #9FE8C8; }\n'
    '.nma-dep.is-ok:hover { fill: #FFE25C; stroke: #231B2B; stroke-width: 1.4; }\n'
    '.nma-ins .nma-dep { vector-effect: non-scaling-stroke; }\n'
    '.nma-ins text { font: 600 15px Montserrat, sans-serif; fill: #231B2B; }\n'
    '.nma-sede { fill: #FFE25C; stroke: #231B2B; stroke-width: 2; pointer-events: none; }\n'
    '.nma-sede text { font: 700 24px Montserrat, sans-serif; fill: #231B2B; stroke: #9FE8C8; stroke-width: 6px; paint-order: stroke; }\n'
    '.nma-pulso { fill: none; stroke: #231B2B; stroke-width: 2; transform-origin: center; animation: nma-pulso 2.4s cubic-bezier(.2,.7,.2,1) infinite; }\n'
    '@keyframes nma-pulso { from { transform: scale(.5); opacity: 1; } to { transform: scale(1.6); opacity: 0; } }\n'
    '.nma-cap { display: grid; gap: 6px; font-size: 13px; font-weight: 600; font-style: normal; margin: 0; }\n'
    '.nma-cap span { display: inline-flex; align-items: center; gap: 8px; }\n'
    '.nma-ley { width: 14px; height: 14px; background: rgba(255,255,255,.55); border: 1px solid #231B2B; }\n'
    '.nma-ley--ok { background: #231B2B; }\n'
    '.nma-total { display: grid; gap: 6px; max-width: 13ch; margin: 0; padding-bottom: 8px; }\n'
    '.nma-total b { font-size: 72px; line-height: .85; font-weight: 700; letter-spacing: -0.03em; }\n'
    '.nma-total span { font-weight: 600; }\n'
    '@media (max-width: 767px) { .nma-total b { font-size: 56px; } .nma-svg { max-width: 220px; } }\n'
    '@media (prefers-reduced-motion: reduce) { .nma-pulso { animation: none; } }\n'
    '</style>\n')

sec4, in4 = seccion('Inicio · Descubre', PASTEL['menta'], [], idx='descubre')
izq4 = cont('Descubre · territorios', [
    ante('Descubre Maloka', color=NOCHE),
    titulo(te['titulo'], 'h2', NOCHE, 64, '700', 1.05, tab=48, mov=38, ls=-0.025),
    lead(te['texto'], color=NOCHE),
    cont('Mapa', [html(mapa_html, 'Mapa de territorios (SVG)')], padding=caja(24, 0, 0, 0), border_border='solid',
         border_width=caja(2, 0, 0, 0), border_color=NOCHE, custom_css='selector { margin-top: 8px; }\n'),
    por_validar(te['nota']),
], flex_gap=gap(16), width=px(41.66, '%'), width_tablet=px(100, '%'))

tarj4 = []
for it in de['items']:
    tarj4.append(cont('Descubre · ' + it['titulo'], [
        foto_caja('Foto', it['imagen'], custom_css='selector { aspect-ratio: 4 / 3; margin-bottom: 8px; }\n'),
        cont('Título', [titulo(it['titulo'], 'h3', NOCHE, 24, '700', 1.2, tab=22, mov=18),
                        icono('fas fa-arrow-right', NOCHE, 18, css='selector .elementor-icon { transition: transform .15s; }\n')],
             flex_direction='row', flex_direction_mobile='row', flex_align_items='center', flex_gap=gap(8)),
        texto(it['texto'], NOCHE, 16, 1.45, mov=15),
    ], html_tag='a', link=enlace(ruta(it['titulo'])), flex_gap=gap(8),
        width=px(50, '%'), width_mobile=px(50, '%'),
        custom_css=('selector { width: calc(50% - 12px) !important; }\n'
                    'selector:hover .elementor-icon { transform: translateX(4px); }\n'
                    '@media (max-width: 767px) { selector { width: calc(50% - 6px) !important; } }\n')))
der4 = cont('Descubre · enlaces', tarj4, flex_direction='row', flex_direction_mobile='row', flex_wrap='wrap',
            flex_gap=gap(32, 24), flex_gap_mobile=gap(24, 12), custom_css='selector { flex: 1; align-content: flex-start; }\n')
in4['elements'].append(cont('Descubre · columnas', [izq4, der4], flex_direction='row', flex_direction_tablet='column',
                            flex_gap=gap(64, 64), flex_gap_tablet=gap(40, 40), flex_align_items='flex-start'))

# ---------- 5 · Crea con Maloka (V11) en noche con filas ----------
cr = d['crea']
sec5, in5 = seccion('Inicio · Crea con Maloka', NOCHE, [], idx='crea')
izq5 = cont('Crea · textos', [ante('Para aliados', True), h2(cr['titulo'], BLANCO), lead(cr['texto'], True),
                              enlace_grande(cr['enlace'], ruta(cr['enlace']), AMARILLO)],
            flex_gap=gap(16), width=px(41.66, '%'), width_tablet=px(100, '%'))
filas5 = []
for t in cr['items']:
    filas5.append(cont('Fila · ' + t, [
        titulo(t, 'h3', BLANCO, 24, '700', 1.2, tab=22, mov=20, css='selector { flex: 1; }\nselector .elementor-heading-title { transition: color .15s; }\n'),
        icono('fas fa-arrow-right', BLANCO, 26, css='selector .elementor-icon { transform: rotate(-45deg); transition: transform .15s, color .15s; }\n'),
    ], html_tag='a', link=enlace(ruta(t)), flex_direction='row', flex_direction_mobile='row', flex_align_items='center',
        flex_gap=gap(24), padding=caja(24, 16), padding_mobile=caja(18, 8), border_border='solid',
        border_width=caja(0, 0, 2, 0), border_color='rgba(255,255,255,0.5)',
        custom_css=('selector { transition: background-color .15s; }\n'
                    f'selector:hover, selector:focus-visible {{ background-color: {PASTEL["lavanda"]}; }}\n'
                    f'selector:hover .elementor-heading-title {{ color: {NOCHE} !important; }}\n'
                    f'selector:hover .elementor-icon {{ color: {NOCHE} !important; transform: rotate(-45deg) translateX(4px); }}\n'
                    f'selector:hover .elementor-icon svg {{ fill: {NOCHE} !important; }}\n')))
der5 = cont('Crea · filas', filas5, border_border='solid', border_width=caja(2, 0, 0, 0), border_color='rgba(255,255,255,0.5)',
            custom_css='selector { flex: 1; }\n')
in5['elements'].append(cont('Crea · columnas', [izq5, der5], flex_direction='row', flex_direction_tablet='column',
                            flex_gap=gap(64, 64), flex_gap_tablet=gap(40, 40), flex_align_items='flex-start'))

# ---------- 6 · Noticias ----------
no = d['noticias']
sec6, in6 = seccion('Inicio · Noticias', BLANCO, [], idx='noticias')
in6['elements'].append(cabeza([ante('Lo último'), h2(no['titulo'])], enlace_chico(no['enlace'], ruta(no['enlace']))))
tarj6 = []
for n in no['items']:
    cat = etiqueta(n['categoria'], n['color'])
    cat['settings']['custom_css'] += 'selector { position: absolute; top: 0; right: 0; z-index: 1; }\n'
    tarj6.append(cont('Noticia · ' + n['titulo'], [
        foto_caja('Foto', n['imagen'], hijos=[cat], custom_css='selector { aspect-ratio: 3 / 2; position: relative; }\n'),
        titulo(n['titulo'], 'h3', NOCHE, 20, '700', 1.25, css='selector { margin-top: 6px; }\n'),
        texto(n['texto'], TEXTO2, 15, 1.45),
        titulo(f"{n['dia']} {n['mes']}", 'span', NOCHE, 14, '600', 1.3),
    ], html_tag='a', link=enlace(ruta('Noticias')), flex_gap=gap(10),
        custom_css=('selector { flex: 1 1 0; min-width: 0; }\n'
                    'selector:hover h3 { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }\n'
                    '@media (max-width: 767px) { selector { flex-basis: 100%; } }\n')))
in6['elements'].append(cont('Noticias · tarjetas', tarj6, flex_direction='row', flex_direction_mobile='column', flex_gap=gap(24, 24)))
in6['elements'].append(por_validar('Contenido de ejemplo'))

secciones = [sec1, sec2, sec3, sec4, sec5, sec6]

# CSS compartido: zoom de las fotos en hover y foco visible (va en Ajustes de la página › CSS personalizado)
CSS_PAGINA = (
    '/* Home V13 · comportamiento común de las tarjetas */\n'
    '.mk-foto { position: relative; overflow: hidden; }\n'
    'a.e-con { text-decoration: none; }\n'
    '/* Hero: cada diapositiva ocupa todo el ancho de la pantalla */\n'
    'body:not(.elementor-editor-active) .mk-slider { grid-template-columns: minmax(0, 1fr); justify-content: stretch !important; }\n'
    'a.e-con:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 3px; }\n'
    '@media (prefers-reduced-motion: reduce) { a.e-con, a.e-con .elementor-icon { transition: none !important; } }\n')

salida = {'title': 'Inicio V13 · secciones bajo el hero', 'type': 'container', 'version': '0.4',
          'page_settings': {'custom_css': CSS_PAGINA}, 'content': secciones}
destino = RAIZ / 'elementor/home-v13-secciones.json'
destino.write_text(json.dumps(salida, ensure_ascii=False, indent=1))
print('Escrito', destino.relative_to(RAIZ), f'({len(secciones)} secciones)')
