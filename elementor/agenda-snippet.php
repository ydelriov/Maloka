<?php
/**
 * Agenda de Maloka (Agéndate) · pegar en el plugin «Code Snippets» como snippet PHP que se ejecuta en todo el sitio.
 *
 * Usa los campos ACF del grupo «Datos del evento» (elementor/acf-evento.json) en el tipo de contenido «eventos»,
 * el mismo que maloka.org ya usa para su agenda. El tipo de evento es la taxonomía «tipo_evento».
 *
 * 1. Query ID para los Loop Grid de Elementor Pro (Consulta › Query ID):
 *    - evento_destacado   → el próximo evento marcado «Destacar en Agéndate» (poner «Entradas por página» = 1)
 *    - proximos_eventos   → los eventos que no han terminado, del más cercano al más lejano, sin el destacado
 *    - eventos_pasados    → los que ya pasaron, del más reciente al más antiguo
 *    - proximos_home      → la agenda de la home: los 3 eventos más cercanos que no han terminado (incluye el destacado)
 *    - otros_eventos      → ficha del evento: los 3 próximos, sin el evento que se está viendo
 * 2. Shortcodes para la tarjeta (Loop Item), con la fecha en español:
 *    [evento_dias]               → «28» o «28–29» (el rango va en <span class="maloka-rango">)
 *    [evento_fecha formato="M"]  → «nov.» (cualquier formato de fecha de PHP: j, D, l, F…)
 *    [evento_acceso]             → «Gratis con inscripción» o «Evento pago · $25.000»
 *    [evento_boton]              → «Inscríbete» / «Compra tu entrada» / vacío si es entrada libre
 *    [evento_descripcion]        → «Ver descripción» desplegable (<details>) con el texto completo del evento
 * 3. Para la ficha del evento: [evento_campo campo="horario"], [evento_tipo], [evento_fecha_larga], [evento_nota],
 *    [evento_calendario], [evento_estado] («Este evento ya pasó»). Botón y calendario se ocultan si el evento terminó.
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

/**
 * ID del próximo evento destacado (o 0).
 * La consulta interna va marcada con «maloka_interno»: mientras Elementor arma un Loop Grid, sus Query ID se disparan
 * en todas las consultas, también en esta, y sin la marca se llamaría a sí misma sin fin.
 */
function maloka_id_destacado() {
	static $id = null;
	if ( null !== $id ) {
		return $id;
	}
	$ids = get_posts(
		array(
			'maloka_interno' => true,
			'post_type'      => 'eventos',
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
	$id = $ids ? (int) $ids[0] : 0;
	return $id;
}

add_action(
	'elementor/query/evento_destacado',
	function ( $query ) {
		if ( $query->get( 'maloka_interno' ) ) {
			return;
		}
		$id = maloka_id_destacado();
		$query->set( 'post__in', $id ? array( $id ) : array( 0 ) );
		$query->set( 'posts_per_page', 1 );
	}
);

add_action(
	'elementor/query/proximos_eventos',
	function ( $query ) {
		if ( $query->get( 'maloka_interno' ) ) {
			return;
		}
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
	'elementor/query/proximos_home',
	function ( $query ) {
		if ( $query->get( 'maloka_interno' ) ) {
			return;
		}
		$query->set( 'meta_query', maloka_meta_proximos() );
		$query->set( 'meta_key', 'fecha' );
		$query->set( 'orderby', 'meta_value_num' );
		$query->set( 'order', 'ASC' );
		$query->set( 'posts_per_page', 3 );
	}
);

add_action(
	'elementor/query/otros_eventos',
	function ( $query ) {
		if ( $query->get( 'maloka_interno' ) ) {
			return;
		}
		$query->set( 'meta_query', maloka_meta_proximos() );
		$query->set( 'meta_key', 'fecha' );
		$query->set( 'orderby', 'meta_value_num' );
		$query->set( 'order', 'ASC' );
		$query->set( 'posts_per_page', 3 );
		$actual = get_queried_object_id();
		if ( $actual ) {
			$query->set( 'post__not_in', array( $actual ) );
		}
	}
);

add_action(
	'elementor/query/eventos_pasados',
	function ( $query ) {
		if ( $query->get( 'maloka_interno' ) ) {
			return;
		}
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

/** ¿El evento ya terminó? (fecha_fin, o fecha si no tiene fin, anterior a hoy en Bogotá). */
function maloka_terminado() {
	$fin = get_post_meta( get_the_ID(), 'fecha_fin', true );
	$fin = $fin ? $fin : get_post_meta( get_the_ID(), 'fecha', true );
	return $fin && (int) $fin < (int) maloka_hoy();
}

/** [evento_estado] → etiqueta «Este evento ya pasó» si terminó; vacío si no. */
add_shortcode(
	'evento_estado',
	function () {
		return maloka_terminado() ? '<span class="maloka-evento-pasado">Este evento ya pasó</span>' : '';
	}
);

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
			// Rango de días: va en un span para mostrarlo más pequeño («28–29» no cabe al tamaño de un solo día)
			return '<span class="maloka-rango">' . esc_html( $texto . '–' . wp_date( 'j', $fin ) ) . '</span>';
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
		if ( ! $enlace || 'gratis' === $acceso || maloka_terminado() ) {
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

add_shortcode(
	'evento_descripcion',
	function () {
		$contenido = get_post_field( 'post_content', get_the_ID() );
		if ( ! trim( wp_strip_all_tags( $contenido ) ) ) {
			return '';
		}
		return '<details class="maloka-evento-desc"><summary>Ver descripción</summary><div>'
			. wpautop( wp_kses_post( strip_shortcodes( $contenido ) ) ) . '</div></details>';
	}
);

/* ── Ficha del evento (plantilla «Entrada individual» de Eventos, elementor/evento-single-v13.json) ── */

/**
 * [evento_campo campo="horario"] → valor de un campo ACF del evento (horario, lugar, lugar_detalle, valor).
 */
add_shortcode(
	'evento_campo',
	function ( $atts ) {
		$atts = shortcode_atts( array( 'campo' => 'horario' ), $atts );
		return esc_html( (string) get_post_meta( get_the_ID(), sanitize_key( $atts['campo'] ), true ) );
	}
);

/** [evento_tipo] → «Cine», «Talleres»… (taxonomía tipo_evento). */
add_shortcode(
	'evento_tipo',
	function () {
		$terminos = get_the_terms( get_the_ID(), 'tipo_evento' );
		return ( $terminos && ! is_wp_error( $terminos ) ) ? esc_html( $terminos[0]->name ) : '';
	}
);

/** [evento_fecha_larga] → «Domingo, 29 de noviembre de 2026» o «Sábado 28 y domingo 29 de noviembre». */
add_shortcode(
	'evento_fecha_larga',
	function () {
		$ini = maloka_ts( 'fecha' );
		$fin = maloka_ts( 'fecha_fin' );
		if ( ! $ini ) {
			return '';
		}
		$texto = ( $fin && $fin > $ini )
			? wp_date( 'l j', $ini ) . ' y ' . wp_date( 'l j \d\e F', $fin )
			: wp_date( 'l, j \d\e F \d\e Y', $ini );
		return esc_html( ucfirst( $texto ) );
	}
);

/** [evento_nota] → la primera línea de «Ten en cuenta» según el acceso. */
add_shortcode(
	'evento_nota',
	function () {
		$notas = array(
			'inscripcion' => 'Es gratis, pero necesitas inscribirte: los cupos son limitados.',
			'pago'        => 'Compra tu entrada en línea: puede agotarse en taquilla.',
			'gratis'      => 'Entrada libre hasta completar el aforo.',
		);
		$acceso = get_post_meta( get_the_ID(), 'acceso', true );
		return isset( $notas[ $acceso ] ) ? esc_html( $notas[ $acceso ] ) : '';
	}
);

/** [evento_calendario] → enlace «Agregar a Google Calendar» (día completo; el horario va en la descripción). */
add_shortcode(
	'evento_calendario',
	function () {
		$ini = maloka_ts( 'fecha' );
		if ( ! $ini || maloka_terminado() ) {
			return '';
		}
		$fin  = maloka_ts( 'fecha_fin' ) ? maloka_ts( 'fecha_fin' ) : $ini;
		$args = array(
			'action'   => 'TEMPLATE',
			'text'     => get_the_title() . ' · Maloka',
			'dates'    => wp_date( 'Ymd', $ini ) . '/' . wp_date( 'Ymd', $fin + DAY_IN_SECONDS ),
			'details'  => get_post_meta( get_the_ID(), 'horario', true ) . '. ' . wp_strip_all_tags( get_the_excerpt() ),
			'location' => get_post_meta( get_the_ID(), 'lugar', true ) . ' – Maloka, Cra. 68D # 24A-51, Bogotá',
		);
		$enlace = add_query_arg( array_map( 'rawurlencode', $args ), 'https://calendar.google.com/calendar/render' );
		return sprintf(
			'<a class="maloka-evento-calendario" href="%s" target="_blank" rel="noopener">Agregar a Google Calendar ↗<span class="screen-reader-text"> (abre en una pestaña nueva)</span></a>',
			esc_url( $enlace )
		);
	}
);

/** Estilo de los enlaces que generan [evento_boton] y [evento_calendario] (Design System v3). */
add_action(
	'wp_head',
	function () {
		echo '<style id="maloka-evento">'
			. '.maloka-evento-boton{display:inline-flex;align-items:center;gap:10px;min-height:56px;padding:0 28px;background:#231B2B;color:#FFE25C;font-weight:700;font-size:18px;text-decoration:none;transition:background-color .2s,color .2s}'
			. '.maloka-evento-boton:hover{background:#FFE25C;color:#231B2B}'
			. '.maloka-evento-calendario{display:inline-block;font-weight:700;color:#231B2B;border-bottom:2px solid currentColor;padding-bottom:2px;text-decoration:none}'
			. '.maloka-evento-calendario:hover{color:#6B5BD6}'
			. '</style>';
	}
);
