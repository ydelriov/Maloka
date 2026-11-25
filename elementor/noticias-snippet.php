<?php
/**
 * Noticias de Maloka · pegar en «Code Snippets» (Ejecutar en todo el sitio).
 *
 *   [maloka_lectura]  → «4 min de lectura» (se calcula con el contenido de la entrada, a 200 palabras por minuto)
 *
 * Query ID «noticias_relacionadas» (Loop Grid de «Más noticias»): 3 entradas de la misma categoría, sin la que se está
 * viendo; si la entrada no tiene categoría (o solo «Sin categoría»), las 3 más recientes.
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

add_action(
	'elementor/query/noticias_relacionadas',
	function ( $query ) {
		$actual = get_queried_object_id();
		$cats   = array_diff( wp_get_post_categories( $actual ), array( (int) get_option( 'default_category' ) ) );
		if ( $cats ) {
			$query->set( 'category__in', array_values( $cats ) );
		}
		if ( $actual ) {
			$query->set( 'post__not_in', array( $actual ) );
		}
		$query->set( 'posts_per_page', 3 );
		$query->set( 'ignore_sticky_posts', true );
	}
);
