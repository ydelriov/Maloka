# Páginas internas ocultas

Visítanos, Agéndate, Ven en grupo, Descubre, Noticias y Crea con Maloka están fuera de `src/pages/` para que no se
publiquen mientras se revisan solo las versiones del home. Para volver a publicarlas:

1. Mueve los `.astro` de esta carpeta a `src/pages/` (las rutas de import no cambian).
2. En `src/lib/rutas.js` pon `MOSTRAR_PAGINAS = true` para que el menú, el footer y las tarjetas vuelvan a enlazarlas.
