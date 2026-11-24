#!/usr/bin/env python3
"""Genera elementor/footer-v13.json: el footer noche de la V13 para el Theme Builder de Elementor Pro.

    python3 scripts/elementor-footer-v13.py

Lee src/data/propuestas/home.json (textos y columnas) y src/data/site.json (dirección, teléfono y horarios), los
mismos del prototipo (src/components/n/NFooter.astro). La suscripción es un widget Formulario de Elementor Pro que guarda
los correos en Elementor › Envíos (no manda correos).
"""
import json, random, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
f = json.loads((RAIZ / 'src/data/propuestas/home.json').read_text())['footer']
site = json.loads((RAIZ / 'src/data/site.json').read_text())
random.seed(31)

NOCHE, AMARILLO, BLANCO, TEXTO2_OSC, LAVANDA = '#231B2B', '#FFE25C', '#FFFFFF', '#D9D3E0', '#B4A5F5'
LINEA = 'rgba(255,255,255,0.18)'

RUTAS = {
    'Horarios y tarifas': '/visitanos/#horarios', 'Cómo llegar': '/visitanos/#llegar', 'Servicios': '/visitanos/#servicios',
    'Accesibilidad': '/visitanos/#accesibilidad', 'Programación': '/agendate/', 'Cine Domo': '/agendate/#programacion',
    'Colegios y universidades': '/ven-en-grupo/#colegios', 'Cumpleaños': '/ven-en-grupo/#cumpleanos',
    'Empresas y eventos': '/ven-en-grupo/#empresas', 'MPA': '/ven-en-grupo/#mpa',
    'Programas y proyectos': '/descubre/#programas', 'Recursos educativos': '/descubre/#recursos', 'Noticias': '/noticias/',
    'Patrocinios y alianzas': '/crea-con-maloka/#patrocinios', 'Experiencias museográficas': '/crea-con-maloka/#museografia',
    'Maloka viajera': '/crea-con-maloka/#viajera',
}
TITULOS = {'Visítanos': '/visitanos/', 'Agéndate': '/agendate/', 'Ven en grupo': '/ven-en-grupo/',
           'Descubre': '/descubre/', 'Crea con Maloka': '/crea-con-maloka/'}


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


def tipo(tam, peso='400', alto=1.4, pre='typography', mov=None, tab=None):
    t = {f'{pre}_typography': 'custom', f'{pre}_font_family': 'Montserrat', f'{pre}_font_size': px(tam),
         f'{pre}_font_weight': peso, f'{pre}_line_height': px(alto, 'em')}
    if tab: t[f'{pre}_font_size_tablet'] = px(tab)
    if mov: t[f'{pre}_font_size_mobile'] = px(mov)
    return t


def cont(titulo, hijos, interno=True, **s):
    base = {'_title': titulo, 'content_width': 'full', 'flex_direction': 'column', 'padding': caja(0)}
    base.update(s)
    return {'id': nid(), 'elType': 'container', 'settings': base, 'elements': hijos, 'isInner': interno}


def widget(tipo_w, **s):
    return {'id': nid(), 'elType': 'widget', 'settings': s, 'elements': [], 'widgetType': tipo_w}


def enlace(url):
    return {'url': url, 'is_external': '', 'nofollow': '', 'custom_attributes': ''}


def lista(items, tam=14, color=TEXTO2_OSC, inline=False):
    """Lista de iconos sin icono: enlaces que se ponen amarillos en hover."""
    s = {'icon_list': [{'_id': nid(), 'text': t, 'selected_icon': {'value': '', 'library': ''}, 'link': enlace(u)} for t, u in items],
         'space_between': px(6), 'text_color': color, 'text_color_hover': AMARILLO, 'text_indent': px(0),
         **tipo(tam, '400', 1.45, pre='icon_typography'),
         'custom_css': 'selector .elementor-icon-list-icon { display: none; }\n'}
    if inline:
        s['view'] = 'inline'
        s['space_between'] = px(24)
    return widget('icon-list', **s)


# ---------- Arriba: frase grande y suscripción ----------
form = widget('form',
    form_name='Suscripción a la programación',
    form_fields=[{'_id': nid(), 'custom_id': 'correo', 'field_type': 'email', 'field_label': 'Recibe la programación en tu correo',
                  'placeholder': f['placeholder'], 'required': 'true', 'width': '100'}],
    show_labels='yes', input_size='md', button_text=f['enlace'], button_width='', button_align='end',
    selected_button_icon={'value': 'fas fa-arrow-right', 'library': 'fa-solid'}, button_icon_align='row-reverse',
    button_icon_indent=px(8),
    submit_actions=['save-to-database'],
    success_message='¡Listo! Te escribiremos con la programación de Maloka.',
    error_message='No pudimos guardar tu correo. Inténtalo de nuevo.',
    required_field_message='Escribe tu correo.', invalid_message='Escribe un correo válido.',
    custom_messages='yes',
    label_color=LAVANDA, **tipo(16, '600', 1.3, pre='label_typography'),
    field_text_color=BLANCO, **tipo(18, '400', 1.3, pre='field_typography'),
    field_background_color='rgba(0,0,0,0)', field_border_color=BLANCO, field_border_width=caja(0, 0, 2, 0),
    field_border_radius=caja(0),
    button_background_color='rgba(0,0,0,0)', button_text_color=BLANCO, button_background_hover_color='rgba(0,0,0,0)',
    button_hover_color=AMARILLO, **tipo(16, '700', 1.2, pre='button_typography'), button_border_radius=caja(0),
    button_text_padding=caja(0),
    custom_css=(
        '/* Campo con línea inferior y «Suscribirme →» en la misma línea, como en el prototipo */\n'
        'selector .elementor-form-fields-wrapper { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; '
        'margin: 0 !important; border-bottom: 2px solid #fff; }\n'
        'selector .elementor-field-group { padding: 0 !important; margin: 0 !important; width: auto !important; }\n'
        'selector .elementor-field-group-correo { grid-column: 1 / -1; grid-row: 1; display: grid; gap: 10px; }\n'
        'selector .elementor-field-group-correo .elementor-field-label { margin-bottom: 0; }\n'
        'selector .elementor-field-group-correo .elementor-field { height: 56px; padding: 0 140px 0 0 !important; border: 0 !important; background: transparent !important; box-shadow: none !important; }\n'
        'selector .elementor-field::placeholder { color: #9A93A3; opacity: 1; }\n'
        'selector .e-form__buttons, selector .elementor-field-type-submit { grid-column: 2; grid-row: 1; align-self: end; height: 56px; display: flex; align-items: center; }\n'
        'selector .elementor-button { min-height: 44px; padding: 0 !important; }\n'
        'selector .elementor-button-icon { transition: transform .15s; }\n'
        'selector .elementor-button:hover .elementor-button-icon { transform: translateX(4px); }\n'
        'selector .elementor-field:focus-visible, selector .elementor-button:focus-visible { outline: 3px solid #B4A5F5; outline-offset: 2px; }\n'
        'selector .elementor-message { color: #fff; font: 600 14px Montserrat, sans-serif; margin-top: 10px; }\n'
        'selector .elementor-message::before { display: none; }\n'
        '@media (max-width: 767px) { selector .elementor-field-group-correo .elementor-field { padding-right: 120px !important; } }\n'))

arriba = cont('Footer · suscripción', [
    widget('heading', title=f['titulo'], header_size='p', title_color=AMARILLO, **tipo(40, '700', 1.1, tab=34, mov=28),
           custom_css='selector { flex: 1 1 0; min-width: 280px; }\n'),
    cont('Formulario', [form], custom_css='selector { flex: 1 1 0; min-width: 280px; }\n'),
], flex_direction='row', flex_direction_tablet='column', flex_align_items='flex-end', flex_align_items_tablet='stretch',
    flex_gap=gap(32, 64))

# ---------- Columnas: marca y mapa de sitio ----------
h = site['horarios']
marca = cont('Footer · marca y contacto', [
    widget('theme-site-logo', width=px(52), align='left', link_to='custom', link=enlace('/'),
           __dynamic__={'image': '[elementor-tag id="" name="site-logo" settings="%7B%7D"]'},
           custom_css='/* El logo del sitio es morado: aquí va en blanco */\nselector img { filter: brightness(0) invert(1); width: 52px; height: auto; }\n'),
    widget('text-editor', editor=f"<p>{site['direccion']}<br><a href=\"tel:{site['telefonoHref']}\">{site['telefono']}</a></p>"
           f"<p>{h['semana']['dias']} {h['semana']['texto']}<br>{h['finde']['dias']} {h['finde']['texto']}</p>",
           text_color=TEXTO2_OSC, **tipo(14, '400', 1.55),
           custom_css=('selector p { margin: 0 0 14px; }\nselector p:last-child { margin: 0; }\n'
                       'selector a { color: #D9D3E0; }\nselector a:hover { color: #FFE25C; }\n')),
], flex_gap=gap(14), css_classes='mk-ft-marca')

columnas = [marca]
for c in f['columnas']:
    columnas.append(cont('Footer · ' + c['titulo'], [
        widget('heading', title=c['titulo'], header_size='p', title_color=BLANCO, link=enlace(TITULOS[c['titulo']]),
               **tipo(14, '700', 1.4), custom_css='selector a:hover { color: #FFE25C; }\n'),
        lista([(l, RUTAS.get(l, '#')) for l in c['links']]),
    ], html_tag='nav', flex_gap=gap(10), css_classes='mk-ft-col'))

cols = cont('Footer · mapa del sitio', columnas, flex_direction='row', flex_direction_mobile='row', flex_wrap='wrap',
            flex_gap=gap(24, 24), padding=caja(40, 0, 0, 0), border_border='solid', border_width=caja(1, 0, 0, 0),
            border_color=LINEA,
            custom_css=('selector > .mk-ft-marca { flex: 1.4 1 0; min-width: 0; }\n'
                        'selector > .mk-ft-col { flex: 1 1 0; min-width: 0; }\n'
                        '@media (max-width: 1024px) { selector > .mk-ft-marca { flex-basis: 100%; } '
                        'selector > .mk-ft-col { flex: 0 0 calc((100% - 48px) / 3); } }\n'
                        '@media (max-width: 767px) { selector > .mk-ft-col { flex: 0 0 calc((100% - 24px) / 2); } '
                        'selector a { overflow-wrap: anywhere; } }\n'))

# ---------- Legal y redes ----------
legal = cont('Footer · legal', [
    widget('heading', title='© 2026 Corporación Maloka', header_size='span', title_color=TEXTO2_OSC, **tipo(13, '400', 1.4)),
    lista([(l, '#') for l in f['legal']], 13, inline=True),
    cont('Redes', [lista([(r['nombre'], r['url']) for r in site['redes']], 13, inline=True)],
         custom_css='selector { margin-left: auto; width: auto; --width: auto; }\n@media (max-width: 767px) { selector { margin-left: 0; } }\n'),
], flex_direction='row', flex_direction_mobile='row', flex_wrap='wrap', flex_align_items='center', flex_gap=gap(8, 24),
    padding=caja(24, 0, 0, 0), border_border='solid', border_width=caja(1, 0, 0, 0), border_color=LINEA,
    custom_css='selector > .elementor-widget { width: auto; }\n')

interior = cont('Footer · contenido', [arriba, cols, legal], content_width='boxed', boxed_width=px(1280),
                flex_gap=gap(56), padding=caja(0, 80), padding_tablet=caja(0, 40), padding_mobile=caja(0, 16))
footer = cont('Footer · Maloka V13', [interior], interno=False, html_tag='footer', background_background='classic',
              background_color=NOCHE, padding=caja(80, 0, 32, 0), padding_mobile=caja(56, 0, 28, 0), flex_gap=gap(0),
              custom_css='selector :focus-visible { outline: 3px solid #B4A5F5; outline-offset: 2px; }\n')

salida = {'title': 'Footer · Maloka V13', 'type': 'footer', 'version': '0.4', 'page_settings': [], 'content': [footer]}
destino = RAIZ / 'elementor/footer-v13.json'
destino.write_text(json.dumps(salida, ensure_ascii=False, indent=1))
print('Escrito', destino.relative_to(RAIZ))
