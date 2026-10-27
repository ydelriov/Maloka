---
layout: ../../layouts/Guia.astro
title: Guía de construcción en Elementor · Home de Maloka
description: Cómo armar la home de Maloka en WordPress con Elementor Pro, sección por sección, con el Design System de Claude Design.
---

# Construir la home de Maloka en Elementor

Esta guía acompaña la [variante Elementor](../) del prototipo. Ahí, el botón **Estructura** de la barra inferior
marca cada contenedor y widget con el nombre que tiene en Elementor.

Todo se arma con **WordPress + Elementor Pro** (versión 3.20 o superior), **contenedores flexbox y grid** y los widgets nativos. Para los tipos de
contenido se usa **ACF** (gratis desde la 6.1 registra tipos de contenido y taxonomías). No hacen falta
complementos de terceros para Elementor.

## 1. Ajustes del sitio (Site Settings)

### Colores globales

| Nombre en Elementor | Valor | Uso |
|---|---|---|
| Primario · Violeta 700 | `#472066` | Botón primario, iconos, acción |
| Secundario · Violeta 500 | `#642D90` | Enlaces y eyebrows |
| Texto | `#1F1428` | Títulos y texto principal |
| Acento · Amarillo | `#FFE200` | Solo el botón destacado del hero |
| Texto 2 | `#5B5366` | Descripciones |
| Borde | `#ECE6F2` | Líneas y divisores |
| Fondo alterno | `#FBF9FD` | Franja de la agenda |
| Fondo tonal · Violeta 50 | `#F5F0FA` | Cuadros de icono, filtros, tarjeta de horarios |
| Violeta 100 / 200 | `#EBE1F4` / `#D6C4E8` | Texto claro sobre violeta |
| Violeta 800 / 900 | `#341749` / `#1F0E2C` | Hover del primario y footer |
| Fondo del hero | `#141E27` | Color detrás del banner |
| Por validar · fondo / texto | `#FFF7C2` / `#8A6A00` | Etiquetas de contenido sin confirmar |

### Fuentes globales

Montserrat desde Google Fonts (o subida localmente), solo pesos 400, 600 y 700. Sin mayúsculas sostenidas ni cursivas.

| Estilo | Escritorio | Tablet | Móvil | Peso | Interlineado |
|---|---|---|---|---|---|
| Display (H1 del hero) | 64 | 50 | 38 | 700 | 1.08 · espaciado −0.025em |
| H2 | 40 | 33 | 28 | 700 | 1.15 |
| H3 | 28 | 24 | 21 | 600 | 1.25 |
| H4 (título de tarjeta) | 22 | 20 | 18 | 600 | 1.3 |
| H5 | 18 | 17 | 16 | 600 | 1.35 |
| Lead | 20 | 19 | 18 | 400 | 1.5 |
| Cuerpo | 16 | 16 | 16 | 400 | 1.6 |
| Pequeño | 14 | 14 | 14 | 400 / 600 | 1.5 |
| Eyebrow | 14 | 14 | 14 | 600, color Secundario | 1.4 |

### Diseño (Layout)

- **Ancho del contenido:** 1280 px.
- **Relleno de los contenedores en caja:** 80 px a los lados en escritorio, 40 en tablet y 16 en móvil.
- **Espacio entre secciones:** 112 px en escritorio, 80 en tablet y 56 en móvil.
- **Breakpoints:**
  - Móvil: 767 px.
  - Tablet: 1024 px.
  - Activa también **Tablet extra en 1200 px**: el menú pasa a desplegable desde ese ancho, porque los cinco ítems y el botón no caben por debajo.

### Botones (Theme Style › Buttons y estilos guardados)

Todos tienen forma de píldora (radio 999), Montserrat 700, **sin sombra** y una altura de 44, 52 o 58 px.

| Variante | Fondo | Texto | Hover |
|---|---|---|---|
| Destacado (uno por página) | Amarillo | Violeta 900 | `#D3BB03` |
| Primario | Violeta 700 | Blanco | Violeta 800 |
| Secundario | Blanco + borde 1.5 Violeta 700 | Violeta 700 | Violeta 50 |
| Tonal | Violeta 50 | Violeta 700 | Violeta 100 |
| Contorno invertido (sobre foto o violeta) | Transparente + borde 1.5 blanco | Blanco | blanco al 12 % |
| Enlace | Ninguno | Violeta 500, con flecha | La flecha se mueve 4 px |

**No hay botones blancos rellenos.**

### CSS personalizado del kit (Site Settings › Custom CSS)

Elementor no trae estas tres cosas, así que van en el CSS del kit:

```css
/* Foco visible del Design System */
:focus-visible { outline: 3px solid #B897D6; outline-offset: 3px; }
.mk-oscuro :focus-visible { outline-color: #fff; }

/* Tarjeta de acción: zoom suave de la imagen al pasar el mouse */
.mk-tarjeta-accion .elementor-widget-image img { transition: transform .3s cubic-bezier(.2,.7,.2,1); }
.mk-tarjeta-accion:hover .elementor-widget-image img { transform: scale(1.04); }
@media (prefers-reduced-motion: reduce) { .mk-tarjeta-accion:hover .elementor-widget-image img { transform: none; } }

/* Header fijo: sombra solo después de hacer scroll */
.elementor-sticky--effects { box-shadow: 0 4px 12px rgba(31,14,44,.08), 0 20px 36px -14px rgba(31,14,44,.18); }
```

## 2. Contenido en WordPress

| Tipo | Cómo se crea | Campos (ACF) | Taxonomía |
|---|---|---|---|
| Experiencias | Tipo de contenido `experiencia` | `meta` (texto corto: «Incluido con la entrada») | `tipo` (Cine Domo, Salas, Laboratorios) |
| Actividades (agenda) | Tipo de contenido `actividad` | `fecha` (selector de fecha, formato `Ymd`), `hora`, `lugar`, `costo` | `categoria_actividad` (Cine, Taller, Experiencia, Familiar…) |
| Noticias | Entradas de WordPress | — | Categorías |
| Descubre y Ven en grupo | Páginas | — | — |

La imagen destacada de cada entrada es la foto de la tarjeta. **Solo fotos reales de Maloka.**

## 3. Plantilla «Tarjeta de acción» (Theme Builder › Loop Item)

Esta plantilla se usa en Experiencias, Agenda, Descubre y Noticias.

- **Contenedor raíz:**
  - Flex columna con gap 16.
  - **Etiqueta HTML `a`** con el enlace dinámico al *post* (toda la tarjeta es un solo enlace).
  - Clase CSS `mk-tarjeta-accion`.
- **Contenedor de imagen:**
  - Posición relativa, radio 20 y desbordamiento oculto.
  - Sombra 2 solo en hover (pestaña Hover del contenedor).
  - Dentro va el widget **Imagen** con la imagen destacada, proporción 4:3 y ajuste *cover*.
- **Etiquetas sobre la imagen:**
  - **Fecha o hora**, arriba a la izquierda:
    - Contenedor en posición absoluta a 12 px de arriba y 12 px de la izquierda, fondo blanco y radio 14.
    - Dos **Títulos** dinámicos: el día en 24/700 Violeta 700 y el mes en 12/600 Texto 2.
  - **Chip de categoría**, arriba a la derecha: **Términos del post** en posición absoluta a 12 px de arriba y 12 px de la derecha, radio 999, 12/700.
- **Textos debajo de la imagen:**
  - **Título** dinámico en H3, con el estilo H4.
  - **Extracto** en Pequeño, Texto 2, limitado a 2 líneas.
  - **Icon List** con hora, lugar y costo (o el campo `meta`), en 14/600.

El color del chip por categoría sale de las clases que WordPress pone en cada tarjeta (por ejemplo `tipo-cine`).
Son una regla por término en el CSS del kit:

```css
.tipo-cine .mk-chip { background: #E1ECFE; color: #002563; }
.tipo-salas .mk-chip { background: #EDEAFF; color: #311B5E; }
.tipo-laboratorios .mk-chip { background: #E8FEEB; color: #004117; }
```

## 4. Header (Theme Builder › Header)

- **Contenedor exterior:**
  - Fondo blanco con un borde inferior de 1 px.
  - **Efectos de movimiento › Sticky: arriba**, con efectos a partir de 24 px de desplazamiento.
- **Contenedor en caja:** flex fila, altura 80 px (72 en Tablet extra y menos), gap 32.
  - **Logo del sitio** a 44 px de alto.
  - **Menú** (widget de mega menú):
    - Cinco ítems. Agéndate es un enlace directo; los demás llevan **contenido desplegable**.
    - Ancho del desplegable: *ancho completo*.
    - Abrir desplegable: *al pasar el mouse*.
    - Breakpoint del menú: **Tablet extra**.
    - En el desplegable móvil, los submenús son acordeones.
  - **Botón** primario pequeño «Compra tus entradas», con icono de boleto, que abre Tuboleta en otra pestaña.
- **Contenido de cada desplegable:**
  - Contenedor grid de 3 columnas (240 px · 1fr · 300 px) con 40 px de relleno arriba y abajo.
  - Columna 1: eyebrow e intro (H5).
  - Columna 2: **Icon Box** en grid de 2 columnas, cada uno con un cuadro de icono tonal de 44 px y radio 14.
  - Columna 3, solo en Visítanos: contenedor tonal con radio 28, horarios en **Icon List** y botón primario.
  - Sombra 3 en el contenedor del desplegable.

## 5. Home, sección por sección

### Hero

- **Contenedor ancho completo:**
  - Fondo: **imagen** `hero-slide-1.jpg`, tamaño *cover*, posición 70 % 50 %.
  - Color de fondo `#141E27`, sin velo.
  - Altura mínima: 640 px en escritorio, 560 en tablet y automática en móvil.
  - Relleno: 96 / 160 px en escritorio y 80 / 136 en tablet. El relleno inferior deja sitio para la tarjeta de visita.
- **Móvil:**
  - Fondo con una versión recortada del banner, de 780 × 600, alineada arriba y al 100 % del ancho.
  - Relleno superior de 292 px para que el texto quede debajo de la figura.
- **Contenedor en caja:**
  - Flex columna con gap 20.
  - Eyebrow (Violeta 200).
  - **Título** H1 con el estilo Display, de máximo 14 caracteres de ancho por línea.
  - Lead.
  - Dos **Botones**:
    - **Destacado** amarillo «Compra tus entradas», el único amarillo de la página.
    - **Contorno invertido** «Planea tu visita», con ancla a `#planea`.
    - En móvil, los dos ocupan el ancho completo.
- **Por qué no hay slider:**
  - Los carruseles de Elementor no traen un botón de pausa, que es obligatorio en WCAG 2.2 si se mueven solos.
  - Un hero fijo carga más rápido.

### Planea tu visita (tarjeta flotante)

- **Contenedor:**
  - ID `planea`.
  - Margen superior negativo: −80 px en escritorio, −64 en tablet y −56 en móvil.
  - Índice z 2.
- **Tarjeta interior:**
  - Fondo blanco, radio 28 (20 en móvil) y **sombra 3**. Es lo único que flota además del header.
  - Relleno de 32 / 40 px.
- **Encabezado:**
  - Contenedor flex fila con un **Título** «Planea tu visita» (H2 con estilo H4) y un botón enlace «Preguntas frecuentes».
  - Línea inferior de 1 px.
- **Contenido:**
  - Contenedor **grid de 4 / 2 / 1 columnas**, con 4 **Icon Box** en vista apilada y alineados a la izquierda: Horarios y tarifas, Cómo llegar, Servicios y accesibilidad, Guía digital.
  - Cada Icon Box termina en un botón enlace.
  - En móvil, cada Icon Box se separa con una línea.

### Vive Maloka (experiencias)

- **Encabezado:** contenedor flex fila (columna en móvil) con:
  - Eyebrow.
  - H2 «Hay muchas formas de vivir la ciencia.».
  - Botón enlace «Ver todas las experiencias».
- **Filtro de taxonomía** sobre `tipo`, conectado al Loop Grid:
  - Estilo de botón tonal pequeño; el seleccionado va en Violeta 700.
  - En móvil, desplazamiento horizontal.
- **Loop Grid:**
  - Fuente: Experiencias, plantilla «Tarjeta de acción».
  - **4 / 2 / 1 columnas**, gap 24 horizontal y 32 vertical.

### Agéndate

- **Contenedor ancho completo:**
  - Fondo alterno con bordes superior e inferior de 1 px.
  - Relleno de 112 / 80 / 56 px.
- **Encabezado:** eyebrow, H2, texto y botón **secundario** «Ver toda la programación».
- **Loop Grid de Actividades:**
  - 4 / 2 / 1 columnas, 4 elementos.
  - En la consulta, escribe el ID `proximas_actividades` y agrega esto al `functions.php` del tema hijo (o con Code Snippets), para mostrar solo las actividades que vienen, ordenadas por fecha:

```php
add_action( 'elementor/query/proximas_actividades', function ( $query ) {
	$query->set( 'meta_key', 'fecha' );
	$query->set( 'orderby', 'meta_value_num' );
	$query->set( 'order', 'ASC' );
	$query->set( 'meta_query', [ [
		'key'     => 'fecha',
		'value'   => wp_date( 'Ymd' ),
		'compare' => '>=',
		'type'    => 'NUMERIC',
	] ] );
} );
```

### Ven en grupo

- **Contenedor grid:**
  - 2 columnas (5fr 7fr), gap 64, centradas verticalmente.
  - 1 columna desde tablet, con gap 40 en tablet y 32 en móvil.
- **Columna 1:** widget **Imagen**.
  - Radio **999 999 28 28**: el arco del domo. Es el único arco de la página.
  - Proporción 4:5, ajuste *cover*.
  - En tablet va centrada al 60 %; en móvil ocupa el ancho completo con proporción 4:3.
- **Columna 2:**
  - Eyebrow, H2 y lead.
  - 4 **Icon Box** horizontales (icono a la izquierda) con enlace en todo el cuadro, separados por líneas de 1 px y con una flecha al final.
  - **Botón** primario «Cotiza tu visita» y la etiqueta «Planes, tarifas y espacios por validar».

### Descubre Maloka

- **Encabezado** con botón enlace «Mira nuestro impacto».
- **Loop Grid de páginas** (o tres contenedores fijos con la misma tarjeta): **3 / 3 / 1 columnas**.
- **Franja de cifras:** contenedor flex fila con línea superior.
  - Cuando haya cifras confirmadas, usa el widget **Contador** (H2, Violeta 700).
  - Hoy muestran «+XX» con la etiqueta «Cifras por validar».

### Crea con Maloka

- **Contenedor en caja:**
  - Fondo Violeta 700.
  - Radio 40 en escritorio, 28 en tablet y 20 en móvil.
  - Relleno de 64 / 48 / 32 px.
  - Grid de 2 columnas (1 desde tablet), con la clase `mk-oscuro` para que el foco sea blanco.
- **Columna 1:**
  - Eyebrow en Violeta 200, H2 en blanco y lead en Violeta 100.
  - Botón **contorno invertido** «Hablemos de tu proyecto».
- **Columna 2:**
  - **Icon List** con las cinco líneas como enlaces, 18/600 en blanco.
  - Iconos en Violeta 200, separadores blancos al 20 % y una flecha al final.

### Noticias

- **Encabezado** con la etiqueta «Contenido de ejemplo» mientras no haya noticias reales.
- **Loop Grid de entradas:** 3 / 3 / 1 columnas, con la fecha de publicación sobre la imagen.

## 6. Footer (Theme Builder › Footer)

- **Contenedor ancho completo** con fondo `#1F0E2C` y la clase `mk-oscuro`.
- **Fila de suscripción:** grid de 2 columnas.
  - Columna 1: H2 con estilo H3 y un texto.
  - Columna 2: widget **Formulario** con un campo de correo de radio 999 y un botón **contorno invertido** «Suscribirme».
  - Acción del formulario: Mailchimp o la herramienta que use Maloka.
- **Columnas de enlaces:**
  - Logo, dirección, teléfono y redes.
  - Cinco **Menús** (uno por sección): 6 columnas en escritorio, 3 en tablet y 2 en móvil.
- **Fila legal:** © Corporación Maloka, Política de privacidad, Tratamiento de datos, PQRSF.

## 7. Antes de publicar

- **Etiquetas «Por validar» y «Contenido de ejemplo»:** se quitan cuando el área responsable confirme:
  - Cifras.
  - Planes y tarifas de grupos.
  - Servicios y accesibilidad.
  - Agenda y noticias reales.
- **Datos reales que no cambian:**
  - Horario: L–V 11:00 a. m.–5:00 p. m.; fines de semana y festivos 9:30 a. m.–6:00 p. m.; venta hasta las 4:00 p. m.
  - Dirección: Carrera 68D #24A-51, Bogotá.
  - Teléfono: (+57) 601 427 2707.
  - Entradas: Tuboleta.
  - Guía digital: Bloomberg Connects.
- **Revisión:**
  - Revisa con teclado: el menú abre con Enter y cierra con Esc, y el foco siempre es visible.
  - Corre Lighthouse en móvil: la meta es 90 o más en rendimiento, accesibilidad y buenas prácticas.
- **Rendimiento:**
  - Activa en Elementor *Optimized DOM Output*, *Improved Asset Loading* y *Lazy load background images*.
  - Sube las fotos en WebP o AVIF.
