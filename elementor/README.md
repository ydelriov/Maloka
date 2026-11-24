# Plantillas de Elementor (V13)

Archivos JSON para importar en WordPress con **Elementor Pro**.

| Archivo | Qué es | Se importa en |
|---|---|---|
| `header-v13.json` | Header: logo, menú y botón «Compra tus entradas» | Plantillas › Theme Builder › Header |
| `footer-v13.json` | Footer con la información de maloka.org: boletín, redes, Maloka, horarios, ubicación, Corporación Maloka, certificaciones y NIT | Plantillas › Theme Builder › Footer |
| `menu-paneles-v13.json` | Los 4 paneles en hueso del mega menú (Visítanos, Ven en grupo, Descubre, Crea con Maloka) | Plantillas › Plantillas guardadas |
| `logo-maloka.svg` / `.png` | Logo de las maquetas, por si el sitio aún no tiene uno | Apariencia › Personalizar › Identidad del sitio |
| `popup-combos.json` | Modal de los combos de TuBoleta | Plantillas › Popups |
| `acf-evento.json` | Campos de cada evento (tipo de contenido «eventos»): fecha, horario, lugar, acceso, enlace, destacado | ACF › Herramientas › Importar |
| `acf-horarios.json` + `horarios-snippet.php` | Horarios en un solo lugar (página de inicio) para menú, home, Visítanos y footer | ACF › Importar y Code Snippets |
| `agenda-snippet.php` | Ordena la agenda por fecha, oculta los eventos pasados y formatea las fechas | Plugin Code Snippets |
| `visitanos-v13-parte1.json`, `-parte2.json`, `-parte3.json` | Página Visítanos en 3 partes (10 secciones) | Se insertan en orden en la página Visítanos |

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
