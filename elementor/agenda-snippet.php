<?php
/**
 * Agenda de Maloka (Agéndate) · pegar en el plugin «Code Snippets» como snippet PHP que se ejecuta en todo el sitio.
 *
 * Usa los campos ACF del grupo «Datos del evento» (elementor/acf-evento.json) en las entradas de la categoría Eventos.
 *
 * 1. Query ID para los Loop Grid de Elementor Pro (Consulta › Query ID):
 *    - evento_destacado   → el próximo evento marcado «Destacar en Agéndate» (poner «Entradas por página» = 1)
 *    - proximos_eventos   → los eventos que no han terminado, del más cercano al más lejano, sin el destacado
 *    - eventos_pasados    → los que ya pasaron, del más reciente al más antiguo
 * 2. Shortcodes para la tarjeta (Loop Item), con la fecha en español:
 *    [evento_dias]               → «28» o «28–29»
 *    [evento_fecha formato="M"]  → «nov.» (cualquier formato de fecha de PHP: j, D, l, F…)
 *    [evento_acceso]             → «Gratis con inscripción» o «Evento pago · $25.000»
 *    [evento_boton]              → «Inscríbete» / «Compra tu entrada» / vacío si es entrada libre
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Fecha de hoy en Bogotá, como la guarda ACF (AAAAMMDD). */
function maloka_hoy() {
	return wp_date( 'Ymd' );
}

/** Condición «el evento no ha terminado»: fecha_fin >= hoy, o sin fecha_fin y fecha >= hoy. */
function maloka_meta_proximos() {
	$hoy = maloka_hoy();
	return array(
		'relation' => 'OR',
		array( 'key' => 'fecha_fin', 'value' => $hoy, 'compare' => '>=', 'type' => 'NUMERIC' ),
		array(
			'relation' => 'AND',
			array( 'key' => 'fecha', 'value' => $hoy, 'compare' => '>=', 'type' => 'NUMERIC' ),
			array(
				'relation' => 'OR',
				array( 'key' => 'fecha_fin', 'compare' => 'NOT EXISTS' ),
				array( 'key' => 'fecha_fin', 'value' => '', 'compare' => '=' ),
			),
		),
	);
}

/** ID del próximo evento destacado (o 0). */
function maloka_id_destacado() {
	$ids = get_posts(
		array(
			'post_type'      => 'post',
			'category_name'  => 'eventos',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => 'fecha',
			'orderby'        => 'meta_value_num',
			'order'          => 'ASC',
			'meta_query'     => array(
				'relation' => 'AND',
				array( 'key' => 'destacado', 'value' => '1' ),
				maloka_meta_proximos(),
			),
		)
	);
	return $ids ? (int) $ids[0] : 0;
}

add_action(
	'elementor/query/evento_destacado',
	function ( $query ) {
		$id = maloka_id_destacado();
		$query->set( 'post__in', $id ? array( $id ) : array( 0 ) );
		$query->set( 'posts_per_page', 1 );
	}
);

add_action(
	'elementor/query/proximos_eventos',
	function ( $query ) {
		$query->set( 'meta_query', maloka_meta_proximos() );
		$query->set( 'meta_key', 'fecha' );
		$query->set( 'orderby', 'meta_value_num' );
		$query->set( 'order', 'ASC' );
		$id = maloka_id_destacado();
		if ( $id ) {
			$query->set( 'post__not_in', array( $id ) );
		}
	}
);

add_action(
	'elementor/query/eventos_pasados',
	function ( $query ) {
		$query->set(
			'meta_query',
			array( array( 'key' => 'fecha', 'value' => maloka_hoy(), 'compare' => '<', 'type' => 'NUMERIC' ) )
		);
		$query->set( 'meta_key', 'fecha' );
		$query->set( 'orderby', 'meta_value_num' );
		$query->set( 'order', 'DESC' );
	}
);

/** Timestamp de un campo de fecha ACF (guardado como AAAAMMDD). */
function maloka_ts( $campo ) {
	$valor = get_post_meta( get_the_ID(), $campo, true );
	if ( ! $valor ) {
		return 0;
	}
	$fecha = DateTime::createFromFormat( 'Ymd H:i', $valor . ' 12:00', wp_timezone() );
	return $fecha ? $fecha->getTimestamp() : 0;
}

add_shortcode(
	'evento_fecha',
	function ( $atts ) {
		$atts = shortcode_atts( array( 'formato' => 'j', 'campo' => 'fecha' ), $atts );
		$ts   = maloka_ts( $atts['campo'] );
		return $ts ? esc_html( wp_date( $atts['formato'], $ts ) ) : '';
	}
);

add_shortcode(
	'evento_dias',
	function () {
		$ini = maloka_ts( 'fecha' );
		$fin = maloka_ts( 'fecha_fin' );
		if ( ! $ini ) {
			return '';
		}
		$texto = wp_date( 'j', $ini );
		if ( $fin && $fin > $ini ) {
			$texto .= '–' . wp_date( 'j', $fin );
		}
		return esc_html( $texto );
	}
);

add_shortcode(
	'evento_acceso',
	function () {
		$etiquetas = array(
			'inscripcion' => 'Gratis con inscripción',
			'gratis'      => 'Entrada libre',
			'pago'        => 'Evento pago',
		);
		$acceso = get_post_meta( get_the_ID(), 'acceso', true );
		$texto  = isset( $etiquetas[ $acceso ] ) ? $etiquetas[ $acceso ] : '';
		$valor  = get_post_meta( get_the_ID(), 'valor', true );
		if ( 'pago' === $acceso && $valor ) {
			$texto .= ' · ' . $valor;
		}
		return esc_html( $texto );
	}
);

add_shortcode(
	'evento_boton',
	function () {
		$acceso = get_post_meta( get_the_ID(), 'acceso', true );
		$enlace = get_post_meta( get_the_ID(), 'enlace', true );
		if ( ! $enlace || 'gratis' === $acceso ) {
			return '';
		}
		$texto = 'pago' === $acceso ? 'Compra tu entrada' : 'Inscríbete';
		return sprintf(
			'<a class="maloka-evento-boton" href="%s" target="_blank" rel="noopener">%s ↗<span class="screen-reader-text"> (abre en una pestaña nueva)</span></a>',
			esc_url( $enlace ),
			esc_html( $texto )
		);
	}
);
