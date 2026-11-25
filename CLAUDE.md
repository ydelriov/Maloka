# Instrucciones para Claude en este repositorio

## «Despliégalo» = commit + push + GitHub Pages

Cuando el usuario diga **«despliégalo»** (o «despliega», «súbelo a GitHub Pages», «publícalo»), haz siempre los tres
pasos, sin preguntar:

1. **Commit** de todos los cambios pendientes, con un mensaje claro en español.
2. **Push** a la rama de trabajo de la sesión **y** a `master`
   (`git push origin <rama>` y `git push origin <rama>:master`). GitHub Pages solo publica desde `master`.
3. **GitHub Pages:** sigue la ejecución del flujo «Desplegar en GitHub Pages» (`.github/workflows/pages.yml`) hasta
   que termine. Si falla por un error temporal de GitHub, vuélvelo a lanzar. Confirma al usuario solo cuando el
   flujo termine en verde, con el enlace a la página publicada (https://ydelriov.github.io/Maloka/…).

Antes del commit, corre `npm run build` para no publicar un sitio roto.

## Contexto del proyecto

- Prototipo de la home de maloka.org en Astro; la versión elegida es la **V13** (`src/components/home/V13.astro`),
  publicada sola en https://ydelriov.github.io/Maloka/seleccion/ junto con Visítanos (`/seleccion/visitanos/`), Agéndate,
  Noticias, Ven en grupo (`/seleccion/ven-en-grupo/`) y Crea con Maloka (`/seleccion/crea-con-maloka/` y sus 5
  subpáginas).
- Todo se construirá en **WordPress + Elementor Pro**: las maquetas usan solo patrones que Elementor hace de forma
  nativa, y cada página tiene su JSON importable en `elementor/` (ver `elementor/README.md`).
- Textos en español de Colombia; Design System v3 «Noche y pastel» (`src/styles/noche.css`, README).
- **La última sección de cada página nunca va en noche (#231B2B):** el footer es noche y se unirían. Usa blanco, hueso o
  un pastel (en la maqueta y en el JSON de Elementor).
