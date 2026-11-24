# Plantillas de Elementor (V13)

Archivos JSON para importar en WordPress con **Elementor Pro**.

| Archivo | Qué es | Se importa en |
|---|---|---|
| `header-v13.json` | Header: logo, menú y botón «Compra tus entradas» | Plantillas › Theme Builder › Header |
| `footer-v13.json` | Footer con la información de maloka.org: boletín, redes, Maloka, horarios, ubicación, Corporación Maloka, certificaciones y NIT | Plantillas › Theme Builder › Footer |
| `menu-paneles-v13.json` | Los 4 paneles en hueso del mega menú (Visítanos, Ven en grupo, Descubre, Crea con Maloka) | Plantillas › Plantillas guardadas |
| `logo-maloka.svg` / `.png` | Logo de las maquetas, por si el sitio aún no tiene uno | Apariencia › Personalizar › Identidad del sitio |
| `popup-combos.json` | Modal de los combos de TuBoleta | Plantillas › Popups |
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

El prototipo de la modal está en `src/components/n/NPromo.astro` y se ve en
https://ydelriov.github.io/Maloka/seleccion/ (se abre sola; para verla de nuevo, agrega `?promo` a la URL).

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
| 2 | 5 | Cine Domo y Sala Digital | Grilla de 9 afiches cuadrados (5 columnas) con sala, título y ficha |
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
  **Síguenos en** con TikTok, Instagram, Facebook, YouTube, LinkedIn y el canal de WhatsApp (Lista de iconos en línea).
- Grilla de 5 columnas (2 en tablet, 1 en celular): logo blanco y certificaciones ICONTEC ISO 9001 e IQNet; Maloka;
  Horarios; Ubicación (dirección con enlace a Google Maps, teléfono y «¿Cómo llegar?»); Corporación Maloka.
- Abajo: NIT 830.040.745-0, © 2026 Corporación Maloka y Tratamiento de datos.

**Cómo importarlo:** Plantillas › Theme Builder › Footer › **Importar** › `footer-v13.json`, ábrelo, revisa y **Publicar**
con la condición **Todo el sitio**. «¿Cómo llegar?» apunta a `/visitanos/#llegar`; los demás enlaces van a las páginas
actuales de maloka.org.
