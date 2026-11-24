<?php
/**
 * Horarios de Maloka en un solo lugar · pegar en «Code Snippets» (Ejecutar en todo el sitio).
 *
 * Los horarios se editan una sola vez en la página de inicio (grupo ACF «Horarios de Maloka»,
 * elementor/acf-horarios.json). El menú, la home, Visítanos y el footer los muestran con estos shortcodes,
 * puestos en Elementor con la etiqueta dinámica «Shortcode»:
 *
 *   [maloka_dias dia="semana"]      → «Lunes a viernes»            (dia="finde" → «Sábados, domingos y festivos»)
 *   [maloka_horario dia="semana"]   → «11:00 a. m. – 5:00 p. m.»   (dia="finde" → «9:30 a. m. – 6:00 p. m.»)
 *   [maloka_venta]                  → «Venta de entradas hasta las 4:00 p. m.»
 *   [maloka_horario_hoy]            → «Hoy: 11:00 a. m. – 5:00 p. m.» según el día (los festivos no se detectan)
 *   [maloka_aviso]                  → el aviso de cambio de horario, o nada si está vacío
 *
 * Si el grupo ACF todavía no existe, se muestran los horarios actuales de maloka.org.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Valor de un campo de horario: primero el de la página de inicio, si no el de respaldo. */
function maloka_horario_campo( $campo ) {
	$respaldo = array(
		'semana_dias'   => 'Lunes a viernes',
		'semana_abre'   => '11:00',
		'semana_cierra' => '17:00',
		'finde_dias'    => 'Sábados, domingos y festivos',
		'finde_abre'    => '09:30',
		'finde_cierra'  => '18:00',
		'venta_hasta'   => '16:00',
		'aviso'         => '',
	);
	$inicio = (int) get_option( 'page_on_front' );
	$valor  = ( $inicio && function_exists( 'get_field' ) ) ? get_field( $campo, $inicio ) : null;
	return ( null === $valor || false === $valor || ( '' === $valor && 'aviso' !== $campo ) ) ? $respaldo[ $campo ] : $valor;
}

/** «17:00» → «5:00 p. m.» (formato de Colombia). */
function maloka_hora( $hhmm ) {
	$partes = array_map( 'intval', explode( ':', $hhmm ) );
	$h      = $partes[0];
	$m      = isset( $partes[1] ) ? $partes[1] : 0;
	$sufijo = $h >= 12 ? 'p. m.' : 'a. m.';
	$h12    = ( ( $h + 11 ) % 12 ) + 1;
	return sprintf( '%d:%02d %s', $h12, $m, $sufijo );
}

function maloka_rango( $dia ) {
	$dia = 'finde' === $dia ? 'finde' : 'semana';
	return maloka_hora( maloka_horario_campo( "{$dia}_abre" ) ) . ' – ' . maloka_hora( maloka_horario_campo( "{$dia}_cierra" ) );
}

add_shortcode(
	'maloka_dias',
	function ( $atts ) {
		$atts = shortcode_atts( array( 'dia' => 'semana' ), $atts );
		return esc_html( maloka_horario_campo( 'finde' === $atts['dia'] ? 'finde_dias' : 'semana_dias' ) );
	}
);

add_shortcode(
	'maloka_horario',
	function ( $atts ) {
		$atts = shortcode_atts( array( 'dia' => 'semana' ), $atts );
		return esc_html( maloka_rango( $atts['dia'] ) );
	}
);

add_shortcode(
	'maloka_venta',
	function () {
		return esc_html( 'Venta de entradas hasta las ' . maloka_hora( maloka_horario_campo( 'venta_hasta' ) ) );
	}
);

add_shortcode(
	'maloka_horario_hoy',
	function () {
		$dia = (int) wp_date( 'N' ) >= 6 ? 'finde' : 'semana';
		return esc_html( 'Hoy: ' . maloka_rango( $dia ) );
	}
);

add_shortcode(
	'maloka_aviso',
	function () {
		return esc_html( maloka_horario_campo( 'aviso' ) );
	}
);
