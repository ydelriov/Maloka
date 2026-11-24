<?php
/**
 * Noticias de Maloka · pegar en «Code Snippets» (Ejecutar en todo el sitio).
 *
 *   [maloka_lectura]  → «4 min de lectura» (se calcula con el contenido de la entrada, a 200 palabras por minuto)
 *
 * Se usa en la plantilla de la página de cada noticia (elementor/noticia-single-v13.json).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_shortcode(
	'maloka_lectura',
	function () {
		$palabras = str_word_count( wp_strip_all_tags( (string) get_post_field( 'post_content', get_the_ID() ) ) );
		$minutos  = max( 1, (int) round( $palabras / 200 ) );
		return esc_html( $minutos . ' min de lectura' );
	}
);
