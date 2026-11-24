# Plantillas de Elementor (V13)

Archivos JSON para importar en WordPress con **Elementor Pro**.

| Archivo | Qué es | Se importa en |
|---|---|---|
| `header-v13.json` | Header: logo, menú y botón «Compra tus entradas» | Plantillas › Theme Builder › Header |
| `footer-v13.json` | Footer con la información de maloka.org: boletín, redes, Maloka, horarios, ubicación, Corporación Maloka, certificaciones y NIT | Plantillas › Theme Builder › Footer |
| `header-v13-megamenu.json` | Header ya armado con el widget Menú (mega menú) y sus 4 paneles, exportado de pruebas.maloka.org | Plantillas › Theme Builder › Header (reemplaza los pasos 1 y 2 de abajo) |
| `menu-paneles-v13.json` | Los 4 paneles en hueso del mega menú (Visítanos, Ven en grupo, Descubre, Crea con Maloka) | Plantillas › Plantillas guardadas |
| `logo-maloka.svg` / `.png` | Logo de las maquetas, por si el sitio aún no tiene uno | Apariencia › Personalizar › Identidad del sitio |
| `popup-combos.json` | Modal de los combos de TuBoleta | Plantillas › Popups |
| `acf-evento.json` | Campos de cada evento (tipo de contenido «eventos»): fecha, horario, lugar, acceso, enlace, destacado | ACF › Herramientas › Importar |
| `acf-horarios.json` + `horarios-snippet.php` | Horarios en un solo lugar (página de inicio) para menú, home, Visítanos y footer | ACF › Importar y Code Snippets |
| `evento-single-v13.json` | Ficha de cada evento (plantilla del Theme Builder para Eventos) | Plantillas › Theme Builder › Entrada individual |
| `noticia-single-v13.json` + `noticias-snippet.php` | Página de cada noticia (plantilla del Theme Builder para Entradas) y tiempo de lectura | Theme Builder › Entrada individual · Code Snippets |
| `hero-inicio-v13.json` | El hero de Inicio tal como está en pruebas.maloka.org (carrusel propio, horario y un botón por frase) | Se inserta arriba en la home |
| `hero-campanas-v13.json` | Banner de la home: tres frases sobre la foto, cada una con su botón | Plantillas › Importar, y se inserta arriba en la home |
| `agenda-snippet.php` | Ordena la agenda por fecha, oculta los eventos pasados y formatea las fechas | Plugin Code Snippets |
| `visitanos-v13-parte1.json`, `-parte2.json`, `-parte3.json` | Página Visítanos en 3 partes (10 secciones) | Se insertan en orden en la página Visítanos |
| `loop-evento.json`, `loop-evento-destacado.json`, `loop-evento-texto.json`, `loop-evento-pasado.json` | Loop Items de la agenda: fila de Agéndate, destacado, fila de solo texto (home) y evento reciente | Plantillas › Theme Builder › Loop Item (tipo de contenido Eventos) |
| `agendate-v13.json` | Página Agéndate conectada a los eventos: filtro, destacado, próximos, recientes y «Todos los días» | Se inserta en la página Agéndate |
| `noticias-v13.json` · `loop-noticia-grande.json` | Página Noticias (filtro, la más reciente en grande, «Cargar más», para medios) y su tarjeta grande | Se inserta en la página Noticias · Theme Builder › Loop Item |
| `loop-noticia.json` · `home-v13-noticias.json` | Tarjeta de noticia (Loop Item de Entradas) y sección «Noticias» de la home con las 3 últimas | Theme Builder › Loop Item · reemplaza la sección Noticias de Inicio |
| `home-v13-agenda.json` | Sección «Próximos eventos» de la home: los 3 eventos más cercanos | Reemplaza la sección Agenda de Inicio |
| `home-v13-secciones.json` | Las 6 secciones de la home debajo del hero (Imperdibles, Agenda, Ven en grupo, Descubre con mapa, Crea, Noticias) | Plantillas › Plantillas guardadas, y se inserta en Inicio debajo del hero |

## Menú y header · paso a paso

### Antes de importar

1. **Logo:** en Apariencia › Personalizar › Identidad del sitio, sube el logo oficial (o `logo-maloka.png`). El header
   usa el widget «Logo del sitio», que lo toma de ahí.
2. **Menú de WordPress:** en Apariencia › Menús crea un menú llamado **Principal** (slug `principal`) con las 5
   secciones y sus subpáginas (lista en la tabla de abajo). El header lo usa mientras armas el mega menú.
3. **Montserrat:** en Elementor › Ajustes del sitio › Tipografía global, pon Montserrat como fuente principal.

### Paso 1 · Header (funciona apenas se importa)

1. Plantillas › Theme Builder › Header › **Importar** y sube `header-v13.json`.
2. Ábrelo con Elementor y revisa:
   - el widget **Menú de navegación** tenga seleccionado el menú «Principal»;
   - en el contenedor, Avanzado › Efectos de movimiento › **Fijo: Arriba** (si no quedó activado al importar).
3. **Publicar** con la condición **Todo el sitio**.

Con esto ya tienes el header blanco con el subrayado al pasar el mouse, los submenús como lista y la hamburguesa en
tablet y celular.

### Paso 2 · Mega menú con los paneles en hueso

El widget **Menú** (el nuevo, con mega menú) no usa los menús de WordPress: los ítems se escriben en el widget y
cada uno tiene su propio contenedor desplegable. Por eso los paneles vienen aparte, para pegarlos dentro.

1. Plantillas › Plantillas guardadas › **Importar** y sube `menu-paneles-v13.json`.
2. En el header, arrastra el widget **Menú** justo al lado del «Menú de navegación».
3. En el widget Menú › Contenido › **Elementos del menú**, deja 5 ítems: Visítanos, Agéndate, Ven en grupo,
   Descubre y Crea con Maloka. En todos menos Agéndate activa **Contenido desplegable**. A Agéndate ponle el enlace
   a la programación.
4. En el widget Menú › **Ajustes del menú**:
   - Ancho del contenido: **Ancho completo**.
   - Abrir desplegable: **Al pasar el mouse**.
   - Breakpoint del menú: **Tablet** (o «Tablet extra» si activaste el breakpoint de 1200 px).
5. Pega cada panel en su ítem: abre la plantilla «Mega menú · paneles V13», haz clic derecho en el panel
   (por ejemplo «Panel · Visítanos») › **Copiar**; vuelve al header, abre el desplegable de Visítanos, clic derecho
   en su contenedor vacío › **Pegar**. Repite con Ven en grupo, Descubre y Crea con Maloka.
6. Estilo del widget Menú (pestaña Estilo):
   - Texto de los ítems: Montserrat 15 px, peso 600, color `#231B2B`; hover y activo con el mismo color.
   - Indicador: subrayado de 2 px `#231B2B`.
   - Contenedor del desplegable: sin relleno (el panel ya trae el suyo) y sin borde.
7. Borra el widget **Menú de navegación** (el del paso 1) y **Publicar**.

### Ajustes que necesitó el mega menú (ya incluidos en `header-v13-megamenu.json`)

- **El breakpoint de tablet del sitio es 1200 px**, no 1024: todo el CSS personalizado del header y del hero usa
  `max-width: 1200px` / `min-width: 1201px`. Con 1024, entre 1025 y 1200 px el recuadro de horario del hero tapaba el título.
- **Desplegable (escritorio):** el widget lo abre justo debajo de sí mismo (px 59), no del header (80 px). Se baja con
  `top: calc(100% + 21px)` y un puente invisible de 21 px para que no se cierre al bajar el mouse.
- **Sin marco:** cada contenedor del desplegable traía el relleno de 10 px y fondo blanco del Kit; ahora va en 0 y
  transparente, y el panel sin sombra, a todo el ancho como en la maqueta.
- **Menú móvil:** Ajustes del menú › Distancia del desplegable = 26 px (header de 72 px en tablet y celular), para que
  no tape el logo ni el botón.
- Logo a 48 px y sin el espaciado de palabras de 4 px en los ítems.

### Cómo revisar

Compáralo con https://ydelriov.github.io/Maloka/seleccion/:
- Pasa el mouse por Visítanos: panel hueso a ancho completo, enlaces en 2 columnas y el recuadro noche de horarios.
- Cada enlace se llena del pastel de su sección (Visítanos amarillo, Ven en grupo salmón, Descubre menta, Crea
  lavanda).
- Teclado: Tab llega a cada ítem, Enter abre y Esc cierra.
- En celular: logo, botón y hamburguesa en una sola fila.

### Enlaces del menú

| Sección | Subpáginas (slug) |
|---|---|
| Visítanos | Horarios y tarifas `/horarios-y-tarifas/` · Cómo llegar `/como-llegar/` · Servicios `/servicios/` · Accesibilidad `/accesibilidad/` · Experiencias `/experiencias/` · Preguntas frecuentes `/preguntas-frecuentes/` |
| Agéndate | Programación `/programacion/` |
| Ven en grupo | Colegios y universidades `/colegios-y-universidades/` · Cumpleaños `/cumpleanos/` · Empresas y eventos `/empresas-y-eventos/` · MPA `/mpa/` |
| Descubre | Programas y proyectos `/programas-y-proyectos/` · Experiencias `/experiencias/` · Conoce Maloka `/conoce-maloka/` · Recursos educativos `/recursos-educativos/` · Noticias `/noticias/` |
| Crea con Maloka | Patrocinios y alianzas `/patrocinios-y-alianzas/` · Experiencias museográficas `/experiencias-museograficas/` · Acompañamiento pedagógico `/acompanamiento-pedagogico/` · Investigación y consultoría `/investigacion-y-consultoria/` · Maloka viajera `/maloka-viajera/` |

Los paneles ya traen estos enlaces. Si las páginas del sitio usan otros slugs, cámbialos en cada enlace del panel.

## popup-combos.json · Modal de promoción de combos

Modal con dos tarjetas que llevan a TuBoleta:

| Tarjeta | Enlace | Imagen |
|---|---|---|
| Combo familiar | https://www.tuboleta.com/es/eventos/combo-familiar-1 | `…/35c88792-691f-42f6-bef8-28eba1898913_43.jpg` |
| Esfera: un instante de vida | https://www.tuboleta.com/es/eventos/combo-esfera-un-instante-de-vida | `…/266aad39-4d10-452e-8473-1d2499e602c8_241.jpg` |

Estilo de la V13: fondo hueso `#F4F1EC`, velo `rgba(20,10,31,.6)`, esquinas rectas, Montserrat, tarjetas blancas
que se llenan de amarillo `#FFE25C` en hover. En celular las tarjetas se apilan.

### Cómo importarla

1. **Plantillas › Popups › Importar plantillas** y sube `popup-combos.json`. Al importar, Elementor descarga las dos
   imágenes de TuBoleta a la Biblioteca de medios.
2. Abre el popup con Elementor y revisa que las fotos estén en la tarjeta correcta.
3. **Publicar** y configura (estos ajustes no viajan en el JSON):
   - **Condiciones:** Incluir › Página de inicio (o Todo el sitio).
   - **Disparadores:** Al cargar la página, con 1,5 s de retraso.
   - **Reglas avanzadas:** Mostrar el popup hasta: 1 vez por sesión.
4. En **Ajustes del popup › Avanzado**, deja activado "Cerrar con la tecla Esc" y "Cerrar al hacer clic fuera".

### Pendiente de validar

- Los textos de las tarjetas son provisionales: reemplázalos con la descripción y el precio reales de cada combo.
- Si las imágenes no se importan (el servidor no alcanza tuboleta.com), descárgalas, súbelas a Medios y cámbialas en
  cada tarjeta.

La modal se quitó de la maqueta de la V13; el componente sigue en `src/components/n/NPromo.astro` por si se
necesita otra vez.

## visitanos-v13-parte1/2/3.json · Página Visítanos

Es la misma estructura de la maqueta https://ydelriov.github.io/Maloka/seleccion/visitanos/, sección por sección,
solo con contenedores y widgets nativos. Va en 3 partes porque tiene 21 fotos y Elementor puede colgarse si importa
más de ~12 en un solo archivo.

| Parte | # | Sección | Contenedores y widgets |
|---|---|---|---|
| 1 | 1 | Cabecera | Compacta: migas, título H1, texto y el horario en una línea (Lista de iconos en línea) |
| 1 | 2 | Anclas | Contenedor **fijo arriba** (Pro) con enlaces a `#horarios`, `#tarifas`… |
| 1 | 3 | Horarios (`#horarios`) | Dos contenedores pastel + Lista de iconos (venta, cambio de horario y beneficios) |
| 1 | 3b | Guía digital | Franja menta que es todo el enlace a la guía de Maloka en **Bloomberg Connects** (ícono, título, texto y «Abrir la guía de Maloka ↗») |
| 1 | 4 | Planes y tarifas (`#tarifas`) | 3 pasos de color + grupos **Entradas** (4 columnas) y **Combos** (5 columnas). Cada tarjeta es un contenedor-enlace a TuBoleta con la imagen cuadrada de maloka.org, datos y precio |
| 2 | 5 | Funciones (`#funciones`) | **Cine Domo** (5 afiches cuadrados en 5 columnas) y **Conciertos y artes escénicas** (tarjeta horizontal) |
| 3 | 6 | Cómo llegar (`#llegar`) | Widget **Pestañas** (TransMilenio, SITP, Carro y moto, Bicicleta) + **Google Maps** |
| 3 | 7 | Servicios (`#servicios`) | Grilla de 2 columnas con **Caja de icono** |
| 3 | 8 | Accesibilidad (`#accesibilidad`) | Lista de iconos y enlace a la subpágina |
| 3 | 9 | Experiencias (`#experiencias`) | 4 tarjetas con imagen de fondo que llevan a `/visitanos/experiencias/` |
| 3 | 10 | Preguntas (`#preguntas`) | Widget **Acordeón** con FAQ schema (ayuda en Google) |

### Cómo importarla

1. Crea la página **Visítanos** (slug `visitanos`) y ábrela con Elementor.
2. Clic en el ícono de carpeta (Agregar plantilla) › **Importar** y sube `visitanos-v13-parte1.json`; luego **Insertar**.
3. Repite con `-parte2.json` y `-parte3.json`, en ese orden: cada una se agrega debajo de la anterior.
   Elementor descarga las fotos a Medios (las de planes y funciones, de TuBoleta y maloka.org; las de experiencias,
   de GitHub Pages).
4. En Ajustes de la página, plantilla **Elementor ancho completo** (el header y el footer los pone el Theme Builder).
5. Revisa en el modo responsive de Elementor (tablet y celular) y publica.

### Lo que hay que validar o completar
- Planes, fotos y precios se tomaron de maloka.org/horarios-y-tarifas en noviembre de 2026; los precios están
  dentro de cada imagen y en el texto de la tarjeta. Si cambian, hay que actualizar ambos.
- El cambio de horario del 26 de noviembre va en la lista de Horarios: quítalo cuando pase.
- Si el contenedor de anclas no queda fijo, actívalo en Avanzado › Efectos de movimiento › Fijo: Arriba (desplazamiento 80).
- Más adelante, los planes y las funciones pueden salir de tipos de contenido con **Loop Grid** (Pro), para que el
  equipo los actualice sin editar la página.

## home-v13-secciones.json · Home debajo del hero

Se genera con `python3 scripts/elementor-home-v13.py` (antes `npm run build`, porque toma el mapa ya renderizado). Lee
los textos de `src/data/n/home.json`, así que si cambia el contenido del prototipo basta con volver a generarlo.
Sin `--medios`, las fotos apuntan a GitHub Pages; con `--medios archivo.json` usa las de la Biblioteca de medios.

| # | Sección | Contenedores y widgets |
|---|---|---|
| 1 | Imperdibles (hueso) | Contenedor-enlace grande con foto de fondo + tres filas con foto cuadrada |
| 2 | Agenda (blanco) | **Reemplazada por `home-v13-agenda.json`** (Loop Grid conectado a los eventos). La versión estática de este archivo queda solo como referencia |
| 3 | Ven en grupo (noche) | Pista con scroll horizontal (clase `mk-carrusel`) y flechas (HTML con script) |
| 4 | Descubre (menta) | Mapa de territorios (HTML con el SVG) y 4 tarjetas-enlace en 2 columnas |
| 5 | Crea con Maloka (noche) | Enlace grande amarillo y 5 filas-enlace que se llenan de lavanda |
| 6 | Noticias (blanco) | 3 tarjetas-enlace con foto 3:2 y etiqueta |

El CSS común (foco visible y el arreglo del ancho del carrusel del hero) va en **Ajustes de la página › CSS
personalizado**; está en `page_settings.custom_css` del JSON.

Ojo: en los **contenedores** el ajuste de clases se llama `css_classes` (en los widgets es `_css_classes`). El hero de
Inicio se había guardado con `_css_classes` en sus contenedores y por eso el carrusel no funcionaba.

## footer-v13.json · Footer

Con la información del footer de maloka.org (noviembre de 2026):

- Arriba: «Que la curiosidad no se detenga.», enlace **Suscríbete al boletín de Maloka** (formulario de ipzmarketing) y
  **Síguenos en** con los iconos de TikTok, Instagram, Facebook, YouTube, LinkedIn y el canal de WhatsApp (widget Iconos sociales).
- Grilla de 5 columnas (2 en tablet, 1 en celular): logo blanco y certificaciones ICONTEC ISO 9001 e IQNet; Maloka;
  Horarios; Ubicación (dirección con enlace a Google Maps, teléfono y «¿Cómo llegar?»); Corporación Maloka.
- Abajo: NIT 830.040.745-0, © 2026 Corporación Maloka y Tratamiento de datos.

**Cómo importarlo:** Plantillas › Theme Builder › Footer › **Importar** › `footer-v13.json`, ábrelo, revisa y **Publicar**
con la condición **Todo el sitio**. «¿Cómo llegar?» apunta a `/visitanos/#llegar`; los demás enlaces van a las páginas
actuales de maloka.org.

## Agéndate · una agenda que se actualiza sola

Maqueta: https://ydelriov.github.io/Maloka/seleccion/agendate/

**Hoy en maloka.org** cada evento es un contenido del tipo **«eventos»** (menú Eventos del escritorio) con la fecha,
la hora y el lugar escritos dentro del texto, sin campos ni categorías, y la agenda es un Loop Grid que solo muestra el afiche. Por eso no se puede ordenar por fecha,
filtrar por tipo ni sacar los eventos que ya pasaron: hay que hacerlo a mano.

**La propuesta** mantiene lo que el equipo ya hace (crear un evento en el menú Eventos, con su afiche), pero con
campos para la fecha, el horario, el lugar y el acceso, y un tipo de evento. Con eso la página, sola:
- muestra solo los próximos eventos, del más cercano al más lejano;
- saca de «Próximos» cada evento al día siguiente de terminar y lo pasa a «Eventos recientes»;
- filtra por tipo (Cine, Talleres, Charlas, Artes escénicas, Encuentros);
- pone arriba, en grande, el evento marcado como destacado;
- arma el botón correcto: «Inscríbete», «Compra tu entrada» o nada si es entrada libre.

### Configuración (una sola vez)

1. **Plugins:** instala **Advanced Custom Fields** (ACF, gratis) y **Code Snippets** (gratis).
2. **Tipos de evento:** ACF › Taxonomías › Añadir nueva: nombre «Tipos de evento», singular «Tipo de evento»,
   clave `tipo_evento`, tipo de contenido **eventos**, jerárquica. Luego, en Eventos › Tipos de evento, crea
   **Cine**, **Talleres**, **Charlas**, **Artes escénicas** y **Encuentros**.
3. **Campos:** ACF › Herramientas › Importar grupos de campos › sube `acf-evento.json`. Aparece el grupo
   «Datos del evento» en todos los eventos (el archivo usa el tipo de contenido `eventos`, el que ya existe).
4. **Código:** Fragmentos (Code Snippets) › Añadir nuevo › pega `agenda-snippet.php` (sin la primera línea `<?php`
   si el plugin ya la pone), «Ejecutar en todo el sitio» › Guardar y activar.

### La tarjeta del evento (Loop Item)

Plantillas › Theme Builder › **Loop Item** › Agregar nuevo · tipo de contenido **Eventos**. Una fila (como en la
maqueta) con un contenedor-enlace a la entrada y, dentro:

| Columna | Widget y contenido dinámico |
|---|---|
| Fecha (110 px) | Encabezado con Shortcode `[evento_dias]` (56 px, 700) · Encabezado `[evento_fecha formato="M"]` (18 px, 700) · Encabezado `[evento_fecha formato="D"]` (14 px) |
| Afiche (96 px, 3:4) | Imagen destacada |
| Información | Términos (taxonomía Tipos de evento, como etiqueta de color) · Título (24 px, 700) · Lista de iconos con **Campo ACF** `horario` (reloj) y `lugar` (pin) |
| Descripción | **Extracto** como resumen (15 px, gris) y debajo un **Acordeón anidado** de un ítem, «Ver descripción», con el widget **Contenido de la entrada** dentro: el texto completo del evento |
| Acceso (220 px) | Encabezado `[evento_acceso]` (fondo noche, texto amarillo) · Shortcode `[evento_boton]` |

Línea inferior de 2 px noche en el contenedor; en celular, fecha a la izquierda y el resto apilado (sin afiche).
Haz una segunda Loop Item, **«Evento destacado»**, con el afiche grande a la izquierda y fecha, título, extracto,
horario, lugar, acceso y botón a la derecha, sobre fondo hueso.

### La agenda de la home (solo texto)

En la home va la misma agenda, sin afiche: haz una tercera Loop Item, **«Evento · texto»**, igual a la tarjeta pero sin
la columna del afiche ni el acordeón (fecha grande · tipo · título · extracto · horario, lugar y acceso · flecha ↗).
En la home: **Loop Grid** con esa plantilla, fuente Eventos, **Query ID `proximos_eventos`**, 4 por página, el mismo
**Filtro de taxonomía** (Tipos de evento) y el enlace «Toda la programación» a Agéndate. Así la home y Agéndate muestran
los mismos eventos con las mismas etiquetas: la home como texto y Agéndate con afiche y descripción.

### La página Agéndate

| Sección | Widget | Ajustes |
|---|---|---|
| Cabecera | Encabezado H1, texto y enlace al boletín | Igual que Visítanos |
| Filtro | **Filtro de taxonomía** | Conectado al Loop Grid de próximos; taxonomía **Tipos de evento** |
| Destacado | **Loop Grid** con «Evento destacado» | Consulta: fuente **Eventos** · **Query ID `evento_destacado`** · 1 por página |
| Próximos | **Loop Grid** con la tarjeta | 1 columna · fuente Eventos · **Query ID `proximos_eventos`** · 20 por página · mensaje sin resultados: «No hay eventos de este tipo por ahora» |
| Recientes | **Loop Grid** (tarjeta simple, sin afiche) | 3 columnas · fuente Eventos · **Query ID `eventos_pasados`** · 6 por página |
| Todos los días | Filas de enlaces a Visítanos (`#funciones`, `#tarifas`) | Fijo |

La página de cada evento usa la plantilla individual de Eventos que ya tienen (Theme Builder › Single); se le pueden
sumar los mismos campos ACF.

### Cómo publica el equipo un evento

1. Eventos › **Añadir nuevo** (igual que hoy).
2. Título, texto completo y **Extracto** (una o dos líneas: sale en la agenda).
3. **Imagen destacada:** el afiche vertical (1080 × 1440).
4. **Tipo de evento** (por ejemplo, Talleres).
5. «Datos del evento»: fecha, horario, lugar, acceso, valor si es pago, enlace de inscripción o de TuBoleta, y
   «Destacar» si debe salir grande.
6. **Publicar.** Aparece en Agéndate en su lugar por fecha y sale de «Próximos» solo cuando termina.

Para los eventos que ya existen basta con abrir cada uno, llenar «Datos del evento» y asignarle su tipo.

### Así quedó en pruebas.maloka.org

Las plantillas se generan con `python3 scripts/elementor-agenda.py` (lee `src/data/n/agenda.json`).

- **Tipo de contenido y taxonomía** creados con ACF (Eventos `eventos` y Tipos de evento `tipo_evento`, con Cine,
  Talleres, Charlas, Artes escénicas y Encuentros), grupo «Datos del evento» importado de `acf-evento.json` (se agregó
  el lugar «Cine Digital») y los 9 eventos de la maqueta cargados con su afiche, extracto, campos y tipo.
- **Code Snippets** con `agenda-snippet.php` («Agenda de Maloka (Agéndate)»). Cambios frente a la guía:
  - Query ID nuevo **`proximos_home`**: la home muestra los **3** eventos más cercanos, incluido el destacado
    (`proximos_eventos` lo excluye porque en Agéndate va arriba en grande).
  - Shortcode **`[evento_descripcion]`**: «Ver descripción» con `<details>`, en lugar del Acordeón anidado (el
    experimento de elementos anidados no está activo en el sitio).
  - `[evento_dias]` pone los rangos («28–29») en `<span class="maloka-rango">` para mostrarlos más pequeños.
  - La consulta interna del destacado va marcada con `maloka_interno`: sin eso, los Query ID se llamaban a sí mismos
    sin fin y la página se caía por memoria.
- **Loop Items:** «Evento · fila (Agéndate)», «Evento · destacado (Agéndate)», «Evento · texto (home)» y
  «Evento · reciente (Agéndate)». El color de la etiqueta y del hover sale de la clase `tipo_evento-<slug>` que
  WordPress pone en cada ítem (CSS en los ajustes de cada Loop Item).
- **Agéndate** (`/agendate/`) e **Inicio** (sección `#agenda`) usan esas plantillas con el Filtro de taxonomía.
- Al importar a mano, los Loop Grid traen `@loop:<nombre>` en la plantilla: elige la Loop Item correspondiente.

## Horarios en un solo lugar

El horario aparece en el panel del menú (Visítanos), en Visítanos y en el footer. Para que **se cambie una sola vez**:

1. ACF › Herramientas › Importar › `acf-horarios.json`. Aparece el grupo **«Horarios de Maloka»** al editar la
   **página de inicio**: días, hora de apertura y cierre entre semana y fin de semana, venta de entradas hasta, y un
   aviso opcional de cambio de horario.
2. Code Snippets › pega `horarios-snippet.php` › Ejecutar en todo el sitio › Activar.
3. Listo: `header`/`menu-paneles`, `footer-v13.json` y `visitanos-v13-parte1.json` ya traen esos textos conectados con la
   etiqueta dinámica **Shortcode** (`[maloka_horario dia="semana"]`, `[maloka_dias dia="finde"]`, `[maloka_venta]`,
   `[maloka_aviso]`). Si no aparece el valor, en el widget haz clic en el ícono de etiquetas dinámicas › Shortcode y
   escribe el shortcode.

Cuando cambie el horario, o haya un cierre especial, solo se edita la página de inicio › «Horarios de Maloka».
En la maqueta pasa igual: todo sale de `src/data/site.json`.

## Ficha del evento (Theme Builder)

Maqueta: por ejemplo https://ydelriov.github.io/Maloka/seleccion/agendate/la-otra-forma-proyeccion-y-taller-de-escombros/

Hoy la página de cada evento en maloka.org es solo el texto con emojis. Con **una sola plantilla** del Theme Builder,
todos los eventos (los de hoy y los que se creen después) se ven así, sin diseñar cada uno:

| Parte | Qué muestra | De dónde sale |
|---|---|---|
| Migas | Inicio / Agéndate / título | Título del evento (etiqueta dinámica) |
| Cabecera (hueso) | Afiche, tipo, título, resumen | Imagen destacada · `[evento_tipo]` · Título · Extracto |
| Recuadro de datos | Fecha, horario, lugar, acceso | `[evento_fecha_larga]` · `[evento_campo campo="horario"]` · `[evento_campo campo="lugar"]` · `[evento_acceso]` |
| Acciones | «Inscríbete» / «Compra tu entrada» y «Agregar a Google Calendar» | `[evento_boton]` · `[evento_calendario]` (widget Shortcode) |
| Sobre el evento | El texto completo | Contenido del evento (widget Contenido de la entrada) |
| Ten en cuenta (menta) | Aviso según el acceso, entrada y venta de entradas, «Cómo llegar» | `[evento_nota]` · `[maloka_venta]` |
| Otros próximos eventos | 3 eventos | Loop Grid «Evento · texto» con Query ID `proximos_eventos` |

### Cómo instalarla
1. Tener activos `agenda-snippet.php` y `horarios-snippet.php` (Code Snippets) y los campos de `acf-evento.json`.
2. Plantillas › Theme Builder › **Entrada individual** › Importar › `evento-single-v13.json`.
3. Importa también la Loop Item `loop-evento-tarjeta.json` («Evento · tarjeta (ficha)»). La sección «Otros próximos
   eventos» ya trae su **Loop Grid** (3 columnas, Query ID `otros_eventos`, que deja fuera el evento que se está
   viendo); si al importar sale vacío, elige esa plantilla en el widget.
4. **Publicar** con la condición **Eventos › Todos** (o «Todos los Eventos»).
5. Abre cualquier evento para revisar: si un dato no aparece, revisa que el evento tenga llenos sus «Datos del evento».

### Así quedó en pruebas.maloka.org

- Plantilla «Evento · ficha (Maloka V13)» publicada con la condición **Eventos › Todos** (por ejemplo
  `/eventos/la-otra-forma-proyeccion-y-taller-de-escombros/`). Los títulos de la home y de Agéndate llevan ahí.
- `scripts/elementor-agenda.py` completa `evento-single-v13.json` (es idempotente): pone el Loop Grid de «Otros
  próximos eventos», corrige encabezados que traían el color en `header_size`, ajusta la etiqueta del tipo al ancho
  del texto con el pastel de cada tipo, y agrega `[evento_estado]`.
- **Eventos pasados:** muestran «Este evento ya pasó» y ocultan «Inscríbete/Compra tu entrada» y «Agregar a Google
  Calendar» (`maloka_terminado()` en el snippet), como en la maqueta.
- `[evento_boton]` es un botón noche en la ficha (estilo global del snippet); en las listas de Agéndate el Loop Item lo
  deja como enlace subrayado.
- También quedaron activos `acf-horarios.json` (grupo «Horarios de Maloka» en la página de inicio) y el snippet
  «Horarios de Maloka», que usa el «Ten en cuenta» de la ficha (`[maloka_venta]`).

## Noticias (blog)

Maqueta: https://ydelriov.github.io/Maloka/seleccion/noticias/ · en la home, «Noticias» muestra las 3 últimas.

Hoy `/noticias` lleva a la Sala de prensa: un texto largo y un widget Entradas con tarjetas de imagen, título y fecha.
La propuesta usa las **entradas** de siempre (el equipo publica igual que hoy) con una tarjeta más limpia y filtros.

### Configuración (una vez)
1. **Categorías:** en Entradas › Categorías crea **Programación**, **Ciencia** e **Institucional** y asígnalas a las
   entradas (hoy todas están en «Sin categoría», así que no se pueden filtrar). Cada entrada necesita **imagen
   destacada cuadrada** (1080 × 1080, como las de hoy) y **Extracto** de una o dos líneas.
2. **Loop Item «Noticia»** (Theme Builder › Loop Item, tipo Entradas), fondo hueso `#F4F1EC`, hover `#FFF3B0`,
   todo el contenedor es el enlace a la entrada:
   - Imagen destacada, proporción 1:1, ajuste «cubrir».
   - Fila: **Términos de la entrada** (Categorías, como etiqueta de color) + **Fecha** (formato «j \d\e F \d\e Y»).
   - **Título de la entrada** (20 px, 700) · **Extracto** (15 px, gris, 3 líneas) · «Leer noticia →».
3. **Loop Item «Noticia · grande»**: la misma tarjeta en horizontal (imagen 5/12 a la izquierda, texto a la derecha),
   título de 40 px y extracto de 4 líneas.

### La página Noticias
| Sección | Widget | Ajustes |
|---|---|---|
| Cabecera | Encabezado H1 y texto | Igual que Visítanos y Agéndate |
| Filtro | **Filtro de taxonomía** | Categorías, conectado a la grilla |
| La más reciente | **Loop Grid** con «Noticia · grande» | Entradas · 1 por página |
| Las demás | **Loop Grid** con «Noticia» | 3 columnas (2 en tablet, 1 en celular) · **Desplazamiento 1** (para no repetir la primera) · 6 por página · Paginación **«Cargar más al hacer clic»** con el texto «Cargar más noticias» |
| Para medios | Contenedor lavanda | «¿Eres periodista?», correo de prensa y enlace a la Trivia de la semana |

### En la home
Loop Grid con «Noticia», Entradas, **3 por página**, 3 columnas, sin paginación, y el enlace «Ver todas las noticias»
a la página Noticias.

**Así quedó en pruebas.maloka.org:** categorías Programación, Ciencia e Institucional creadas; las 9 entradas recientes de
la sala de prensa de maloka.org importadas con su fecha, categoría, imagen destacada, extracto y texto (meta
`_maloka_fuente` con la URL original); Loop Item «Noticia · tarjeta» (`loop-noticia.json`) y la sección `#noticias` de
Inicio (`home-v13-noticias.json`), generados con `python3 scripts/elementor-noticias.py`. El color de la categoría sale
de la clase `category-<slug>` de cada entrada. La página Noticias y la plantilla de cada noticia también están hechas (ver abajo).

### Así quedó la página Noticias en pruebas.maloka.org

`/noticias/` (generada con `python3 scripts/elementor-noticias.py` → `noticias-v13.json` y `loop-noticia-grande.json`):
- Cabecera hueso (migas, H1 y texto), **Filtro de taxonomía** de Categorías alineado a la izquierda («Sin categoría», la
  de las entradas antiguas, se oculta con CSS) y un solo **Loop Grid** de Entradas: 3 columnas (2 en tablet, 1 en
  celular), 7 por página y **«Cargar más noticias»** (Ajax).
- La más reciente sale en grande con la opción **Plantilla alterna** del Loop Grid: plantilla «Noticia · grande»,
  posición 1, ocupa 3 columnas, «mostrar una vez» y **sin** «posición estática» (con ella la primera noticia salía
  repetida). Así el filtro también pone en grande la más reciente de cada categoría.
- Bloque lavanda «Para medios» con el correo de prensa y la Trivia de la semana.

### Página de cada noticia (Theme Builder)

Maqueta: por ejemplo https://ydelriov.github.io/Maloka/seleccion/noticias/llega-a-maloka-ratos-el-tejido-del-tiempo-la-premiada-obra-internacional-que-enamora-a-grandes-y-chicos/

| Parte | Qué muestra | De dónde sale |
|---|---|---|
| Cabecera (hueso) | Migas, categoría, fecha, tiempo de lectura, título, extracto, compartir; imagen destacada cuadrada a la derecha | Info de la entrada (categoría y fecha) · `[maloka_lectura]` · Título · Extracto · **Botones para compartir** (WhatsApp, Facebook, X, LinkedIn) · Imagen destacada |
| Cuerpo | El texto en una columna de lectura de 720 px (19 px, interlineado amplio) | Contenido de la entrada |
| Pie | «Volver a noticias» y compartir otra vez | Fijo |
| Más noticias | 3 noticias de la misma categoría | Loop Grid «Noticia», fuente **Relacionadas** |

**Cómo instalarla:**
1. Code Snippets › pega `noticias-snippet.php` › Activar.
2. Theme Builder › **Entrada individual** › Importar › `noticia-single-v13.json`.
3. En «Más noticias», reemplaza el texto de ayuda por un **Loop Grid** con «Noticia», fuente **Relacionadas**
   (por Categorías), 3 columnas y 3 por página.
4. **Publicar** con la condición **Entradas › Todas** (la de Eventos ya tiene su propia plantilla).
5. Revisa una entrada larga: los subtítulos (H2/H3), listas, enlaces e imágenes del texto toman el estilo del widget
   Contenido de la entrada; ajusta en Estilo si alguna entrada vieja trae estilos propios.

**Así quedó en pruebas.maloka.org:** plantilla «Noticia · página (Maloka V13)» publicada con la condición **Entradas ›
Todas** y el snippet «Noticias de Maloka (tiempo de lectura)» activo. `scripts/elementor-noticias.py` completa
`noticia-single-v13.json` (idempotente):
- «Más noticias» es un Loop Grid con la tarjeta «Noticia» y el Query ID **`noticias_relacionadas`** (en
  `noticias-snippet.php`): 3 entradas de la misma categoría, sin la actual. La opción «Relacionadas» de Elementor
  caía en las más recientes. Columnas `minmax(0, 1fr)`: con `1fr` una imagen ancha estiraba la página.
- La fila de datos es la etiqueta de la categoría (con su color; «Sin categoría» no se muestra) y la fecha completa;
  el widget Info de la entrada traía un formato de fecha no válido y mostraba la hora.
- Botones de compartir de 44 px: `button_size` se multiplica por 10 y va sin unidad (0.8em los dejaba en 4 px).
- Enlaces del texto en violeta `#6B5BD6` subrayado, no el rosado del tema.
- Los generadores revisan que no haya **ids repetidos**: Elementor arma el CSS con el id de cada elemento y dos
  elementos con el mismo id comparten estilos (los títulos de «Más noticias» no hacían salto de línea por eso).

## Banner de la home (con botón)

Maqueta: https://ydelriov.github.io/Maloka/seleccion/

El banner de siempre (una foto de Maloka y tres frases que rotan, con puntos y pausa) suma **un botón amarillo por
frase**, para llevar a la acción del momento:

| Frase | Botón | Lleva a |
|---|---|---|
| Atrévete a vivir la ciencia. | Compra tus entradas | TuBoleta |
| El universo, sobre tu cabeza. | Ver funciones del Cine Domo | Visítanos › Funciones |
| Aquí está prohibido no tocar. | Conoce las experiencias | Visítanos › Experiencias |

Cuando haya una campaña (una promoción, un episodio del podcast, el boletín), se cambia la frase y el botón de una de
las diapositivas: «Comprar entradas 2x1», «Escuchar en Spotify», «Suscríbete al boletín». El botón siempre dice la
acción, nunca «Ver más».

### En pruebas.maloka.org

La home usa el carrusel propio del hero (tres diapositivas con su foto, puntos y pausa), no el widget Slides: a cada
«Diapositiva N · texto» se le agregó un widget **Botón** («Botón de la frase»): amarillo `#FFE25C`, texto noche, 56 px
de alto, icono a la izquierda y flecha a la derecha (↗ si abre TuBoleta en otra pestaña). Para cambiar el texto o el
enlace se edita ese botón. Exportado en `hero-inicio-v13.json`. Además, los controles del carrusel quedan alineados
con el texto (`max(80px, (100% - 1280px) / 2)`) y sin el fondo rosado que les ponía el tema al hacer clic.

### Cómo se actualiza en Elementor
`hero-campanas-v13.json` es un widget **Slides** (Elementor Pro) con las tres frases sobre la misma foto: cada ítem
tiene **título**, **descripción**, **texto del botón** y **enlace**. Para cambiar una frase o su botón se edita ese
ítem. El horario de hoy va en su propio contenedor debajo del banner. Slides usa puntos y se pausa al pasar el mouse
o al tocarlo (no trae botón de pausa).
