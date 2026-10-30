# Maloka · prototipo navegable de la home

Prototipo responsive de la home de maloka.org en **doce versiones** (V1 a V12), construido con el
Design System de Claude Design para validar el diseño antes de llevarlo a WordPress + Elementor.

- Publicado: https://ydelriov.github.io/Maloka/

## Qué se publica

Solo las versiones del home, en orden, de `/v1/` a `/v12/` (lista en `src/data/variantes.json`): V1 prototipo inicial
(HTML estático en `public/v1/`), V2 editorial numerada, V3 arcos del domo, V4 panel de visita, V5 Elementor, V6 combinada,
V7 galería a sangre, V8 paneles de color, V9 bandas de color, y V10 noche y luz, V11 bloques pastel y V12 explorar
(Design System v3). La barra flotante de todas las pantallas salta entre
ellas; en V1 se inserta con `node scripts/barra-v1.mjs`. Las páginas internas (Visítanos,
Agéndate, Ven en grupo, Descubre, Noticias, Crea con Maloka) están ocultas en `src/ocultas/` y sus enlaces apuntan a
`#`; para volver a publicarlas, ver `src/ocultas/README.md`.

## Comandos

Requiere **Node.js 22.22 o superior**.

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run dev` | Sitio en desarrollo en http://localhost:4321/Maloka/ |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` en http://localhost:4321/Maloka/ |
| `npm run screenshots` | Con el sitio corriendo, captura cada variante en 390, 834 y 1440 px en `screenshots/` y regenera las miniaturas del índice |

Cada push a `master` publica el sitio en GitHub Pages (`.github/workflows/pages.yml`).

## Estructura

```
src/
  styles/        tokens.css (Design System) · base.css · buttons.css
  data/*.json    todo el contenido (los componentes no tienen textos)
  assets/img/    fotografías reales de Maloka (ver README de la carpeta); Astro las convierte a AVIF/WebP
  components/
    ui/          Icon · IconSprite · Logo · Button · Chip · PorValidar · EstadoHoy · SectionHead · ActionCard
    layout/      Header (mega menú + menú móvil) · Footer · VariantSwitcher
    v7/          V7Hero · V7Vive · V7Grupos · V7Descubre · V7Crea
    elementor/   ElHeader · ElHero · ElPlanea · ElExperiencias · ElAgenda · ElGrupos · ElDescubre · ElCrea · ElNoticias
    sections/    HeroSlider · VisitPanel · PlaneaVisita · ViveMaloka · Agenda · VenEnGrupo · Descubre · CreaConMaloka · Noticias
  layouts/       Base.astro (SEO, Open Graph, JSON-LD Museum)
  pages/         index (miniaturas) · v2 … v9 (V1 está en public/v1)
  ocultas/       páginas internas fuera de publicación por ahora
public/v1/       V1, prototipo inicial en HTML, servido tal cual
scripts/         screenshots.mjs (Playwright)
```

Las secciones reciben `variante="v4" | "v5" | "v6"`: cambian la grilla y el tratamiento, nunca la anatomía de
`ActionCard`.

## Reglas del Design System aplicadas

- Solo Montserrat 400/600/700, sin mayúsculas sostenidas ni cursivas.
- Botones en píldora: destacado (amarillo, uno por vista: el del hero), primario, secundario, tonal, contorno
  invertido y enlace. No hay botones blancos rellenos ni sombras en botones.
- Amarillo `#FFE200` una sola vez por vista; violeta-700 `#472066` para la acción.
- Sin degradados ni vidrio; velo plano `rgba(20,10,31,.6)` sobre fotos cuando hace falta contraste.
- Sombras solo en lo que flota: header fijo, mega menú, panel del hero de V6 y tarjetas en hover.
- Arco del domo: máximo uno por sección.
- Foco visible: `3px solid #B897D6` (blanco sobre fondo oscuro).

## Design System v3 «Noche y pastel» · V10, V11 y V12

Tres propuestas de la home con el Design System v3: neutros (noche `#231B2B`, hueso `#F4F1EC`, blanco) en el 70 %,
pasteles (amarillo `#FFE25C`, salmón `#F4A39A`, lavanda `#B4A5F5`, menta `#9FE8C8`, cielo `#9CCBF2`) en el 25 % y
violeta solo en el logo y el foco. Siempre pastel sobre noche o noche sobre pastel, máximo dos pasteles por bloque,
esquinas rectas y **un solo botón** («Compra tus entradas», en el header). El resto de las acciones usa las otras formas
del sistema: enlace con flecha, enlace grande, fila que se llena de pastel, tarjeta con foto, bloque de color completo
como enlace y etiquetas de filtro. Componentes en `src/components/n/`, estilos en `src/styles/noche.css` y contenido
en `src/data/n/home.json`.

| Ruta | Propuesta | Referencia | Cómo se arma en Elementor |
|---|---|---|---|
| `/v10` | Noche y luz | louvre.fr, museoreinasofia.es | Header noche con mega menú (como V6); hero a sangre con el panel de horario de hoy abajo a la derecha; «No te lo pierdas» (una grande y tres) en hueso; agenda en noche con filtros; grupos en filas con relleno salmón; «Más por explorar» en Loop Carousel; Crea como un contenedor lavanda que es todo el enlace |
| `/v11` | Bloques pastel | vangoghmuseum.nl | Hero partido (bloque amarillo con titular gigante + imagen con zoom lento); carrusel sobre noche; bloques salmón (grupos), menta (Descubre con cifras) y noche (Crea con filas); titulares con barrido al entrar |
| `/v12` | Explorar | nhm.ac.uk, museoreinasofia.es | Casi sin botones: «No te lo pierdas» como carrusel de fotos grandes con ↗, «Esta semana» en filas con fecha grande y filtros, grupos en carrusel de tarjetas altas sobre noche, Descubre con cifras y filas, Crea en un bloque cielo con enlaces grandes |

| Pieza | Elementor |
|---|---|
| `NHeader` (misma estructura que V6) | Theme Builder › Header: Logo, widget Menú en modo mega menú (cada ítem abre un contenedor a ancho completo con Icon Box en cuadros pastel y el horario en un recuadro noche) y un Botón; ≤ 1200 px, desplegable con acordeones |
| `NHorario` (horario de hoy) | Contenedor noche en posición absoluta (abajo a la derecha) dentro del hero; el estado «Abierto ahora» va en un widget HTML con el script de hora de Bogotá |
| `NHero` | Carrusel anidado con fundido y Efectos de movimiento › Entrada; en la variante partida, contenedor de 2 columnas con fondo amarillo |
| `NCarrusel` + `NCardFoto` | Loop Carousel con una plantilla de Loop Item: imagen de fondo, superposición plana, título y icono ↗; todo el contenedor como enlace |
| `NActividad` | Loop Grid de la agenda y noticias: fecha y categoría en posición absoluta sobre la foto |
| `NFiltros` | Taxonomy Filter de Elementor Pro conectado al Loop Grid (Hoy / Fin de semana) |
| `NFilas` | Contenedores con borde inferior de 2 px, todo el contenedor como enlace y color de fondo pastel en hover |
| Bloque E (Crea en V10) | Contenedor de ancho completo con enlace y cambio de color de fondo en hover |
| Aparición al hacer scroll | Efectos de movimiento › Animación de entrada («Fade In Up» y, para el barrido, CSS personalizado con `clip-path`) |
| `NFooter` | Theme Builder › Footer con Formulario de un campo (línea inferior, sin caja) |

## Nueva dirección · V7, V8 y V9

Tres propuestas de la home con la dirección aprobada tras la revisión: el violeta solo en detalles, fondo hueso
`#F4F1EC` y tintes de la paleta de experiencias, fotos y bloques rectos (radio 0), un solo botón («Compra tus
entradas» en el menú) y enlaces de texto subrayados con flecha. Componentes en `src/components/p/`, estilos en
`src/styles/propuestas.css` y contenido en `src/data/propuestas/home.json`.

| Ruta | Propuesta | Cómo se arma en Elementor |
|---|---|---|
| `/v7` | P1 · Galería a sangre | Contenedores de ancho completo con imagen de fondo, superposición plana en la mitad inferior y el contenedor completo como enlace; agenda y noticias con Loop Grid |
| `/v8` | P2 · Paneles de color | Fondo hueso en el cuerpo; cada panel es un contenedor con color de fondo y **Efectos de movimiento › Sticky: arriba** con un desplazamiento distinto (24, 100, 176, 252 px) y «Sticky en: escritorio y tablet»; Loop Grid para agenda y noticias |
| `/v9` | P3 · Bandas de color | Un contenedor de ancho completo por sección con su color global; listas con Icon List o contenedores con borde inferior de 1.5 px; Loop Grid para agenda y noticias |

Piezas comunes: `PHeader` (Theme Builder › Header con el widget Menú y un solo Botón), `PHero` (Carrusel anidado con
fundido; la pausa va en un widget HTML), `PCard` (plantilla de Loop Item: imagen sin radio, fecha y categoría en
posición absoluta, todo el contenedor como enlace), `PLink` (Botón con estilo de enlace: sin fondo, borde inferior de
2 px e icono de flecha) y `PFooter` (Theme Builder › Footer con Formulario de un campo).

## V5 · Elementor

`/v5` (Elementor) usa la misma información y el mismo Design System, pero solo con lo que Elementor Pro hace de forma nativa:
contenedores flex/grid, widget Menú (mega menú), Loop Grid con plantilla de tarjeta, Filtro de taxonomía, Icon Box,
Icon List y Formulario. Los tamaños cambian en escalones en los breakpoints de Elementor (1024 y 767; el menú en 1200,
«Tablet extra»), sin `clamp()` (`src/styles/elementor.css`). El hero es fijo (sin slider) porque los carruseles de
Elementor no traen botón de pausa. 

## De componente a Elementor (V2–V4)

| Componente | En Elementor |
|---|---|
| `tokens.css` | **Site Settings › Global Colors / Global Fonts**: violeta-700 como color primario, neutro-900 como texto, estilos tipográficos Display, H1–H5, Lead, Body, Small y Caption con los tamaños de escritorio/tablet/móvil |
| `Button` | Widget **Button** con estilos guardados por variante (o clases globales); radio 999, alturas 44/52/58 |
| `Chip`, `PorValidar` | Widget **Text** o **Heading** pequeño dentro de un contenedor con fondo y radio 999 |
| `ActionCard` | **Loop Item** (Elementor Pro) con contenedor de imagen 4:3, radio 20, imagen destacada, campos para fecha/hora y categoría posicionados en absoluto, título H4 y extracto; todo el contenedor con enlace. Se alimenta de un CPT (actividades, experiencias, noticias) con **Loop Grid** |
| `SectionHead` | Contenedor flex con **Heading** (eyebrow como `p`, título como `h2`) y **Button** |
| `Header` + mega menú | **Theme Builder › Header** con el widget **Mega Menu** (contenedores por ítem) y el **Nav Menu** en móvil; *sticky* con efecto de sombra al hacer scroll |
| `HeroSlider` | Widget **Slides** o **Loop Carousel** con imagen de fondo, autoplay 7 s, efecto *fade* y flechas/puntos; agregar un botón de pausa (Elementor no lo trae: HTML o widget de terceros) |
| `VisitPanel` (V6) | Contenedor con posición absoluta sobre el hero, sombra-4 y radio 28 |
| `EstadoHoy` | Widget **HTML** con el script del horario de hoy (zona America/Bogota) |
| Filtros (V6) y pestañas (V5) | **Loop Grid** con **Taxonomy Filter** |
| Carruseles móviles | **Loop Carousel** solo en móvil, o contenedor con `overflow-x: auto` y *scroll-snap* (CSS personalizado) |
| `Footer` | **Theme Builder › Footer** con **Form** (suscripción) y **Nav Menu** por columna |
| JSON-LD Museum | Plugin SEO (Yoast/Rank Math) con el esquema *Museum* y los horarios reales |

## Por validar

Las etiquetas visibles «Por validar» y «Contenido de ejemplo» marcan: cifras de impacto, planes y espacios de
grupos, detalles de servicios y accesibilidad, la agenda y las noticias. Los enlaces internos apuntan a `#` porque
solo existe la home. La compra de entradas abre Tuboleta en otra pestaña.
