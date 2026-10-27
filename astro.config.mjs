// Prototipo de la home de Maloka. GitHub Pages publica en https://ydelriov.github.io/Maloka/
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ydelriov.github.io',
  base: '/Maloka',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  image: { responsiveStyles: false },
  devToolbar: { enabled: false }
});
