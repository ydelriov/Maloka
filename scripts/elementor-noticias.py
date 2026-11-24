#!/usr/bin/env python3
"""Genera las plantillas de Elementor de las noticias (entradas del blog de WordPress).

    python3 scripts/elementor-noticias.py

Escribe en elementor/:
  loop-noticia.json        Loop Item «Noticia»: imagen destacada cuadrada, categoría con su color, fecha, título,
                           extracto (3 líneas) y «Leer noticia →». Toda la tarjeta es el enlace.
  home-v13-noticias.json   Sección «Noticias» de la home: las 3 entradas más recientes (Loop Grid).

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

for nombre, datos in [('loop-noticia', LOOP_NOTICIA), ('home-v13-noticias', HOME)]:
    (RAIZ / f'elementor/{nombre}.json').write_text(json.dumps(datos, ensure_ascii=False, indent=1))
    print('Escrito', f'elementor/{nombre}.json')
