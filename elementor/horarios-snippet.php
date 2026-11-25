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
 *   [maloka_aviso]                  → los próximos días especiales en texto, o nada si no hay
 *   [maloka_aviso etiqueta="Cambio de horario"] → una línea por día: «<b>Cambio de horario · jueves 26 de noviembre:</b>
 *                                     Cerrado todo el día.» (Visítanos)
 *   [maloka_aviso_corto]            → solo el próximo: «Cambio de horario · jue. 26 nov.: Cerrado todo el día.» (menú)
 *
 * Días especiales: en la pestaña «Días especiales» de los mismos campos hay 5 espacios (fecha, cerrado / festivo /
 * horario especial, horas y nota). Cada día se muestra hasta que pasa su fecha; después desaparece solo.
 *
 * El recuadro «Hoy abrimos» del hero (widget HTML con class="mk-hoy") también toma las horas de aquí: este
 * fragmento cambia sus atributos data-semana y data-finde al mostrar la página.
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
	);
	$inicio = (int) get_option( 'page_on_front' );
	$valor  = ( $inicio && function_exists( 'get_field' ) ) ? get_field( $campo, $inicio ) : null;
	return ( null === $valor || false === $valor || '' === $valor ) ? $respaldo[ $campo ] : $valor;
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

/**
 * Días especiales que todavía no han pasado, ordenados por fecha.
 * Cada uno: array( 'fecha' => '2026-11-26', 'tipo' => 'cerrado'|'festivo'|'especial', 'abre' => '12:00', 'cierra' => '18:00', 'nota' => '' ).
 */
function maloka_especiales() {
	static $lista = null;
	if ( null !== $lista ) {
		return $lista;
	}
	$lista  = array();
	$inicio = (int) get_option( 'page_on_front' );
	if ( ! $inicio || ! function_exists( 'get_field' ) ) {
		return $lista;
	}
	$hoy = wp_date( 'Y-m-d' );
	for ( $n = 1; $n <= 5; $n++ ) {
		$d = get_field( "especial_{$n}", $inicio );
		if ( empty( $d['fecha'] ) || ! preg_match( '/^(\d{4})(\d{2})(\d{2})$/', $d['fecha'], $m ) ) {
			continue;
		}
		$fecha = "{$m[1]}-{$m[2]}-{$m[3]}";
		if ( $fecha < $hoy ) {
			continue;
		}
		$tipo = in_array( $d['tipo'] ?? '', array( 'cerrado', 'festivo', 'especial' ), true ) ? $d['tipo'] : 'cerrado';
		$abre = $d['abre'] ?? '';
		$cierra = $d['cierra'] ?? '';
		if ( 'festivo' === $tipo ) {
			$abre   = maloka_horario_campo( 'finde_abre' );
			$cierra = maloka_horario_campo( 'finde_cierra' );
		}
		if ( 'especial' === $tipo && ( ! $abre || ! $cierra ) ) {
			continue; // horario especial sin horas: no se muestra hasta completarlo
		}
		$lista[ $fecha ] = array(
			'fecha'  => $fecha,
			'tipo'   => $tipo,
			'abre'   => substr( (string) $abre, 0, 5 ),
			'cierra' => substr( (string) $cierra, 0, 5 ),
			'nota'   => trim( (string) ( $d['nota'] ?? '' ) ),
		);
	}
	ksort( $lista );
	$lista = array_values( $lista );
	return $lista;
}

/** «2026-11-26» → «jueves 26 de noviembre» (o «jue. 26 nov.» corto). */
function maloka_fecha_es( $fecha, $corto = false ) {
	$t     = strtotime( $fecha . ' 12:00' );
	$dias  = array( 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' );
	$meses = array( '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' );
	$dia   = $dias[ (int) gmdate( 'w', $t ) ];
	$mes   = $meses[ (int) gmdate( 'n', $t ) ];
	if ( $corto ) {
		return mb_substr( $dia, 0, 3 ) . '. ' . gmdate( 'j', $t ) . ' ' . mb_substr( $mes, 0, 3 ) . '.';
	}
	return $dia . ' ' . gmdate( 'j', $t ) . ' de ' . $mes;
}

/** Qué pasa ese día: «Cerrado todo el día.» / «Festivo: abrimos de 9:30 a. m. a 6:00 p. m.» / «Abrimos de 12:00 p. m. a 6:00 p. m.» */
function maloka_especial_texto( $e ) {
	if ( 'cerrado' === $e['tipo'] ) {
		$t = 'Cerrado todo el día';
	} else {
		$t = ( 'festivo' === $e['tipo'] ? 'Festivo: abrimos' : 'Abrimos' ) . ' de ' . maloka_hora( $e['abre'] ) . ' a ' . maloka_hora( $e['cierra'] );
	}
	if ( '' !== $e['nota'] ) {
		$t .= ' · ' . rtrim( $e['nota'], '.' );
	}
	return '.' === substr( $t, -1 ) ? $t : $t . '.';
}

add_shortcode(
	'maloka_aviso',
	function ( $atts ) {
		$atts   = shortcode_atts( array( 'etiqueta' => '' ), $atts );
		$lineas = array();
		foreach ( maloka_especiales() as $e ) {
			if ( '' === $atts['etiqueta'] ) {
				$lineas[] = esc_html( maloka_fecha_es( $e['fecha'] ) . ': ' . maloka_especial_texto( $e ) );
			} else {
				$lineas[] = '<b>' . esc_html( $atts['etiqueta'] . ' · ' . maloka_fecha_es( $e['fecha'] ) ) . ':</b> ' . esc_html( maloka_especial_texto( $e ) );
			}
		}
		return implode( '' === $atts['etiqueta'] ? ' · ' : '<br>', $lineas );
	}
);

/** Solo el próximo día especial, corto, para el panel de horarios del menú. */
add_shortcode(
	'maloka_aviso_corto',
	function () {
		$lista = maloka_especiales();
		if ( ! $lista ) {
			return '';
		}
		$e = $lista[0];
		return esc_html( 'Cambio de horario · ' . maloka_fecha_es( $e['fecha'], true ) . ': ' . maloka_especial_texto( $e ) );
	}
);

/** Recuadro «Hoy abrimos» del hero (widget HTML): pone las horas de la página de inicio en data-semana y data-finde. */
add_filter(
	'elementor/widget/render_content',
	function ( $html, $widget ) {
		if ( 'html' !== $widget->get_name() || false === strpos( $html, 'mk-hoy' ) ) {
			return $html;
		}
		$semana = maloka_horario_campo( 'semana_abre' ) . '-' . maloka_horario_campo( 'semana_cierra' );
		$finde  = maloka_horario_campo( 'finde_abre' ) . '-' . maloka_horario_campo( 'finde_cierra' );
		$html   = preg_replace( '/data-semana="[^"]*"/', 'data-semana="' . esc_attr( $semana ) . '"', $html );
		$html   = preg_replace( '/data-finde="[^"]*"/', 'data-finde="' . esc_attr( $finde ) . '"', $html );
		// Días especiales: {"2026-11-26":"cerrado","2026-11-27":"12:00-18:00"}; el script del recuadro los usa ese día
		$esp = array();
		foreach ( maloka_especiales() as $e ) {
			$esp[ $e['fecha'] ] = 'cerrado' === $e['tipo'] ? 'cerrado' : $e['abre'] . '-' . $e['cierra'];
		}
		$html = preg_replace( '/\s*data-especiales="[^"]*"/', '', $html );
		$html = preg_replace( '/class="mk-hoy"/', 'class="mk-hoy" data-especiales="' . esc_attr( wp_json_encode( (object) $esp ) ) . '"', $html, 1 );
		// Texto inicial (antes del script) con el horario entre semana
		$html = preg_replace( '/(<span data-abre>)[^<]*(<\/span>)/', '${1}' . esc_html( maloka_hora( maloka_horario_campo( 'semana_abre' ) ) ) . '${2}', $html );
		$html = preg_replace( '/(<span data-cierra>)[^<]*(<\/span>)/', '${1}' . esc_html( maloka_hora( maloka_horario_campo( 'semana_cierra' ) ) ) . '${2}', $html );
		return $html;
	},
	10,
	2
);

/**
 * Elementor guarda una copia ya armada de cada página (_elementor_element_cache). El recuadro «Hoy abrimos» se marca
 * como contenido dinámico para que no quede guardado con un horario viejo.
 */
add_filter(
	'elementor/element/is_dynamic_content',
	function ( $es_dinamico, $datos ) {
		if ( isset( $datos['widgetType'] ) && 'html' === $datos['widgetType'] && false !== strpos( $datos['settings']['html'] ?? '', 'mk-hoy' ) ) {
			return true;
		}
		return $es_dinamico;
	},
	10,
	2
);
