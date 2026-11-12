# Plantillas de Elementor (V13)

Archivos JSON para importar en WordPress con **Elementor Pro**.

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
