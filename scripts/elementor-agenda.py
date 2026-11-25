#!/usr/bin/env python3
"""Genera las plantillas de Elementor de la agenda conectada a WordPress (tipo de contenido «eventos»).

    python3 scripts/elementor-agenda.py

Escribe en elementor/:
  loop-evento.json            Loop Item · fila de Agéndate (fecha, afiche, tipo, título, extracto, horario, lugar,
                              «Ver descripción», acceso y botón)
  loop-evento-destacado.json  Loop Item · evento destacado (afiche grande sobre hueso)
  loop-evento-texto.json      Loop Item · fila de solo texto para la home
  loop-evento-pasado.json     Loop Item · evento reciente (gris, sin afiche)
  agendate-v13.json           Página Agéndate (cabecera, filtro, destacado, próximos, recientes, todos los días)
  home-v13-agenda.json        Sección «Próximos eventos» de la home: los 3 eventos más cercanos

Los Loop Grid apuntan a las plantillas con «@loop:<nombre>» en template_id: al importar a mano, elige la plantilla
en el widget; scripts de instalación pueden reemplazarlo por el ID real. Los Query ID (evento_destacado,
proximos_eventos, eventos_pasados, proximos_home) y los shortcodes ([evento_dias], [evento_fecha], [evento_acceso],
[evento_boton], [evento_descripcion]) están en elementor/agenda-snippet.php.
"""
import json, random, pathlib, urllib.parse

RAIZ = pathlib.Path(__file__).resolve().parent.parent
a = json.loads((RAIZ / 'src/data/n/agenda.json').read_text())
random.seed(2611)

NOCHE, HUESO, BLANCO, AMARILLO = '#231B2B', '#F4F1EC', '#FFFFFF', '#FFE25C'
TEXTO2, LAV_OSC = '#4F4955', '#6B5BD6'
PASTEL = {'cielo': '#9CCBF2', 'lavanda': '#B4A5F5', 'menta': '#9FE8C8', 'salmon': '#F4A39A', 'amarillo': AMARILLO}
TIPOS = {t['id']: t for t in a['tipos']}  # slug del término → etiqueta y color
ACF = {c: f'field_maloka_evento_{c}:{c}' for c in ('horario', 'lugar')}


# ---------- utilidades ----------
def nid():
    return '%07x' % random.getrandbits(28)


def px(v, u='px'):
    return {'unit': u, 'size': v, 'sizes': []}


def caja(t, r=None, b=None, l=None):
    r = t if r is None else r; b = t if b is None else b; l = r if l is None else l
    return {'unit': 'px', 'top': str(t), 'right': str(r), 'bottom': str(b), 'left': str(l), 'isLinked': False}


def gap(v, c=None):
    c = v if c is None else c
    return {'column': str(c), 'row': str(v), 'isLinked': c == v, 'unit': 'px', 'size': c}


def tipo(tam, peso='700', alto=1.2, tab=None, mov=None, ls=None, pre='typography'):
    t = {f'{pre}_typography': 'custom', f'{pre}_font_family': 'Montserrat', f'{pre}_font_size': px(tam),
         f'{pre}_font_weight': peso, f'{pre}_line_height': px(alto, 'em')}
    if tab: t[f'{pre}_font_size_tablet'] = px(tab)
    if mov: t[f'{pre}_font_size_mobile'] = px(mov)
    if ls is not None: t[f'{pre}_letter_spacing'] = px(ls, 'em')
    return t


def tag(nombre, **ajustes):
    """Etiqueta dinámica de Elementor ([elementor-tag …]) con sus ajustes."""
    s = urllib.parse.quote(json.dumps(ajustes, separators=(',', ':')), safe='')
    return f'[elementor-tag id="{nid()}" name="{nombre}" settings="{s}"]'


def cont(titulo, hijos, interno=True, **s):
    base = {'_title': titulo, 'content_width': 'full', 'flex_direction': 'column', 'padding': caja(0)}
    base.update(s)
    if '_css_classes' in base:  # en contenedores el ajuste se llama css_classes
        base['css_classes'] = base.pop('_css_classes')
    return {'id': nid(), 'elType': 'container', 'settings': base, 'elements': hijos, 'isInner': interno}


def widget(w, **s):
    return {'id': nid(), 'elType': 'widget', 'settings': s, 'elements': [], 'widgetType': w}


def enlace(url, externo=False):
    return {'url': url, 'is_external': 'on' if externo else '', 'nofollow': '', 'custom_attributes': ''}


def titulo(texto, tag_html='h2', color=NOCHE, tam=40, peso='700', alto=1.1, tab=None, mov=None, ls=None, css='', **s):
    st = {'title': texto, 'header_size': tag_html, 'title_color': color, **tipo(tam, peso, alto, tab, mov, ls)}
    if css: st['custom_css'] = css
    st.update(s)
    return widget('heading', **st)


def texto(html, color=TEXTO2, tam=16, alto=1.55, mov=None, **s):
    st = {'editor': html if html.startswith('<') else f'<p>{html}</p>', 'text_color': color, **tipo(tam, '400', alto, None, mov),
          'custom_css': 'selector p { margin: 0; }\n'}
    st.update(s)
    return widget('text-editor', **st)


def sc(codigo, css='', titulo_w=''):
    return widget('shortcode', shortcode=codigo, _title=titulo_w, custom_css=css)


def icono(fa, color=NOCHE, tam=20, lib='fa-solid', css=''):
    return widget('icon', selected_icon={'value': fa, 'library': lib}, primary_color=color, size=px(tam), custom_css=css)


def ante(t, color=LAV_OSC):
    return titulo(t, 'p', color, 18, '600', 1.3, mov=16)


def h2(t, color=NOCHE, idx=None):
    w = titulo(t, 'h2', color, 40, '700', 1.1, tab=34, mov=28, ls=-0.015)
    if idx: w['settings']['_element_id'] = idx
    return w


def enlace_grande(t, url, color=NOCHE, externo=False):
    return cont('Enlace · ' + t, [
        titulo(t, 'span', color, 24, '700', 1.2, tab=22, mov=20),
        icono('fas fa-arrow-right', color, 24, css='selector .elementor-icon { transition: transform .15s; }\n'),
    ], html_tag='a', link=enlace(url, externo), flex_direction='row', flex_direction_mobile='row', flex_align_items='center',
        flex_gap=gap(14), padding=caja(0, 0, 4, 0), border_border='solid', border_width=caja(0, 0, 3, 0), border_color=color,
        custom_css='selector { align-self: flex-start; --width: auto; width: auto; }\nselector:hover .elementor-icon { transform: translateX(6px); }\n')


def seccion(t, bg, hijos, idx=None, **s):
    interior = cont(t + ' · contenido', hijos, boxed_width=px(1280), content_width='boxed', flex_gap=gap(40),
                    padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16))
    st = dict(html_tag='section', background_background='classic', background_color=bg,
              padding=caja(96, 0), padding_tablet=caja(80, 0), padding_mobile=caja(64, 0), flex_gap=gap(0))
    st.update(s)
    if idx: st['_element_id'] = idx
    return cont(t, [interior], interno=False, **st)


def cabeza(izq, derecha=None):
    i = cont('Encabezado · textos', izq, flex_gap=gap(10), custom_css='selector { flex: 1 1 420px; }\n')
    return cont('Encabezado', [i] + ([derecha] if derecha else []), flex_direction='row', flex_wrap='wrap',
                flex_justify_content='space-between', flex_align_items='flex-end', flex_gap=gap(16, 32))


# ---------- piezas dinámicas del evento ----------
def etiqueta_tipo(pequena=False):
    """Nombre del tipo de evento (taxonomía) como etiqueta; el color sale de la clase tipo_evento-<slug> del Loop Item."""
    css = ('selector { align-self: flex-start; }\n'
           'selector .elementor-heading-title { display: inline-flex; align-items: center; height: 30px; padding: 0 12px; '
           f'background: {PASTEL["lavanda"]}; white-space: nowrap; }}\n')
    if pequena:
        css = ('selector { align-self: flex-start; }\n'
               'selector .elementor-heading-title { display: inline-block; padding: 2px 8px; border: 1px solid currentColor; }\n')
    w = titulo('Tipo', 'span', NOCHE if not pequena else TEXTO2, 14 if not pequena else 12, '700', 1, css=css,
               _element_width='auto', _css_classes='mk-ev-tipo' + (' mk-ev-tipo--linea' if pequena else ''))
    w['settings']['__dynamic__'] = {'title': tag('post-terms', taxonomy='tipo_evento', separator=', ', link='')}
    return w


def titulo_evento(tam=24, tab=22, mov=20, enlazar=True):
    w = titulo('Título del evento', 'h3', NOCHE, tam, '700', 1.2 if tam < 30 else 1.1, tab=tab, mov=mov,
               css='selector a { color: inherit; }\nselector a:hover { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }\n')
    dyn = {'title': tag('post-title')}
    if enlazar:
        dyn['link'] = tag('post-url')
    w['settings']['__dynamic__'] = dyn
    return w


def extracto(tam=15, color=TEXTO2):
    w = texto('Resumen del evento', color, tam, 1.5)
    w['settings']['__dynamic__'] = {'editor': tag('post-excerpt')}
    return w


def datos(items, en_linea=False, tam=15):
    """Lista de iconos con horario y lugar (campos ACF) y, si se pide, el acceso (shortcode)."""
    lista = []
    for clave, fa, lib in items:
        it = {'_id': nid(), 'text': clave, 'selected_icon': {'value': fa, 'library': lib}}
        if clave in ACF:
            it['__dynamic__'] = {'text': tag('acf-text', key=ACF[clave])}
        elif clave == 'acceso':
            it['__dynamic__'] = {'text': tag('shortcode', shortcode='[evento_acceso]')}
        lista.append(it)
    s = {'icon_list': lista, 'space_between': px(6), 'icon_color': NOCHE, 'icon_size': px(16), 'text_color': NOCHE,
         'text_indent': px(8), **tipo(tam, '600', 1.4, pre='icon_typography')}
    if en_linea:
        s.update(view='inline', space_between=px(20))
    return widget('icon-list', **s)


def fecha(grande=64, mes=16, tab=48, mov=38, semana=True, ancho=120):
    hijos = [sc('[evento_dias]', f'selector {{ font: 700 {grande}px/1 Montserrat, sans-serif; letter-spacing: -0.03em; color: {NOCHE}; white-space: nowrap; }}\n'
                f'@media (max-width: 1024px) {{ selector {{ font-size: {tab}px; }} }}\n@media (max-width: 767px) {{ selector {{ font-size: {mov}px; }} }}\n', 'Día'),
             sc('[evento_fecha formato="M"]', f'selector {{ font: 700 {mes}px/1.2 Montserrat, sans-serif; color: {NOCHE}; text-transform: lowercase; }}\n', 'Mes')]
    if semana:
        hijos.append(sc('[evento_fecha formato="D"]', f'selector {{ font: 400 14px/1.2 Montserrat, sans-serif; color: {TEXTO2}; }}\n', 'Día de la semana'))
    return cont('Fecha', hijos, flex_gap=gap(4),
                custom_css=(f'selector {{ flex: none; width: auto; --width: auto; min-width: {ancho}px; }}\n'
                            '@media (max-width: 1024px) { selector { min-width: 88px; } }\n'
                            '@media (max-width: 767px) { selector { min-width: 64px; } }\n'
                            'selector .elementor-shortcode { margin: 0; }\n'
                            '/* Rango de días («28–29»): más pequeño, como en el prototipo */\n'
                            'selector .maloka-rango { font-size: 0.7em; }\n'))


ACCESO_CSS = (f'selector .elementor-shortcode {{ display: inline-block; padding: 4px 10px; background: {NOCHE}; color: {AMARILLO}; '
              'font: 700 14px/1.3 Montserrat, sans-serif; }\nselector .elementor-shortcode:empty { display: none; }\n')
BOTON_CSS = (f'selector .maloka-evento-boton {{ display: inline-flex; gap: 6px; font: 700 16px/1.3 Montserrat, sans-serif; color: {NOCHE}; '
             'background: none; min-height: 0; padding: 0 0 2px; border-bottom: 2px solid currentColor; }\n'
             '/* En las listas es un enlace subrayado: anula el botón noche de la ficha (estilo global del snippet) */\n'
             'selector .maloka-evento-boton:hover { color: #6B5BD6; background: none; }\n'
             'selector .screen-reader-text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }\n')
DESC_CSS = ('selector details summary { display: inline-flex; align-items: center; gap: 6px; font: 700 14px/1.3 Montserrat, sans-serif; '
            f'color: {NOCHE}; cursor: pointer; list-style: none; border-bottom: 2px solid currentColor; padding-bottom: 1px; }}\n'
            'selector details summary::-webkit-details-marker { display: none; }\n'
            'selector details summary::after { content: "⌄"; font-size: 16px; line-height: 1; transition: transform .15s; }\n'
            'selector details[open] summary::after { transform: rotate(180deg); }\n'
            f'selector details div {{ margin-top: 10px; font: 400 15px/1.6 Montserrat, sans-serif; color: {NOCHE}; max-width: 64ch; }}\n'
            'selector details p { margin: 0 0 8px; }\n'
            'selector summary:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 2px; }\n')


def color_por_tipo(sel_hover, sel_tag='.mk-ev-tipo:not(.mk-ev-tipo--linea) .elementor-heading-title', fondo_hover=True, mezcla=45):
    """CSS: etiqueta y hover con el pastel de cada tipo (clase tipo_evento-<slug> que WordPress pone en el Loop Item)."""
    css = ''
    for slug, t in TIPOS.items():
        c = PASTEL[t['color']]
        css += f'.tipo_evento-{slug} {sel_tag} {{ background: {c} !important; }}\n'
        if fondo_hover:
            css += f'.tipo_evento-{slug} {sel_hover}:hover {{ background-color: color-mix(in srgb, {c} {mezcla}%, #fff); }}\n'
    return css


def loop_item(nombre, contenido, css):
    return {'title': nombre, 'type': 'loop-item', 'version': '0.4',
            'page_settings': {'source': 'eventos', 'custom_css': css}, 'content': [contenido]}


# ---------- Loop Item · fila de Agéndate ----------
fila = cont('Evento · fila', [
    fecha(56, 18, 40, 36, True, 110),
    widget('theme-post-featured-image', image_size='medium', link_to='custom',
           __dynamic__={'image': tag('post-featured-image'), 'link': tag('post-url')}, _css_classes='mk-ev-afiche',
           custom_css=('selector { width: 120px; flex: none; }\n'
                       'selector img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; display: block; background: #3A3242; }\n'
                       '@media (max-width: 1024px) { selector { width: 80px; } }\n@media (max-width: 767px) { selector { display: none; } }\n')),
    cont('Información', [etiqueta_tipo(), titulo_evento(), extracto(), datos([('horario', 'far fa-clock', 'fa-regular'), ('lugar', 'fas fa-map-marker-alt', 'fa-solid')], True),
                         sc('[evento_descripcion]', DESC_CSS, 'Ver descripción')],
         flex_gap=gap(8), custom_css='selector { flex: 1 1 0; min-width: 0; }\n'),
    cont('Acceso', [sc('[evento_acceso]', ACCESO_CSS, 'Acceso'), sc('[evento_boton]', BOTON_CSS, 'Botón')], flex_gap=gap(10),
         width=px(220), custom_css=('selector { flex: none; }\n'
                                    '@media (max-width: 1024px) { selector { width: auto; flex-basis: 100%; padding-left: 216px; } }\n'
                                    '@media (max-width: 767px) { selector { padding-left: 80px; } }\n')),
], flex_direction='row', flex_wrap='wrap', flex_align_items='flex-start', flex_gap=gap(16, 28), flex_gap_mobile=gap(12, 16),
    padding=caja(24, 16), padding_mobile=caja(20, 4), border_border='solid', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
    _css_classes='mk-ev-fila', custom_css='selector { flex-wrap: nowrap; transition: background-color .15s; }\n'
                                          '@media (max-width: 1024px) { selector { flex-wrap: wrap; } }\n')
LOOP_FILA = loop_item('Evento · fila (Agéndate)', fila, color_por_tipo('.mk-ev-fila'))

# ---------- Loop Item · destacado ----------
dest = cont('Evento · destacado', [
    widget('theme-post-featured-image', image_size='large', link_to='custom', __dynamic__={'image': tag('post-featured-image'), 'link': tag('post-url')},
           custom_css=('selector { width: 33%; flex: none; }\n'
                       'selector img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; display: block; background: #3A3242; }\n'
                       '@media (max-width: 1024px) { selector { width: 40%; } }\n'
                       '@media (max-width: 767px) { selector { width: 100%; } selector img { aspect-ratio: 4 / 5; } }\n')),
    cont('Destacado · textos', [
        cont('Fecha', [sc('[evento_dias]', f'selector {{ font: 700 72px/1 Montserrat, sans-serif; letter-spacing: -0.03em; color: {NOCHE}; }}\n'
                          '@media (max-width: 1024px) { selector { font-size: 56px; } }\n@media (max-width: 767px) { selector { font-size: 48px; } }\n', 'Día'),
                       sc('[evento_fecha formato="M"]', f'selector {{ font: 700 24px/1 Montserrat, sans-serif; color: {NOCHE}; text-transform: lowercase; }}\n', 'Mes')],
             flex_direction='row', flex_direction_mobile='row', flex_align_items='baseline', flex_gap=gap(10),
             custom_css='selector .elementor-shortcode { margin: 0; }\n'),
        etiqueta_tipo(),
        titulo_evento(40, 34, 28),
        extracto(18),
        datos([('horario', 'far fa-clock', 'fa-regular'), ('lugar', 'fas fa-map-marker-alt', 'fa-solid'), ('acceso', 'fas fa-ticket-alt', 'fa-solid')], tam=16),
        cont('Acciones', [sc('[evento_boton]', BOTON_CSS.replace('16px', '22px').replace('2px solid', '3px solid'), 'Botón'),
                          titulo('Más información →', 'span', NOCHE, 16, '700', 1.3,
                                 css='selector .elementor-heading-title { border-bottom: 2px solid currentColor; padding-bottom: 2px; }\nselector a { color: inherit; }\n',
                                 __dynamic__={'link': tag('post-url')}, _element_width='auto')],
             flex_direction='row', flex_direction_mobile='row', flex_wrap='wrap', flex_align_items='center', flex_gap=gap(16, 32),
             custom_css='selector { margin-top: 8px; }\n'),
    ], flex_gap=gap(14), custom_css='selector { flex: 1 1 0; min-width: 0; }\n'),
], flex_direction='row', flex_direction_mobile='column', flex_align_items='center', flex_gap=gap(48, 48), flex_gap_tablet=gap(32, 32),
    flex_gap_mobile=gap(20, 20), padding=caja(32), padding_tablet=caja(24), padding_mobile=caja(16),
    background_background='classic', background_color=HUESO)
LOOP_DEST = loop_item('Evento · destacado (Agéndate)', dest, color_por_tipo('', fondo_hover=False))

# ---------- Loop Item · solo texto (home) ----------
fila_txt = cont('Evento · texto', [
    fecha(64, 16, 48, 38, True, 120),
    cont('Textos', [etiqueta_tipo(), titulo_evento(enlazar=False), extracto(16)], flex_gap=gap(8),
         custom_css='selector { flex: 1 1 0; min-width: 0; }\n'),
    cont('Datos', [datos([('horario', 'far fa-clock', 'fa-regular'), ('lugar', 'fas fa-map-marker-alt', 'fa-solid'), ('acceso', 'fas fa-ticket-alt', 'fa-solid')])],
         width=px(260), custom_css=('selector { flex: none; }\n'
                                    '@media (max-width: 1024px) { selector { width: auto; flex-basis: 100%; padding-left: 120px; } '
                                    'selector .elementor-icon-list-items { display: flex; flex-wrap: wrap; gap: 6px 16px; } '
                                    'selector .elementor-icon-list-item { margin: 0 !important; padding: 0 !important; } }\n'
                                    '@media (max-width: 767px) { selector { padding-left: 80px; } }\n')),
    icono('fas fa-arrow-right', NOCHE, 26, css=('selector { flex: none; align-self: center; }\n'
                                                 'selector .elementor-icon { transform: rotate(-45deg); transition: transform .15s; }\n'
                                                 '@media (max-width: 767px) { selector { display: none; } }\n')),
], html_tag='a', flex_direction='row', flex_wrap='wrap', flex_align_items='center', flex_gap=gap(16, 32), flex_gap_mobile=gap(12, 16),
    padding=caja(28, 16), padding_mobile=caja(20, 4), border_border='solid', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
    _css_classes='mk-ev-txt', __dynamic__={'link': tag('post-url')},
    custom_css=('selector { flex-wrap: nowrap; transition: background-color .15s; }\n'
                'selector:hover .elementor-icon { transform: rotate(-45deg) translateX(4px); }\n'
                'selector:focus-visible { outline: 3px solid #6B5BD6; outline-offset: -3px; }\n'
                '@media (max-width: 1024px) { selector { flex-wrap: wrap; } }\n'))
LOOP_TXT = loop_item('Evento · texto (home)', fila_txt, color_por_tipo('.mk-ev-txt', mezcla=100))

# ---------- Loop Item · evento reciente ----------
pas = cont('Evento · reciente', [
    cont('Fecha', [sc('[evento_fecha formato="j M"]', f'selector {{ font: 700 15px/1.3 Montserrat, sans-serif; color: {TEXTO2}; text-transform: lowercase; }}\n', 'Fecha')]),
    etiqueta_tipo(pequena=True),
    titulo_evento(18, 18, 18),
    extracto(14),
], flex_gap=gap(6), padding=caja(20, 0), border_border='solid', border_width=caja(0, 0, 1, 0), border_color='rgba(35,27,43,0.2)')
LOOP_PAS = loop_item('Evento · reciente (Agéndate)', pas, '')


# ---------- Loop Item · tarjeta (otros próximos eventos en la ficha) ----------
tarjeta = cont('Evento · tarjeta', [
    cont('Fecha', [sc('[evento_dias]', f'selector {{ font: 700 48px/1 Montserrat, sans-serif; letter-spacing: -0.03em; color: {NOCHE}; }}\n'
                      'selector .maloka-rango { font-size: 0.75em; }\n', 'Día'),
                   sc('[evento_fecha formato="M · D"]', f'selector {{ font: 600 16px/1.2 Montserrat, sans-serif; color: {NOCHE}; text-transform: lowercase; }}\n', 'Mes y día')],
         flex_gap=gap(6), custom_css='selector .elementor-shortcode { margin: 0; }\n'),
    etiqueta_tipo(),
    titulo_evento(20, 20, 20, enlazar=False),
    sc('[evento_campo campo="horario"] · [evento_campo campo="lugar"]', f'selector {{ font: 400 14px/1.4 Montserrat, sans-serif; color: {TEXTO2}; }}\n', 'Horario y lugar'),
], html_tag='a', flex_gap=gap(10), flex_align_items='flex-start', padding=caja(24), background_background='classic',
    background_color=BLANCO, _css_classes='mk-ev-tarjeta', __dynamic__={'link': tag('post-url')},
    custom_css='selector { height: 100%; transition: background-color .15s; }\nselector:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 3px; }\n')
LOOP_TARJETA = loop_item('Evento · tarjeta (ficha)', tarjeta, color_por_tipo('.mk-ev-tarjeta', mezcla=100))


# ---------- Widgets de agenda ----------
def filtro(objetivo, todos='Todos'):
    return widget('taxonomy-filter', selected_element=objetivo, taxonomy='tipo_evento', show_first_item='yes',
                  first_item_title=todos, multiple_selection='',
                  **tipo(15, '600', 1, pre='taxonomy_filter_typography'),
                  taxonomy_filter_items_space_between=px(8),
                  taxonomy_filter_normal_text_color=NOCHE, taxonomy_filter_normal_background_background='classic',
                  taxonomy_filter_normal_background_color='rgba(0,0,0,0)', taxonomy_filter_normal_border_border='solid',
                  taxonomy_filter_normal_border_width=caja(2), taxonomy_filter_normal_border_color=NOCHE,
                  taxonomy_filter_hover_text_color=NOCHE, taxonomy_filter_hover_background_background='classic',
                  taxonomy_filter_hover_background_color='rgba(35,27,43,0.08)',
                  taxonomy_filter_active_text_color=AMARILLO, taxonomy_filter_active_background_background='classic',
                  taxonomy_filter_active_background_color=NOCHE, taxonomy_filter_active_border_border='solid',
                  taxonomy_filter_active_border_width=caja(2), taxonomy_filter_active_border_color=NOCHE,
                  taxonomy_filter_border_radius=caja(0), taxonomy_filter_padding=caja(0, 18),
                  custom_css='selector { --width: auto; width: auto; }\nselector .e-filter-item { min-height: 44px; display: inline-flex; align-items: center; box-sizing: border-box; }\n')


def loop_grid(plantilla, query_id, por_pagina, columnas=1, vacio='', col_tab=None, col_mov=1, gap_filas=0, idx=None):
    w = widget('loop-grid', _skin='post', template_id=f'@loop:{plantilla}', columns=columnas,
               columns_tablet=col_tab or columnas, columns_mobile=col_mov, posts_per_page=por_pagina,
               post_query_post_type='eventos', post_query_query_id=query_id, pagination_type='',
               column_gap=px(32), row_gap=px(gap_filas), row_gap_tablet=px(gap_filas), row_gap_mobile=px(gap_filas),
               nothing_found_message_text=vacio, nothing_found_message_color=TEXTO2,
               **tipo(17, '400', 1.5, pre='nothing_found_message_typography'))
    if idx:
        w['id'] = idx
    return w


# ---------- Página Agéndate ----------
ID_PROXIMOS = 'a9e4c01'
cab = cont('Agéndate · cabecera', [
    cont('Cabecera · contenido', [
        texto('<p><a href="/">Inicio</a> <span aria-hidden="true">/</span> <span aria-current="page">Agéndate</span></p>', TEXTO2, 14, 1.4,
              custom_css=('selector p { margin: 0; font-weight: 600; }\nselector a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }\n'
                          f'selector [aria-current] {{ color: {NOCHE}; }}\n'), html_tag='nav'),
        titulo(a['hero']['titulo'], 'h1', NOCHE, 40, '700', 1.1, tab=34, mov=28, ls=-0.015),
        texto(a['hero']['texto'], TEXTO2, 16, 1.5, _element_width='initial', _element_custom_width=px(640), _element_custom_width_mobile=px(100, '%')),
        titulo(f"{a['boletin']['texto'].replace('.', '')}: {a['boletin']['enlace'].lower()} ↗", 'span', NOCHE, 16, '700', 1.3,
               link=enlace(a['boletin']['url'], True), _element_width='auto',
               css='selector .elementor-heading-title { border-bottom: 2px solid currentColor; padding-bottom: 2px; }\nselector a { color: inherit; }\n'),
    ], content_width='boxed', boxed_width=px(1280), flex_gap=gap(10), flex_align_items='flex-start',
        padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16)),
], interno=False, html_tag='section', background_background='classic', background_color=HUESO,
    padding=caja(32, 0, 36, 0), padding_mobile=caja(24, 0, 28, 0))

prox = seccion('Agéndate · próximos eventos', BLANCO, [
    cabeza([ante('Programación'), h2('Próximos eventos')], cont('Filtro', [filtro(ID_PROXIMOS)], custom_css='selector { --width: auto; width: auto; }\n')),
    cont('Destacado', [loop_grid('evento-destacado', 'evento_destacado', 1)]),
    cont('Lista', [loop_grid('evento', 'proximos_eventos', 20, vacio='No hay eventos de este tipo por ahora.', idx=ID_PROXIMOS)],
         border_border='solid', border_width=caja(2, 0, 0, 0), border_color=NOCHE),
], idx='programacion', custom_css='selector { scroll-margin-top: 96px; }\n')

rec = seccion('Agéndate · eventos recientes', HUESO, [
    cabeza([ante('Ya pasaron'), h2('Eventos recientes'),
            texto('Los eventos salen solos de «Próximos» al terminar su fecha.', TEXTO2, 18, 1.55, mov=16)]),
    cont('Recientes', [loop_grid('evento-pasado', 'eventos_pasados', 6, 3, col_tab=2)],
         border_border='solid', border_width=caja(2, 0, 0, 0), border_color='rgba(35,27,43,0.3)'),
])

bloques = []
for p in a['permanente']['items']:
    c = PASTEL[p['color']]
    bloques.append(cont('Bloque · ' + p['titulo'], [
        titulo(p['titulo'], 'span', NOCHE, 24, '700', 1.2, tab=22, mov=20, css='selector .elementor-heading-title { transition: color .15s; }\n'),
        texto(p['texto'], NOCHE, 16, 1.5, custom_css='selector p { margin: 0; }\nselector { transition: color .15s; }\n'),
        icono('fas fa-arrow-right', NOCHE, 28, css='selector { align-self: flex-end; margin-top: auto; }\nselector .elementor-icon { transition: transform .15s, color .15s; }\n'),
    ], html_tag='a', link=enlace('/' + p['ruta']), flex_gap=gap(10), padding=caja(28), padding_tablet=caja(22),
        min_height=px(220), min_height_tablet=px(0), background_background='classic', background_color=c,
        custom_css=('selector { flex: 1 1 0; transition: background-color .15s; }\n'
                    f'selector:hover {{ background-color: {NOCHE}; }}\n'
                    'selector:hover .elementor-heading-title, selector:hover .elementor-widget-text-editor { color: #fff !important; }\n'
                    f'selector:hover .elementor-icon {{ color: {c} !important; transform: translateX(6px); }}\n'
                    f'selector:hover .elementor-icon svg {{ fill: {c} !important; }}\n'
                    '@media (max-width: 1024px) { selector { flex-basis: 100%; } }\n')))
td = seccion('Agéndate · todos los días', BLANCO, [
    cabeza([ante('Todos los días'), h2(a['permanente']['titulo']), texto(a['permanente']['texto'], TEXTO2, 18, 1.55, mov=16)]),
    cont('Bloques', bloques, flex_direction='row', flex_direction_tablet='column', flex_gap=gap(24, 24), flex_gap_tablet=gap(12, 12)),
])

CSS_AGENDATE = ('/* Agéndate · comunes */\n'
                'a.e-con { text-decoration: none; }\n'
                'a.e-con:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 3px; }\n'
                '.e-loop-item + .e-loop-item { margin-top: 0; }\n')
AGENDATE = {'title': 'Agéndate · V13', 'type': 'page', 'version': '0.4',
            'page_settings': {'hide_title': 'yes', 'template': 'elementor_header_footer', 'custom_css': CSS_AGENDATE},
            'content': [cab, prox, rec, td]}

# ---------- Sección de la home ----------
ID_HOME = 'b7e4c02'
HOME = seccion('Inicio · Agenda', BLANCO, [
    cabeza([ante('Agéndate'), h2('Próximos eventos')], cont('Filtro', [filtro(ID_HOME)], custom_css='selector { --width: auto; width: auto; }\n')),
    cont('Agenda · filas', [loop_grid('evento-texto', 'proximos_home', 3, vacio='No hay eventos próximos por ahora. Mira toda la programación.', idx=ID_HOME)],
         border_border='solid', border_width=caja(2, 0, 0, 0), border_color=NOCHE),
    cont('Agenda · pie', [enlace_grande('Toda la programación', '/agendate/')], flex_direction='row'),
], idx='agenda')
HOME_JSON = {'title': 'Inicio V13 · agenda (3 próximos eventos)', 'type': 'container', 'version': '0.4', 'page_settings': [], 'content': [HOME]}

# ---------- Ficha del evento: completa la plantilla de master (elementor/evento-single-v13.json) ----------
def ids_unicos(contenido):
    """Elementor usa el id de cada elemento en su CSS: si dos se repiten, uno hereda los estilos del otro.
    Renombra los repetidos (pasa cuando se insertan elementos en corridas distintas del generador)."""
    import secrets
    vistos, n = set(), 0

    def rec(els):
        nonlocal n
        for e in els:
            if e['id'] in vistos:
                e['id'] = secrets.token_hex(4)[:7]
                n += 1
            vistos.add(e['id'])
            rec(e['elements'])
    rec(contenido)
    return n


def completar_ficha():
    """Pone el Loop Grid de «Otros próximos eventos» donde estaba el texto de ayuda y corrige encabezados con
    header_size y color intercambiados. Es idempotente: se puede correr varias veces."""
    ruta = RAIZ / 'elementor/evento-single-v13.json'
    d = json.loads(ruta.read_text())
    cambios = []

    def recorrer(els):
        for i, e in enumerate(els):
            st = e['settings']
            if e.get('widgetType') == 'heading' and str(st.get('header_size', '')).startswith('#'):
                st['title_color'], st['header_size'] = st['header_size'], 'p'
                cambios.append('encabezado ' + st.get('title', ''))
            if e.get('widgetType') == 'text-editor' and 'Aquí va un Loop Grid' in st.get('editor', ''):
                els[i] = loop_grid('evento-tarjeta', 'otros_eventos', 3, 3, col_tab=2, col_mov=1, gap_filas=24,
                                   vacio='Pronto publicaremos más eventos.')
                els[i]['settings']['column_gap'] = px(24)
                cambios.append('loop grid')
            if e.get('widgetType') == 'heading' and 'evento_tipo' in json.dumps(st.get('__dynamic__', {})):
                if not any(x.get('widgetType') == 'shortcode' and '[evento_estado]' in x['settings'].get('shortcode', '') for x in els):
                    els.insert(i + 1, sc('[evento_estado]', 'selector .maloka-evento-pasado { display: inline-block; padding: 5px 12px; '
                                         'background: #E7E3DC; color: #4F4955; font: 700 14px/1.4 Montserrat, sans-serif; }\n'
                                         'selector .elementor-shortcode:empty { display: none; }\n', 'Este evento ya pasó'))
                    cambios.append('estado pasado')
                if st.get('_css_classes') != 'mk-ev-tipo':
                    st['_css_classes'] = 'mk-ev-tipo'
                    st['_flex_align_self'] = 'flex-start'
                    cambios.append('etiqueta del tipo')
            recorrer(e['elements'])
    recorrer(d['content'])
    # Color de la etiqueta según el tipo (clase tipo_evento-<slug> en el contenedor de la plantilla)
    css = '/* Etiqueta del tipo de evento con el pastel de su tipo */\n' + ''.join(
        f'.tipo_evento-{slug} .mk-ev-tipo {{ background-color: {PASTEL[t["color"]]} !important; }}\n' for slug, t in TIPOS.items())
    if not isinstance(d.get('page_settings'), dict):
        d['page_settings'] = {}
    if d['page_settings'].get('custom_css') != css:
        d['page_settings']['custom_css'] = css
        cambios.append('CSS por tipo')
    repetidos = ids_unicos(d['content'])
    if repetidos:
        cambios.append(f'{repetidos} ids repetidos')
    ruta.write_text(json.dumps(d, ensure_ascii=False, indent=1))
    print('Ficha:', ', '.join(cambios) or 'sin cambios')


completar_ficha()

for nombre, datos_json in [('loop-evento', LOOP_FILA), ('loop-evento-destacado', LOOP_DEST), ('loop-evento-texto', LOOP_TXT),
                           ('loop-evento-pasado', LOOP_PAS), ('loop-evento-tarjeta', LOOP_TARJETA), ('agendate-v13', AGENDATE), ('home-v13-agenda', HOME_JSON)]:
    (RAIZ / f'elementor/{nombre}.json').write_text(json.dumps(datos_json, ensure_ascii=False, indent=1))
    print('Escrito', f'elementor/{nombre}.json')
