#!/usr/bin/env python3
"""Genera las plantillas de Elementor de las noticias (entradas del blog de WordPress).

    python3 scripts/elementor-noticias.py

Escribe en elementor/:
  loop-noticia.json        Loop Item «Noticia»: imagen destacada cuadrada, categoría con su color, fecha, título,
                           extracto (3 líneas) y «Leer noticia →». Toda la tarjeta es el enlace.
  home-v13-noticias.json   Sección «Noticias» de la home: las 3 entradas más recientes (Loop Grid).
  loop-noticia-grande.json Loop Item «Noticia · grande»: la misma tarjeta en horizontal (la más reciente en /noticias/).
  noticias-v13.json        Página Noticias: cabecera, filtro por categoría, Loop Grid con la más reciente en grande
                           (plantilla alterna en la posición 1) y «Cargar más noticias», y el bloque para medios.

El Loop Grid apunta a la plantilla con «@loop:noticia» en template_id (al importar a mano, elige la Loop Item).
Colores de las categorías: src/data/n/noticias.json (Programación amarillo, Ciencia cielo, Institucional lavanda).
"""
import json, random, pathlib, urllib.parse

RAIZ = pathlib.Path(__file__).resolve().parent.parent
n = json.loads((RAIZ / 'src/data/n/noticias.json').read_text())
random.seed(1124)

NOCHE, HUESO, BLANCO, TEXTO2, LAV_OSC = '#231B2B', '#F4F1EC', '#FFFFFF', '#4F4955', '#6B5BD6'
PASTEL = {'cielo': '#9CCBF2', 'lavanda': '#B4A5F5', 'menta': '#9FE8C8', 'salmon': '#F4A39A', 'amarillo': '#FFE25C'}


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
    s = urllib.parse.quote(json.dumps(ajustes, separators=(',', ':')), safe='')
    return f'[elementor-tag id="{nid()}" name="{nombre}" settings="{s}"]'


def cont(titulo, hijos, interno=True, **s):
    base = {'_title': titulo, 'content_width': 'full', 'flex_direction': 'column', 'padding': caja(0)}
    base.update(s)
    if '_css_classes' in base:
        base['css_classes'] = base.pop('_css_classes')
    return {'id': nid(), 'elType': 'container', 'settings': base, 'elements': hijos, 'isInner': interno}


def widget(w, **s):
    return {'id': nid(), 'elType': 'widget', 'settings': s, 'elements': [], 'widgetType': w}


def titulo(texto, tag_html='h2', color=NOCHE, tam=40, peso='700', alto=1.1, tab=None, mov=None, ls=None, css='', **s):
    st = {'title': texto, 'header_size': tag_html, 'title_color': color, **tipo(tam, peso, alto, tab, mov, ls)}
    if css: st['custom_css'] = css
    st.update(s)
    return widget('heading', **st)


# ---------- Loop Item · Noticia ----------
cat = titulo('Categoría', 'span', NOCHE, 14, '700', 1, _element_width='auto', _css_classes='mk-no-cat',
             css=('selector .elementor-heading-title { display: inline-flex; align-items: center; height: 30px; padding: 0 12px; '
                  f'background: {PASTEL["lavanda"]}; white-space: nowrap; }}\n'))
cat['settings']['__dynamic__'] = {'title': tag('post-terms', taxonomy='category', separator=', ', link='')}
fecha = titulo('Fecha', 'span', TEXTO2, 14, '600', 1.3, _element_width='auto')
fecha['settings']['__dynamic__'] = {'title': tag('post-date', type='post_date', format='custom', custom_format='j \\d\\e F \\d\\e Y')}
tit = titulo('Título de la noticia', 'h3', NOCHE, 20, '700', 1.25, mov=18)
tit['settings']['__dynamic__'] = {'title': tag('post-title')}
ext = widget('text-editor', editor='<p>Extracto</p>', text_color=TEXTO2, **tipo(15, '400', 1.5),
             __dynamic__={'editor': tag('post-excerpt', max_length='')},
             custom_css=('selector p { margin: 0; }\n'
                         'selector .elementor-widget-container, selector { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }\n'))
leer = cont('Leer noticia', [
    titulo('Leer noticia', 'span', NOCHE, 16, '700', 1.3),
    widget('icon', selected_icon={'value': 'fas fa-arrow-right', 'library': 'fa-solid'}, primary_color=NOCHE, size=px(16),
           custom_css='selector .elementor-icon { transition: transform .15s; }\n'),
], flex_direction='row', flex_direction_mobile='row', flex_align_items='center', flex_gap=gap(6),
    padding=caja(6, 0, 0, 0), border_border='solid', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
    custom_css='selector { width: auto; --width: auto; align-self: flex-start; margin-top: auto; }\n')

tarjeta = cont('Noticia · tarjeta', [
    widget('theme-post-featured-image', image_size='medium_large', link_to='none',
           __dynamic__={'image': tag('post-featured-image')},
           custom_css=('selector { overflow: hidden; background: #3A3242; }\n'
                       'selector img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; transition: transform 600ms cubic-bezier(.2,.7,.2,1); }\n'
                       'a:hover selector img { transform: scale(1.04); }\n'
                       '@media (prefers-reduced-motion: reduce) { a:hover selector img { transform: none; } }\n')),
    cont('Textos', [
        cont('Categoría y fecha', [cat, fecha], flex_direction='row', flex_direction_mobile='row', flex_wrap='wrap',
             flex_align_items='center', flex_gap=gap(8, 12)),
        tit, ext, leer,
    ], flex_gap=gap(10), padding=caja(20, 20, 24, 20), custom_css='selector { flex: 1 1 auto; }\n'),
], html_tag='a', flex_gap=gap(0), background_background='classic', background_color=HUESO,
    __dynamic__={'link': tag('post-url')}, _css_classes='mk-no',
    custom_css=('selector { height: 100%; transition: background-color .15s; }\n'
                'selector:hover { background-color: #FFF3B0; }\n'
                'selector:hover .elementor-icon { transform: translateX(4px); }\n'
                'selector:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 3px; }\n'))

css_cat = '/* Etiqueta de la categoría con su pastel (clase category-<slug> que WordPress pone en cada entrada) */\n' + ''.join(
    f'.category-{c["id"]} .mk-no-cat .elementor-heading-title {{ background: {PASTEL[c["color"]]} !important; }}\n'
    for c in n['categorias'])
LOOP_NOTICIA = {'title': 'Noticia · tarjeta', 'type': 'loop-item', 'version': '0.4',
                'page_settings': {'source': 'post', 'custom_css': css_cat}, 'content': [tarjeta]}

# ---------- Sección de la home ----------
enlace_todas = cont('Enlace · Ver todas las noticias', [
    titulo('Ver todas las noticias', 'span', NOCHE, 16, '700', 1.3),
    widget('icon', selected_icon={'value': 'fas fa-arrow-right', 'library': 'fa-solid'}, primary_color=NOCHE, size=px(18),
           custom_css='selector .elementor-icon { transition: transform .15s; }\n'),
], html_tag='a', link={'url': '/noticias/', 'is_external': '', 'nofollow': '', 'custom_attributes': ''},
    flex_direction='row', flex_direction_mobile='row', flex_align_items='center', flex_gap=gap(8),
    padding=caja(0, 0, 2, 0), border_border='solid', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
    custom_css='selector { --width: auto; width: auto; }\nselector:hover .elementor-icon { transform: translateX(4px); }\n')

cabeza = cont('Encabezado', [
    cont('Encabezado · textos', [titulo('Lo último', 'p', LAV_OSC, 18, '600', 1.3, mov=16),
                                 titulo(n['titulo'], 'h2', NOCHE, 40, '700', 1.1, tab=34, mov=28, ls=-0.015)],
         flex_gap=gap(10), custom_css='selector { flex: 1 1 420px; }\n'),
    enlace_todas,
], flex_direction='row', flex_wrap='wrap', flex_justify_content='space-between', flex_align_items='flex-end', flex_gap=gap(16, 32))

grilla = widget('loop-grid', _skin='post', template_id='@loop:noticia', columns=3, columns_tablet=3, columns_mobile=1,
                posts_per_page=3, post_query_post_type='post', pagination_type='', equal_height='yes',
                column_gap=px(24), row_gap=px(24), row_gap_tablet=px(24), row_gap_mobile=px(24),
                nothing_found_message_text='Pronto publicaremos noticias.')

interior = cont('Inicio · Noticias · contenido', [cabeza, grilla], boxed_width=px(1280), content_width='boxed', flex_gap=gap(40),
                padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16))
seccion = cont('Inicio · Noticias', [interior], interno=False, html_tag='section', background_background='classic',
               background_color=BLANCO, padding=caja(96, 0), padding_tablet=caja(80, 0), padding_mobile=caja(64, 0),
               flex_gap=gap(0), _element_id='noticias')
HOME = {'title': 'Inicio V13 · noticias (3 últimas entradas)', 'type': 'container', 'version': '0.4', 'page_settings': [], 'content': [seccion]}

# ---------- Loop Item · Noticia grande ----------
def tarjeta_grande():
    c = titulo('Categoría', 'span', NOCHE, 14, '700', 1, _element_width='auto', _css_classes='mk-no-cat',
               css=('selector .elementor-heading-title { display: inline-flex; align-items: center; height: 30px; padding: 0 12px; '
                    f'background: {PASTEL["lavanda"]}; white-space: nowrap; }}\n'))
    c['settings']['__dynamic__'] = {'title': tag('post-terms', taxonomy='category', separator=', ', link='')}
    f = titulo('Fecha', 'span', TEXTO2, 14, '600', 1.3, _element_width='auto')
    f['settings']['__dynamic__'] = {'title': tag('post-date', type='post_date', format='custom', custom_format='j \\d\\e F \\d\\e Y')}
    t = titulo('Título de la noticia', 'h2', NOCHE, 40, '700', 1.1, tab=30, mov=22, ls=-0.015)
    t['settings']['__dynamic__'] = {'title': tag('post-title')}
    x = widget('text-editor', editor='<p>Extracto</p>', text_color=TEXTO2, **tipo(18, '400', 1.55), typography_font_size_mobile=px(15),
               __dynamic__={'editor': tag('post-excerpt', max_length='')},
               custom_css='selector p { margin: 0; }\nselector { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }\n')
    leer_g = cont('Leer noticia', [
        titulo('Leer noticia', 'span', NOCHE, 18, '700', 1.3, mov=16),
        widget('icon', selected_icon={'value': 'fas fa-arrow-right', 'library': 'fa-solid'}, primary_color=NOCHE, size=px(18),
               custom_css='selector .elementor-icon { transition: transform .15s; }\n'),
    ], flex_direction='row', flex_direction_mobile='row', flex_align_items='center', flex_gap=gap(6),
        padding=caja(0, 0, 2, 0), border_border='solid', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
        custom_css='selector { width: auto; --width: auto; align-self: flex-start; margin-top: 8px; }\n')
    return cont('Noticia · grande', [
        widget('theme-post-featured-image', image_size='large', link_to='none', __dynamic__={'image': tag('post-featured-image')},
               custom_css=('selector { width: 41.666%; flex: none; align-self: stretch; overflow: hidden; background: #3A3242; }\n'
                           'selector img { width: 100%; height: 100%; min-height: 100%; aspect-ratio: 1; object-fit: cover; display: block; transition: transform 600ms cubic-bezier(.2,.7,.2,1); }\n'
                           'selector > div, selector .elementor-widget-container { height: 100%; }\n'
                           'a:hover selector img { transform: scale(1.04); }\n'
                           '@media (max-width: 1200px) { selector { width: 50%; } }\n@media (max-width: 767px) { selector { width: 100%; } }\n')),
        cont('Textos', [cont('Categoría y fecha', [c, f], flex_direction='row', flex_direction_mobile='row', flex_wrap='wrap',
                             flex_align_items='center', flex_gap=gap(8, 12)), t, x, leer_g],
             flex_gap=gap(16), flex_gap_mobile=gap(10), flex_justify_content='center',
             padding=caja(40, 48), padding_tablet=caja(28), padding_mobile=caja(20, 20, 24, 20),
             custom_css='selector { flex: 1 1 0; min-width: 0; }\n'),
    ], html_tag='a', flex_direction='row', flex_direction_mobile='column', flex_gap=gap(0), background_background='classic',
        background_color=HUESO, __dynamic__={'link': tag('post-url')}, _css_classes='mk-no',
        custom_css=('selector { transition: background-color .15s; }\nselector:hover { background-color: #FFF3B0; }\n'
                    'selector:hover .elementor-icon { transform: translateX(4px); }\n'
                    'selector:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 3px; }\n'))


LOOP_GRANDE = {'title': 'Noticia · grande', 'type': 'loop-item', 'version': '0.4',
               'page_settings': {'source': 'post', 'custom_css': css_cat}, 'content': [tarjeta_grande()]}

# ---------- Página Noticias ----------
ID_LISTA = 'c3d1a07'
cab = cont('Noticias · cabecera', [
    cont('Cabecera · contenido', [
        widget('text-editor', editor='<p><a href="/">Inicio</a> <span aria-hidden="true">/</span> <span aria-current="page">Noticias</span></p>',
               text_color=TEXTO2, **tipo(14, '600', 1.4), html_tag='nav',
               custom_css=('selector p { margin: 0; }\nselector a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }\n'
                           f'selector [aria-current] {{ color: {NOCHE}; }}\n')),
        titulo(n['titulo'], 'h1', NOCHE, 40, '700', 1.1, tab=34, mov=28, ls=-0.015),
        widget('text-editor', editor=f"<p>{n['texto']}</p>", text_color=TEXTO2, **tipo(16, '400', 1.5),
               _element_width='initial', _element_custom_width=px(640), _element_custom_width_mobile=px(100, '%'),
               custom_css='selector p { margin: 0; }\n'),
    ], content_width='boxed', boxed_width=px(1280), flex_gap=gap(10), flex_align_items='flex-start',
        padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16)),
], interno=False, html_tag='section', background_background='classic', background_color=HUESO,
    padding=caja(32, 0, 36, 0), padding_mobile=caja(24, 0, 28, 0))

filtro = widget('taxonomy-filter', selected_element=ID_LISTA, taxonomy='category', show_first_item='yes', first_item_title='Todas',
                multiple_selection='', **tipo(15, '600', 1, pre='taxonomy_filter_typography'),
                taxonomy_filter_items_space_between=px(8),
                taxonomy_filter_normal_text_color=NOCHE, taxonomy_filter_normal_background_background='classic',
                taxonomy_filter_normal_background_color='rgba(0,0,0,0)', taxonomy_filter_normal_border_border='solid',
                taxonomy_filter_normal_border_width=caja(2), taxonomy_filter_normal_border_color=NOCHE,
                taxonomy_filter_hover_text_color=NOCHE, taxonomy_filter_hover_background_background='classic',
                taxonomy_filter_hover_background_color='rgba(35,27,43,0.08)',
                taxonomy_filter_active_text_color='#FFE25C', taxonomy_filter_active_background_background='classic',
                taxonomy_filter_active_background_color=NOCHE, taxonomy_filter_active_border_border='solid',
                taxonomy_filter_active_border_width=caja(2), taxonomy_filter_active_border_color=NOCHE,
                taxonomy_filter_border_radius=caja(0), taxonomy_filter_padding=caja(0, 18),
                custom_css=('selector .e-filter-item { min-height: 44px; display: inline-flex; align-items: center; box-sizing: border-box; }\n'
                            '/* «Sin categoría» (entradas antiguas) no se ofrece como filtro */\n'
                            'selector [data-filter="sin-categoria"] { display: none !important; }\n'
                            'selector .e-filter { justify-content: flex-start; }\n'))

lista = widget('loop-grid', _skin='post', template_id='@loop:noticia', columns=3, columns_tablet=2, columns_mobile=1,
               posts_per_page=7, post_query_post_type='post', equal_height='yes',
               column_gap=px(24), row_gap=px(32), row_gap_tablet=px(32), row_gap_mobile=px(20),
               alternate_template='yes',
               alternate_templates=[{'_id': nid(), 'template_id': '@loop:noticia-grande', 'repeat_template': 1, 'show_once': 'yes',
                                     'column_span': '3', 'static_position': ''}],
               pagination_type='load_more_on_click', pagination_load_type='ajax', text='Cargar más noticias',
               selected_icon={'value': 'fas fa-chevron-down', 'library': 'fa-solid'}, icon_align='row-reverse',
               load_more_button_align='center', load_more_spacing=px(40),
               button_text_color=NOCHE, background_background='classic', background_color='rgba(0,0,0,0)',
               button_background_hover_background='classic', button_background_hover_color=NOCHE,
               button_hover_color='#FFE25C', border_border='solid', border_width=caja(2), border_color=NOCHE,
               border_radius=caja(0), text_padding=caja(14, 24),
               load_more_no_posts_message_switcher='yes', load_more_no_posts_custom_message='Ya viste todas las noticias.',
               nothing_found_message_text='No hay noticias de esta categoría por ahora.',
               custom_css=('/* La más reciente ocupa toda la fila en cualquier número de columnas */\n'
                           'selector .e-loop-item:first-child { grid-column: 1 / -1 !important; }\n'
                           'selector .e-load-more-anchor + .e-loop__load-more .elementor-button, selector .e-loop__load-more .elementor-button { '
                           'font: 700 16px/1.2 Montserrat, sans-serif; min-height: 52px; display: inline-flex; align-items: center; gap: 8px; }\n'))
lista['id'] = ID_LISTA

todas = cont('Noticias · todas', [cont('Filtro', [filtro]), lista], content_width='boxed', boxed_width=px(1280),
             flex_gap=gap(32), padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16))
sec_todas = cont('Noticias · lista', [todas], interno=False, html_tag='section', background_background='classic',
                 background_color=BLANCO, padding=caja(64, 0, 96, 0), padding_tablet=caja(56, 0, 80, 0), padding_mobile=caja(40, 0, 64, 0))

pr = n['prensa']
prensa = cont('Noticias · para medios', [cont('Para medios · contenido', [
    cont('Textos', [titulo('Para medios', 'p', NOCHE, 18, '600', 1.3, mov=16),
                    titulo(pr['titulo'], 'h2', NOCHE, 40, '700', 1.1, tab=34, mov=28, ls=-0.015),
                    widget('text-editor', editor=f"<p>{pr['texto']}</p>", text_color=NOCHE, **tipo(17, '400', 1.5),
                           custom_css='selector p { margin: 0; max-width: 52ch; }\n')],
         flex_gap=gap(10), custom_css='selector { flex: 1 1 420px; }\n'),
    cont('Acciones', [
        cont('Correo', [titulo(pr['correo'], 'span', NOCHE, 24, '700', 1.2, mov=18),
                        widget('icon', selected_icon={'value': 'far fa-envelope', 'library': 'fa-regular'}, primary_color=NOCHE, size=px(24))],
             html_tag='a', link={'url': 'mailto:' + pr['correo'], 'is_external': '', 'nofollow': '', 'custom_attributes': ''},
             flex_direction='row', flex_direction_mobile='row', flex_align_items='center', flex_gap=gap(14),
             padding=caja(0, 0, 4, 0), border_border='solid', border_width=caja(0, 0, 3, 0), border_color=NOCHE,
             custom_css='selector { --width: auto; width: auto; }\nselector:hover .elementor-heading-title { color: #6B5BD6 !important; }\n'),
        cont('Trivia', [titulo(pr['trivia']['texto'], 'span', NOCHE, 16, '700', 1.3),
                        widget('icon', selected_icon={'value': 'fas fa-arrow-right', 'library': 'fa-solid'}, primary_color=NOCHE, size=px(16))],
             html_tag='a', link={'url': pr['trivia']['url'], 'is_external': '', 'nofollow': '', 'custom_attributes': ''},
             flex_direction='row', flex_direction_mobile='row', flex_align_items='center', flex_gap=gap(8),
             padding=caja(0, 0, 2, 0), border_border='solid', border_width=caja(0, 0, 2, 0), border_color=NOCHE,
             custom_css='selector { --width: auto; width: auto; }\n'),
    ], flex_gap=gap(16), flex_align_items='flex-start'),
], content_width='boxed', boxed_width=px(1280), flex_direction='row', flex_wrap='wrap', flex_justify_content='space-between',
    flex_align_items='flex-end', flex_gap=gap(24, 48), padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16))],
    interno=False, html_tag='section', background_background='classic', background_color=PASTEL['lavanda'],
    padding=caja(72, 0), padding_mobile=caja(56, 0))

PAGINA = {'title': 'Noticias · V13', 'type': 'page', 'version': '0.4',
          'page_settings': {'hide_title': 'yes', 'template': 'elementor_header_footer',
                            'custom_css': 'a.e-con { text-decoration: none; }\na.e-con:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 3px; }\n'},
          'content': [cab, sec_todas, prensa]}

# ---------- Página de cada noticia: completa la plantilla de master (elementor/noticia-single-v13.json) ----------
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


def completar_noticia():
    """Pone el Loop Grid de «Más noticias» (relacionadas por categoría, sin la actual) donde estaba el texto de ayuda y
    corrige encabezados con el color guardado en header_size. Idempotente."""
    ruta = RAIZ / 'elementor/noticia-single-v13.json'
    d = json.loads(ruta.read_text())
    cambios = []

    def recorrer(els):
        for i, e in enumerate(els):
            st = e['settings']
            if e.get('widgetType') == 'heading' and str(st.get('header_size', '')).startswith('#'):
                st['title_color'], st['header_size'] = st['header_size'], 'p'
                cambios.append('encabezado ' + st.get('title', ''))
            if e.get('widgetType') == 'text-editor' and 'Aquí va un Loop Grid' in st.get('editor', ''):
                g = widget('loop-grid', _skin='post', template_id='@loop:noticia', columns=3, columns_tablet=2, columns_mobile=1,
                           posts_per_page=3, post_query_post_type='post', post_query_query_id='noticias_relacionadas',
                           equal_height='yes', column_gap=px(24), row_gap=px(24), row_gap_tablet=px(24), row_gap_mobile=px(20),
                           nothing_found_message_text='')
                els[i] = g
                cambios.append('loop grid')
            if e.get('widgetType') == 'loop-grid' and st.get('post_query_post_type') == 'related':
                for k in ('post_query_related_taxonomies', 'post_query_related_fallback', 'post_query_exclude'):
                    st.pop(k, None)
                st.update(post_query_post_type='post', post_query_query_id='noticias_relacionadas')
                cambios.append('relacionadas por Query ID')
            if e.get('widgetType') == 'loop-grid' and 'minmax(0, 1fr)' not in st.get('custom_css', ''):
                # Columnas que no crecen con el contenido: sin esto una imagen ancha estira la grilla y la página
                st['custom_css'] = ('selector { width: 100%; align-self: stretch; }\n'
                                    'selector .elementor-loop-container { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }\n'
                                    '@media (max-width: 1200px) { selector .elementor-loop-container { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }\n'
                                    '@media (max-width: 767px) { selector .elementor-loop-container { grid-template-columns: minmax(0, 1fr) !important; } }\n'
                                    'selector .e-loop-item { min-width: 0; }\nselector img { max-width: 100%; }\n')
                cambios.append('columnas minmax(0, 1fr)')
            if e.get('widgetType') == 'share-buttons' and st.get('button_size', {}).get('unit') != 'px':
                # button_size se multiplica por 10 y va sin unidad (px): 0.8em dejaba botones de 4 px
                st.update(button_size={'unit': 'px', 'size': 1.6, 'sizes': []}, button_height={'unit': 'px', 'size': 44, 'sizes': []},
                          icon_size={'unit': 'px', 'size': 20, 'sizes': []}, border_size={'unit': 'px', 'size': 2, 'sizes': []},
                          column_gap={'unit': 'px', 'size': 8, 'sizes': []}, row_gap={'unit': 'px', 'size': 8, 'sizes': []},
                          custom_css=('selector .elementor-share-btn { width: 44px; justify-content: center; }\n'
                                      'selector .elementor-share-btn:focus-visible { outline: 3px solid #6B5BD6; outline-offset: 2px; }\n'))
                cambios.append('botones de compartir 44 px')
            if e.get('widgetType') == 'post-info':
                # Categoría como etiqueta de color y fecha completa, como en las tarjetas
                c = titulo('Categoría', 'span', NOCHE, 14, '700', 1, _element_width='auto', _css_classes='mk-no-cat',
                           css=('selector .elementor-heading-title { display: inline-flex; align-items: center; height: 30px; padding: 0 12px; '
                                f'background: {PASTEL["lavanda"]}; white-space: nowrap; }}\n'))
                c['settings']['__dynamic__'] = {'title': tag('post-terms', taxonomy='category', separator=', ', link='')}
                f = titulo('Fecha', 'span', TEXTO2, 15, '600', 1.4, _element_width='auto')
                f['settings']['__dynamic__'] = {'title': tag('post-date', type='post_date', format='custom', custom_format='j \\d\\e F \\d\\e Y')}
                els[i:i + 1] = [c, f]
                cambios.append('categoría y fecha')
                break
            recorrer(e['elements'])
    recorrer(d['content'])
    css = ('/* Categoría con su pastel (clase category-<slug> de la entrada); «Sin categoría» no se muestra */\n' + ''.join(
        f'.category-{c["id"]} .mk-no-cat .elementor-heading-title {{ background: {PASTEL[c["color"]]} !important; }}\n'
        for c in n['categorias']) + '.category-sin-categoria .mk-no-cat { display: none; }\n'
        + '/* Enlaces del texto con el violeta del Design System (no el rosado del tema) */\n'
        + '.elementor-widget-theme-post-content a { color: #6B5BD6; text-decoration: underline; text-underline-offset: 3px; }\n'
        + '.elementor-widget-theme-post-content a:hover { color: #231B2B; }\n')
    if not isinstance(d.get('page_settings'), dict):
        d['page_settings'] = {}
    if d['page_settings'].get('custom_css') != css:
        d['page_settings']['custom_css'] = css
        cambios.append('CSS por categoría')
    repetidos = ids_unicos(d['content'])
    if repetidos:
        cambios.append(f'{repetidos} ids repetidos')
    ruta.write_text(json.dumps(d, ensure_ascii=False, indent=1))
    print('Noticia:', ', '.join(cambios) or 'sin cambios')


completar_noticia()

for nombre, datos in [('loop-noticia', LOOP_NOTICIA), ('home-v13-noticias', HOME), ('loop-noticia-grande', LOOP_GRANDE), ('noticias-v13', PAGINA)]:
    (RAIZ / f'elementor/{nombre}.json').write_text(json.dumps(datos, ensure_ascii=False, indent=1))
    print('Escrito', f'elementor/{nombre}.json')
