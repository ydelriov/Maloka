# Maloka · prototipo navegable de la home

Prototipo responsive de la home de maloka.org en **cuatro variantes de layout** (V4, V5, V6 y Elementor), construido con el
Design System de Claude Design para validar el diseño antes de llevarlo a WordPress + Elementor.

- Publicado: https://ydelriov.github.io/Maloka/
- Variantes: `/v4` Editorial numerada · `/v5` Arcos del domo · `/v6` Panel de visita · `/elementor` lista para construir en WordPress + Elementor Pro
- Guía de construcción en Elementor: `/elementor/guia` (fuente: `src/pages/elementor/guia.md`)
- Prototipo anterior (home navy, Agéndate, Ven en grupo): `/legacy/`

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
    elementor/   ElHeader · ElHero · ElPlanea · ElExperiencias · ElAgenda · ElGrupos · ElDescubre · ElCrea · ElNoticias
    sections/    HeroSlider · VisitPanel · PlaneaVisita · ViveMaloka · Agenda · VenEnGrupo · Descubre · CreaConMaloka · Noticias
  layouts/       Base.astro (SEO, Open Graph, JSON-LD Museum)
  pages/         index (miniaturas) · v4 · v5 · v6 · elementor (+ elementor/guia.md)
public/legacy/   prototipo anterior, servido tal cual
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

## Variante Elementor

`/elementor` usa la misma información y el mismo Design System, pero solo con lo que Elementor Pro hace de forma nativa:
contenedores flex/grid, widget Menú (mega menú), Loop Grid con plantilla de tarjeta, Filtro de taxonomía, Icon Box,
Icon List y Formulario. Los tamaños cambian en escalones en los breakpoints de Elementor (1024 y 767; el menú en 1200,
«Tablet extra»), sin `clamp()` (`src/styles/elementor.css`). El hero es fijo (sin slider) porque los carruseles de
Elementor no traen botón de pausa. El botón **Estructura** de la barra inferior (o `?estructura` en la URL) marca cada
bloque con su contenedor o widget, y la guía detalla ajustes del sitio, tipos de contenido, plantillas y cada sección.

## De componente a Elementor (V4–V6)

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
