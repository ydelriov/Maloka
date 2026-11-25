"""Ajustes de la página Visítanos (Elementor) para que se vea como la maqueta /seleccion/visitanos/.

Se aplica sobre elementor/visitanos-v13-parte1/2/3.json (y sobre la página publicada, que tiene los mismos IDs):
    python3 scripts/elementor-visitanos-ajustes.py               # repo
    python3 scripts/elementor-visitanos-ajustes.py archivo.json  # un volcado {"elements": [...]} de la página
Es idempotente: se puede correr varias veces.
"""
import json, sys, copy

NOCHE, TEXTO2, HUESO, MENTA, AMARILLO = '#231B2B', '#4F4955', '#F4F1EC', '#9FE8C8', '#FFE25C'
CERO = {'unit': 'px', 'top': '0', 'right': '0', 'bottom': '0', 'left': '0', 'isLinked': True}


def px(n): return {'unit': 'px', 'size': n, 'sizes': []}
def caja(t, r, b, l): return {'unit': 'px', 'top': str(t), 'right': str(r), 'bottom': str(b), 'left': str(l), 'isLinked': False}
def tipo(pref, size, weight='400', lh=1.5):
    return {f'{pref}_typography': 'custom', f'{pref}_font_family': 'Montserrat', f'{pref}_font_size': px(size),
            f'{pref}_font_weight': weight, f'{pref}_line_height': {'unit': 'em', 'size': lh, 'sizes': []}}


def nota(id_, texto, icono, color_icono, color_texto, margen=24):
    """Nota pequeña con ícono (Lista de iconos), como las notas de la maqueta."""
    s = {'icon_list': [{'_id': id_[:7], 'text': texto, 'selected_icon': {'value': icono, 'library': 'fa-solid'}, 'link': {'url': ''}}],
         'view': 'traditional', 'icon_color': color_icono, 'text_color': color_texto, 'icon_size': px(16),
         'text_indent': px(8), 'icon_self_vertical_align': 'flex-start', 'icon_vertical_offset': px(3),
         '_margin': caja(margen, 0, 0, 0)}
    s.update(tipo('icon_typography', 14))
    return {'id': id_, 'elType': 'widget', 'widgetType': 'icon-list', 'isInner': False, 'settings': s, 'elements': []}


def fila(id_, icono, hijos, extra=None):
    """Fila de la lista de horarios: ícono + texto, con línea abajo."""
    ic = {'id': id_ + 'i', 'elType': 'widget', 'widgetType': 'icon', 'isInner': False, 'elements': [],
          'settings': {'selected_icon': {'value': icono, 'library': 'fa-solid'}, 'primary_color': NOCHE, 'size': px(20),
                       '_element_width': 'auto', '_flex_size': 'none', '_margin': caja(3, 0, 0, 0)}}
    txt = {'id': id_ + 't', 'elType': 'container', 'isInner': True, 'elements': hijos,
           'settings': {'container_type': 'flex', 'content_width': 'full', 'flex_direction': 'row', 'flex_wrap': 'wrap',
                        'flex_gap': {'column': '6', 'row': '0', 'isLinked': False, 'unit': 'px', 'size': 6},
                        'flex_align_items': 'baseline', 'padding': CERO, '_flex_size': 'custom', '_flex_grow': 1, '_flex_shrink': 1,
                        'custom_css': 'selector { min-width: 0; } selector > .elementor-widget { max-width: 100%; }\n'}}
    s = {'container_type': 'flex', 'content_width': 'full', 'flex_direction': 'row', 'flex_wrap': 'nowrap',
         'flex_align_items': 'flex-start', 'flex_gap': {'column': '10', 'row': '10', 'isLinked': True, 'unit': 'px', 'size': 10},
         'padding': caja(14, 0, 14, 0), 'border_border': 'solid', 'border_width': caja(0, 0, 1, 0), 'border_color': 'rgba(35,27,43,0.25)'}
    s.update(extra or {})
    return {'id': id_, 'elType': 'container', 'isInner': True, 'settings': s, 'elements': [ic, txt]}


def ajustar(raiz):
    idx, padre = {}, {}

    def walk(e, p):
        idx[e['id']] = e; padre[e['id']] = p
        for x in e.get('elements', []): walk(x, e)
    for e in raiz: walk(e, None)

    def S(i): return idx[i]['settings'] if i in idx else {}

    def reemplazar(viejo, nuevos):
        p = padre[viejo]; hermanos = p['elements'] if p else raiz
        k = [x['id'] for x in hermanos].index(viejo)
        hermanos[k:k + 1] = nuevos

    # 1 · Horarios: los dos recuadros a todo el ancho
    for i in ('c03db22b', 'f44868ac'):
        if i in idx: S(i).update(width={'unit': '%', 'size': 40, 'sizes': []}, _flex_size='custom', _flex_grow=1, _flex_shrink=1)
    # Filas «Venta de entradas · Compra con anticipación» y «Cambio de horario» como en la maqueta
    if '7555471a' in idx and 'vh01fila' not in idx:
        venta = idx['7555471a']; aviso = idx['551ef34e']
        venta['settings'].update(_element_width='auto', **tipo('typography', 17, '700'))
        anticip = {'id': 'vh01comp', 'elType': 'widget', 'widgetType': 'heading', 'isInner': False, 'elements': [],
                   'settings': {'title': '· Compra con anticipación: las entradas pueden agotarse en taquilla.', 'header_size': 'div',
                                'title_color': NOCHE, '_element_width': 'auto', **tipo('typography', 17)}}
        aviso['settings']['__dynamic__']['title'] = aviso['settings']['__dynamic__']['title'].replace(
            '%5Bmaloka_aviso%5D', '%5Bmaloka_aviso%20etiqueta%3D%5C%22Cambio%20de%20horario%5C%22%5D')
        aviso['settings']['title'] = '<b>Cambio de horario · 26 de noviembre:</b> Cerrado todo el día.'
        f1 = fila('vh01fila', 'fas fa-ticket-alt', [venta, anticip], {'padding': caja(0, 0, 14, 0)})
        # Si no hay aviso, Elementor no imprime el título y la fila se esconde
        f2 = fila('vh02fila', 'fas fa-bolt', [aviso], {'custom_css': 'selector:not(:has(.elementor-widget-heading)) { display: none; }\n'})
        reemplazar('551ef34e', [])
        reemplazar('7555471a', [f1, f2])
        lista = idx['bdbc1bd6']['settings']
        lista['icon_list'] = [x for x in lista['icon_list'] if not x['text'].startswith('Compra con anticipación')]
        lista['_margin'] = caja(14, 0, 0, 0)

    for i in ('vh01filai', 'vh02filai'):
        if i in idx: S(i)['_flex_size'] = 'none'
    for i in ('vh01filat', 'vh02filat'):
        if i in idx:
            S(i).pop('width', None)
            S(i).update(_flex_size='custom', _flex_grow=1, _flex_shrink=1,
                        custom_css='selector { min-width: 0; } selector > .elementor-widget { max-width: 100%; }\n')

    # 2 · Textos de introducción con el ancho de la maqueta (620 px)
    for i in ('9601e3e1', '5f11751c', '18fc9697', 'bc024ffd'):
        if i in idx: S(i).update(_element_width='initial', _element_custom_width=px(620),
                                 _element_custom_width_mobile={'unit': '%', 'size': 100, 'sizes': []})

    # 3 · Notas con ícono de información
    if '84d06875' in idx:
        reemplazar('84d06875', [nota('84d06875', 'Los precios pueden cambiar. Confirma el valor final en TuBoleta antes de pagar.',
                                     'fas fa-info-circle', TEXTO2, TEXTO2, 32)])
    if 'bda7818b' in idx:
        reemplazar('bda7818b', [nota('bda7818b', 'Las rutas y paradas de TransMilenio y el SITP pueden cambiar. Antes de salir, revisa tu recorrido en TransMiApp o en Google Maps.',
                                     'fas fa-info-circle', TEXTO2, TEXTO2, 16)])
    if '20533e67' in idx: S('20533e67')['_margin'] = caja(32, 0, 0, 0)

    # 4 · Funciones: el afiche de Conciertos y artes escénicas a 200 px, como en la maqueta
    if '3335ffaa' in idx: S('3335ffaa').update(width=px(200), _flex_size='none')
    if 'd1c741f0' in idx: S('d1c741f0').update(_flex_size='grow')
    if 'd1b9e61e' in idx: S('d1b9e61e').update(**tipo('typography', 24, '700', 1.25))

    # 5 · Cómo llegar: pestañas como botones, rutas como etiquetas, mapa con fondo hueso
    if 'c65b36f3' in idx:
        t = S('c65b36f3')
        for tab in t['tabs']:
            c = tab['tab_content']
            for titulo in ('Rutas troncales', 'Rutas'):
                marca = f'<p><strong>{titulo}:</strong> '
                if marca in c:
                    antes, rutas = c.split(marca, 1)
                    rutas = rutas.replace('</p>', '')
                    # «291 · Terminal Norte – Makro – Tierra Buena · C27 · …»: cada ruta empieza con un código sin espacios
                    trozos = [x.strip() for x in rutas.split(' · ')]
                    items = []
                    for x in trozos:
                        if items and (' ' in x or not any(ch.isdigit() for ch in x)):
                            items[-1] += ' · ' + x
                        else:
                            items.append(x)
                    c = antes + f'<p class="maloka-k">{titulo}</p><ul class="maloka-rutas">' + ''.join(f'<li>{x}</li>' for x in items) + '</ul>'
            c = c.replace('<p><strong>Paraderos</strong></p>', '<p class="maloka-k">Paraderos</p>')
            c = c.replace('<p><strong>Tarifas del parqueadero</strong></p>', '<p class="maloka-k">Tarifas del parqueadero</p>')
            tab['tab_content'] = c
        t['custom_css'] = (
            'selector .elementor-tabs-wrapper { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }\n'
            'selector .elementor-tab-desktop-title { display: flex; align-items: center; min-height: 44px; padding: 0 16px; border: 2px solid #231B2B !important; color: #231B2B; }\n'
            'selector .elementor-tab-desktop-title.elementor-active { background: #231B2B; color: #FFE25C !important; }\n'
            'selector .elementor-tab-desktop-title::before, selector .elementor-tab-desktop-title::after { display: none !important; }\n'
            'selector .elementor-tab-desktop-title:hover { background: #FFE25C; color: #231B2B; }\n'
            'selector .elementor-tab-desktop-title.elementor-active:hover { background: #231B2B; color: #FFE25C !important; }\n'
            'selector .elementor-tabs-content-wrapper, selector .elementor-tab-content { border: 0 !important; }\n'
            'selector .elementor-tab-content { padding: 24px; background: #F4F1EC; }\n'
            'selector .elementor-tab-content > p:first-child strong { font-size: 22px; line-height: 1.25; }\n'
            'selector .elementor-tab-content p, selector .elementor-tab-content ol, selector .elementor-tab-content ul { margin: 0 0 10px; }\n'
            'selector .elementor-tab-content ol, selector .elementor-tab-content ul { padding-left: 20px; }\n'
            'selector .elementor-tab-content ul { list-style: square; }\n'
            'selector .maloka-k { margin: 6px 0 4px !important; font-size: 13px; font-weight: 700; color: #6B5BD6; }\n'
            'selector ul.maloka-rutas { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; margin: 0; }\n'
            'selector .maloka-rutas li { padding: 4px 10px; background: #fff; font-size: 14px; font-weight: 700; line-height: 1.4; }\n'
            '@media (max-width: 767px) { selector .elementor-tab-mobile-title { border: 2px solid #231B2B !important; margin-bottom: 8px; } selector .elementor-tab-mobile-title.elementor-active { background: #231B2B; color: #FFE25C !important; } }\n')
    if 'e12bf8e8' in idx: S('e12bf8e8').update(background_background='classic', background_color=HUESO)
    if 'b9c64800' in idx: S('b9c64800').update(height=px(620))

    # 6 · Servicios: etiqueta «1 hora gratis» y enlaces como en la maqueta
    if 'b2b00c5f' in idx:
        S('b2b00c5f')['description_text'] = ('<span class="maloka-tag">1 hora gratis para visitantes</span><br>'
                                              'Al respaldo de Maloka, con entrada por la Calle 25. Espacios para carros, motos y bicicletas.<br>'
                                              '<a class="maloka-enlace" href="#llegar">Tarifas del parqueadero →</a>')
    if 'f4e4eed9' in idx:
        S('f4e4eed9')['description_text'] = ('Recorre Maloka desde tu celular con Bloomberg Connects. Es gratuita.<br>'
                                              '<a class="maloka-enlace" href="https://guides.bloombergconnects.org/es-US/guide/malokaScienceCenter" target="_blank" rel="noopener">Abrir la guía en Bloomberg Connects ↗</a>')

    if '08b044bf' in idx:
        S('08b044bf')['custom_css'] = (
            'selector .maloka-tag { display: inline-block; margin: 4px 0 6px; padding: 2px 8px; background: #9FE8C8; color: #231B2B; font-size: 13px; font-weight: 700; line-height: 1.6; }\n'
            'selector .maloka-enlace { display: inline-block; margin-top: 6px; color: #231B2B; font-weight: 700; text-decoration: none; border-bottom: 2px solid #231B2B; }\n'
            'selector .maloka-enlace:hover { color: #6B5BD6; border-color: #6B5BD6; }\n')

    # 7 · Experiencias: velo oscuro abajo (como la maqueta) y «Todas las experiencias» arriba a la derecha
    for i in ('60011fc8', 'b08640ef', 'f1e86a46', '48781535'):
        if i in idx:
            S(i).update(background_overlay_background='gradient', background_overlay_color='rgba(35,27,43,0.30)',
                        background_overlay_color_stop={'unit': '%', 'size': 30, 'sizes': []},
                        background_overlay_color_b='rgba(35,27,43,0.85)', background_overlay_color_b_stop={'unit': '%', 'size': 100, 'sizes': []},
                        background_overlay_gradient_type='linear', background_overlay_gradient_angle={'unit': 'deg', 'size': 180, 'sizes': []})
    if '53aac2da' in idx: S('53aac2da')['flex_align_items'] = 'flex-start'

    # 8 · Preguntas: solo líneas arriba y abajo, como la maqueta; teléfono en negrilla sin violeta
    if '6abca316' in idx:
        S('6abca316')['custom_css'] = (
            'selector .elementor-accordion { border-top: 2px solid #231B2B; }\n'
            'selector .elementor-accordion .elementor-accordion-item { border: 0 !important; border-bottom: 2px solid #231B2B !important; }\n'
            'selector .elementor-accordion .elementor-tab-title, selector .elementor-accordion .elementor-tab-content { border: 0 !important; }\n'
            'selector .elementor-accordion .elementor-tab-title:hover { background: #FFE25C; }\n'
            'selector .elementor-accordion-icon i { font-size: 16px; }\n'
            'selector .elementor-accordion-icon svg { width: 16px; height: 16px; }\n'
            'selector .elementor-tab-content p { max-width: 62ch; margin: 0; }\n')
    if '5b5c76e1' in idx:
        S('5b5c76e1')['custom_css'] = 'selector a { color: inherit !important; text-decoration: none !important; font-weight: 700; }\n'
    return raiz


if __name__ == '__main__':
    if len(sys.argv) > 1:
        p = sys.argv[1]; d = json.load(open(p))
        ajustar(d['elements'])
        json.dump(d, open(p, 'w'), ensure_ascii=False)
    else:
        # Las 3 partes del repo se ajustan juntas (la fila de horarios está en la parte 1)
        partes = [f'elementor/visitanos-v13-parte{i}.json' for i in (1, 2, 3)]
        docs = [json.load(open(p)) for p in partes]
        for d in docs:
            ajustar(d['content'])
        for p, d in zip(partes, docs):
            open(p, 'w').write(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
