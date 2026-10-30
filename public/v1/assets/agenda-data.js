/* Maloka · datos de la agenda.
   Una sola fuente para la Home, la página Agéndate y la ficha de actividad.
   Las fechas se calculan a partir del día actual para que el prototipo siempre se vea "vivo".
   En producción vendrían de un CPT "actividad" de WordPress (REST API); los campos ya tienen esa forma.
   Todos los títulos, horarios, precios y cupos son datos de ejemplo. */
(() => {
  const DAY = 864e5;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const sat = dow === 0 ? new Date(+today - DAY) : new Date(+today + ((6 - dow + 7) % 7) * DAY);
  const sun = new Date(+sat + DAY);
  const at = when => {
    if (when === 'hoy') return today;
    if (when === 'manana') return new Date(+today + DAY);
    if (when === 'sab') return sat;
    if (when === 'dom') return sun;
    return new Date(+sun + when * DAY); // n días después del domingo
  };

  const LABELS = {
    publico: { infancia: 'Primera infancia', ninos: 'Niños', jovenes: 'Jóvenes', familias: 'Familias', adultos: 'Adultos', todos: 'Todos' },
    tipo: { taller: 'Taller', cine: 'Cine', experiencia: 'Experiencia', conversatorio: 'Conversatorio', especial: 'Evento especial', familiar: 'Actividad familiar' },
    lugar: { domo: 'Cine Domo', digital: 'Sala Digital', salas: 'Salas interactivas', otros: 'Otros espacios' },
    precio: { incluido: 'Incluido con la entrada', gratis: 'Gratuito', costo: 'Con costo adicional' }
  };

  /* Experiencias permanentes: lo que existe siempre en Maloka. La agenda se conecta con ellas. */
  const EXPERIENCIAS = {
    domo: { nombre: 'Cine Domo', tone: 'tone-dome', texto: 'Levanta la mirada. El universo está más cerca de lo que imaginas.', cta: 'Descubre Cine Domo' },
    digital: { nombre: 'Sala Digital', tone: 'tone-digital', texto: 'Mundos que responden a tus movimientos.', cta: 'Explora la Sala Digital' },
    salas: { nombre: 'Salas interactivas', tone: 'tone-warm', texto: 'Toca, prueba, equivócate y vuelve a intentar.', cta: 'Recorre las salas' },
    laboratorios: { nombre: 'Laboratorios', tone: 'tone-lab', texto: 'Ponte la bata y haz ciencia de verdad.', cta: 'Experimenta en los laboratorios' }
  };

  const E = (o) => o;
  const RAW = [
    // ---- HOY
    E({ id: 'exploracion-del-universo', titulo: 'Exploración del universo', tipo: 'cine', publico: ['todos'], lugar: 'domo', sitio: 'Cine Domo', when: 'hoy', hora: '10:00', dur: 40, precio: 'incluido', req: 'compra', cupo: 'disponible', exp: 'domo', tone: 'tone-dome', destacado: true,
       resumen: 'Un viaje inmersivo desde la Tierra hasta los confines de la galaxia, proyectado sobre toda la cúpula.',
       foto: 'Público recostado mirando una galaxia que ocupa toda la cúpula.' }),
    E({ id: 'pequenos-exploradores', titulo: 'Pequeños exploradores', tipo: 'familiar', publico: ['infancia', 'familias'], edad: '3 a 5 años con acompañante', lugar: 'salas', sitio: 'Salas interactivas', when: 'hoy', hora: '09:30', dur: 45, precio: 'incluido', req: 'inscripcion', cupo: 'disponible', exp: 'salas', tone: 'tone-warm',
       resumen: 'Juegos sensoriales para descubrir colores, sonidos y texturas en familia.', foto: 'Niña pequeña con su papá explorando un módulo de luces.' }),
    E({ id: 'quimica-de-la-cocina', titulo: 'Química de la cocina', tipo: 'taller', publico: ['familias'], edad: '+8 años', lugar: 'otros', sitio: 'Laboratorio 2', when: 'hoy', hora: '11:30', dur: 60, precio: 'costo', req: 'inscripcion', cupo: 'ultimos', exp: 'laboratorios', tone: 'tone-lab',
       resumen: '¿Por qué sube el pan? ¿Por qué cambia de color la col morada? Experimenta con lo que hay en tu cocina.', foto: 'Familia mezclando líquidos de colores en el laboratorio.' }),
    E({ id: 'ilusiones-que-enganan-al-cerebro', titulo: 'Ilusiones que engañan al cerebro', tipo: 'experiencia', publico: ['todos'], lugar: 'salas', sitio: 'Salas interactivas', when: 'hoy', hora: '14:00', dur: 45, precio: 'incluido', req: 'ninguno', cupo: null, exp: 'salas', tone: 'tone-purple',
       resumen: 'Un recorrido guiado por ilusiones ópticas para entender cómo ve tu cerebro.', foto: 'Joven frente a una ilusión óptica de espirales.' }),
    E({ id: 'preguntale-a-una-cientifica', titulo: 'Pregúntale a una científica', tipo: 'conversatorio', publico: ['jovenes', 'adultos'], lugar: 'otros', sitio: 'Auditorio', when: 'hoy', hora: '15:30', dur: 60, precio: 'gratis', req: 'inscripcion', cupo: 'disponible', exp: null, tone: 'tone-group',
       resumen: 'Una conversación abierta con investigadoras colombianas. Trae tus preguntas.', foto: 'Investigadora conversando con jóvenes en el auditorio.' }),
    E({ id: 'robots-que-dibujan', titulo: 'Robots que dibujan', tipo: 'taller', publico: ['ninos'], edad: '+7 años', lugar: 'digital', sitio: 'Sala Digital', when: 'hoy', hora: '16:00', dur: 60, precio: 'incluido', req: 'inscripcion', cupo: 'agotado', exp: 'digital', tone: 'tone-digital',
       resumen: 'Programa un pequeño robot para que dibuje figuras geométricas.', foto: 'Niños observando un robot que dibuja sobre papel.' }),
    E({ id: 'una-noche-bajo-la-cupula', titulo: 'Una noche bajo la cúpula', tipo: 'especial', publico: ['adultos'], lugar: 'domo', sitio: 'Cine Domo', when: 'hoy', hora: '18:30', dur: 90, precio: 'costo', req: 'compra', cupo: 'ultimos', exp: 'domo', tone: 'tone-dome',
       resumen: 'Música en vivo y astronomía bajo el cielo del Cine Domo.', foto: 'Músicos en vivo con la cúpula iluminada de estrellas.' }),
    // ---- MAÑANA
    E({ id: 'mareas-de-luz', titulo: 'Mareas de luz', tipo: 'experiencia', publico: ['todos'], lugar: 'digital', sitio: 'Sala Digital', when: 'manana', hora: '10:30', dur: 30, precio: 'incluido', req: 'ninguno', cupo: null, exp: 'digital', tone: 'tone-digital', destacado: true,
       resumen: 'Una instalación de luz que reacciona a tus pasos y a tu voz.', foto: 'Personas caminando sobre un piso de luz que reacciona.' }),
    E({ id: 'circuitos-que-se-encienden', titulo: 'Circuitos que se encienden', tipo: 'taller', publico: ['ninos'], edad: '+7 años', lugar: 'otros', sitio: 'Laboratorio 1', when: 'manana', hora: '14:00', dur: 60, precio: 'incluido', req: 'inscripcion', cupo: 'disponible', exp: 'laboratorios', tone: 'tone-lab',
       resumen: 'Construye un circuito y descubre por qué se enciende un bombillo.', foto: 'Manos de un niño conectando cables a un bombillo.' }),
    E({ id: 'planetas-extremos', titulo: 'Planetas extremos', tipo: 'cine', publico: ['todos'], lugar: 'domo', sitio: 'Cine Domo', when: 'manana', hora: '15:00', dur: 40, precio: 'incluido', req: 'compra', cupo: 'disponible', exp: 'domo', tone: 'tone-dome',
       resumen: 'Mundos donde llueve hierro y los días duran años.', foto: 'Rostros iluminados por la proyección de un planeta rojo.' }),
    E({ id: 'cafe-cientifico-sismos', titulo: 'Café científico: ¿podemos predecir un sismo?', tipo: 'conversatorio', publico: ['adultos'], lugar: 'otros', sitio: 'Terraza', when: 'manana', hora: '18:00', dur: 75, precio: 'gratis', req: 'inscripcion', cupo: 'disponible', exp: null, tone: 'tone-arch',
       resumen: 'Geólogos y público conversan sobre lo que sabemos (y lo que no) de los terremotos.', foto: 'Conversación informal en la terraza al atardecer.' }),
    // ---- FIN DE SEMANA
    E({ id: 'festival-de-burbujas-gigantes', titulo: 'Festival de burbujas gigantes', tipo: 'familiar', publico: ['familias', 'infancia'], lugar: 'otros', sitio: 'Plazoleta', when: 'sab', hora: '11:00', dur: 60, precio: 'gratis', req: 'ninguno', cupo: null, exp: null, tone: 'tone-teal', destacado: true,
       resumen: 'Tensión superficial a gran escala: burbujas donde caben personas.', foto: 'Niños dentro de una burbuja gigante en la plazoleta.' }),
    E({ id: 'gigantes-del-pasado', titulo: 'Gigantes del pasado', tipo: 'cine', publico: ['ninos', 'familias'], lugar: 'domo', sitio: 'Cine Domo', when: 'sab', hora: '12:00', dur: 40, precio: 'incluido', req: 'compra', cupo: 'ultimos', exp: 'domo', tone: 'tone-dome',
       resumen: 'Viaja 70 millones de años atrás y camina entre dinosaurios.', foto: 'Niños señalando un dinosaurio proyectado en la cúpula.' }),
    E({ id: 'construye-tu-propio-cohete', titulo: 'Construye tu propio cohete', tipo: 'taller', publico: ['familias'], edad: '+8 años', lugar: 'otros', sitio: 'Laboratorio', when: 'sab', hora: '14:00', dur: 90, precio: 'incluido', req: 'inscripcion', cupo: 'disponible', exp: 'laboratorios', tone: 'tone-coral',
       resumen: 'Diseña, construye y lanza un cohete de agua. Gana el que llegue más alto.', foto: 'Familia lanzando un cohete de agua al aire libre.' }),
    E({ id: 'noche-de-estrellas', titulo: 'Noche de estrellas', tipo: 'especial', publico: ['jovenes', 'adultos'], lugar: 'otros', sitio: 'Terraza', when: 'sab', hora: '18:30', dur: 120, precio: 'costo', req: 'compra', cupo: 'disponible', exp: 'domo', tone: 'tone-dome',
       resumen: 'Observa el cielo con telescopios y astrónomos aficionados.', foto: 'Personas observando por telescopios en la terraza.' }),
    E({ id: 'robotica-en-familia', titulo: 'Robótica en familia', tipo: 'taller', publico: ['familias'], edad: '+6 años', lugar: 'digital', sitio: 'Sala Digital', when: 'dom', hora: '10:30', dur: 90, precio: 'costo', req: 'inscripcion', cupo: 'agotado', exp: 'digital', tone: 'tone-digital',
       resumen: 'Arma y programa un robot junto a tu familia.', foto: 'Madre e hija programando un robot.' }),
    E({ id: 'laboratorio-de-los-sentidos', titulo: 'Laboratorio de los sentidos', tipo: 'experiencia', publico: ['ninos'], lugar: 'salas', sitio: 'Salas interactivas', when: 'dom', hora: '13:00', dur: 45, precio: 'incluido', req: 'ninguno', cupo: null, exp: 'salas', tone: 'tone-warm',
       resumen: 'Pon a prueba tu olfato, tu oído y tu tacto.', foto: 'Niño con los ojos vendados tocando texturas.' }),
    E({ id: 'por-que-sonamos', titulo: '¿Por qué soñamos?', tipo: 'conversatorio', publico: ['jovenes', 'adultos'], lugar: 'otros', sitio: 'Auditorio', when: 'dom', hora: '15:00', dur: 60, precio: 'gratis', req: 'inscripcion', cupo: 'disponible', exp: null, tone: 'tone-purple',
       resumen: 'Lo que la neurociencia sabe hoy sobre los sueños.', foto: 'Neurocientífica hablando frente a un público atento.' }),
    // ---- PRÓXIMAMENTE (n días después del domingo)
    E({ id: 'ciencia-para-bebes', titulo: 'Ciencia para bebés', tipo: 'familiar', publico: ['infancia'], edad: '0 a 3 años con acompañante', lugar: 'salas', sitio: 'Salas interactivas', when: 3, hora: '10:00', dur: 45, precio: 'incluido', req: 'inscripcion', cupo: 'disponible', exp: 'salas', tone: 'tone-warm',
       resumen: 'Estímulos de luz, sonido y movimiento pensados para los más pequeños.', foto: 'Bebé jugando con luces de colores en el regazo de su mamá.' }),
    E({ id: 'nueva-exposicion-temporal', titulo: 'Inauguración: nueva exposición temporal', tipo: 'especial', publico: ['todos'], lugar: 'otros', sitio: 'Sala de exposiciones temporales', when: 5, hora: '17:00', dur: 120, precio: 'gratis', req: 'inscripcion', cupo: 'disponible', exp: null, tone: 'tone-coral', destacado: true,
       resumen: 'Sé de las primeras personas en recorrer la nueva exposición de Maloka.', foto: 'Visitantes recorriendo piezas suspendidas con luz cálida.' }),
    E({ id: 'ensenar-con-preguntas', titulo: 'Enseñar con preguntas', tipo: 'taller', publico: ['adultos'], edad: 'Docentes', lugar: 'otros', sitio: 'Auditorio', when: 9, hora: '14:00', dur: 180, precio: 'gratis', req: 'inscripcion', cupo: 'ultimos', exp: null, tone: 'tone-group',
       resumen: 'Un taller para docentes sobre cómo convertir la clase en un laboratorio.', foto: 'Docentes trabajando en grupos alrededor de una mesa.' }),
    E({ id: 'vacaciones-cientificas', titulo: 'Vacaciones científicas', tipo: 'taller', publico: ['ninos'], edad: '8 a 12 años', lugar: 'otros', sitio: 'Laboratorios', when: 12, hora: '09:00', dur: 180, precio: 'costo', req: 'inscripcion', cupo: 'disponible', exp: 'laboratorios', tone: 'tone-lab',
       resumen: 'Una semana de experimentos, retos y descubrimientos.', foto: 'Grupo de niños con batas celebrando un experimento.' }),
    E({ id: 'asi-se-ve-un-eclipse', titulo: 'Así se ve un eclipse', tipo: 'cine', publico: ['todos'], lugar: 'domo', sitio: 'Cine Domo', when: 15, hora: '11:00', dur: 40, precio: 'incluido', req: 'compra', cupo: 'disponible', exp: 'domo', tone: 'tone-dome',
       resumen: 'Qué pasa cuando la Luna tapa al Sol, contado desde el espacio.', foto: 'La cúpula mostrando un eclipse total.' }),
    E({ id: 'una-noche-bajo-la-cupula-2', titulo: 'Una noche bajo la cúpula', tipo: 'especial', publico: ['adultos'], lugar: 'domo', sitio: 'Cine Domo', when: 16, hora: '18:30', dur: 90, precio: 'costo', req: 'compra', cupo: 'disponible', exp: 'domo', tone: 'tone-dome',
       resumen: 'Música en vivo y astronomía bajo el cielo del Cine Domo.', foto: 'Músicos en vivo con la cúpula iluminada de estrellas.' })
  ];

  // Contenido extendido para la ficha (por tipo, con posibilidad de sobrescribir por actividad).
  const POR_TIPO = {
    taller: { vivir: ['Experimentas con tus propias manos guiado por un mediador.', 'Trabajas en equipo para resolver un reto.', 'Te llevas a casa lo que construyes o una guía para repetirlo.'], rec: ['Llega 15 minutos antes para registrarte.', 'Usa ropa cómoda que se pueda ensuciar.', 'Los materiales están incluidos.'] },
    cine: { vivir: ['Una proyección inmersiva de 360° sobre toda la cúpula.', 'Narración en español con datos científicos actualizados.', 'Un espacio para preguntas al final de la función.'], rec: ['Ingresa 10 minutos antes: después de iniciar la función no hay ingreso.', 'Si te mareas con facilidad, elige las sillas centrales.', 'No se permite comer dentro de la sala.'] },
    experiencia: { vivir: ['Un recorrido guiado por mediadores de Maloka.', 'Módulos para tocar, probar y comparar.', 'Preguntas que siguen contigo después de la visita.'], rec: ['La experiencia empieza en el punto de encuentro de la sala.', 'Puedes unirte sin inscripción mientras haya espacio.'] },
    conversatorio: { vivir: ['Una charla cercana con especialistas.', 'Tiempo abierto para tus preguntas.', 'Recomendaciones para seguir explorando el tema.'], rec: ['Inscríbete para asegurar tu silla.', 'La actividad se transmite con subtítulos en pantalla.'] },
    especial: { vivir: ['Una programación única que no se repite cada semana.', 'Invitados especiales y montajes temporales.', 'Ciencia, cultura y encuentro en un mismo lugar.'], rec: ['Compra o reserva con anticipación: los cupos son limitados.', 'Revisa la hora de ingreso: algunas actividades empiezan fuera del horario habitual.'] },
    familiar: { vivir: ['Juegos y retos pensados para compartir en familia.', 'Mediadores que acompañan a cada grupo.', 'Ideas para seguir experimentando en casa.'], rec: ['Cada niño o niña debe estar acompañado por un adulto.', 'Trae agua y ropa cómoda.'] }
  };
  const ACCESIBILIDAD = 'Espacio accesible en silla de ruedas. Hay sillas reservadas para personas con movilidad reducida y acompañantes. Si necesitas un apoyo específico, escríbenos antes de tu visita.';

  const fmt = (o) => new Intl.DateTimeFormat('es-CO', o);
  const F = {
    dia: fmt({ day: 'numeric' }), sem: fmt({ weekday: 'short' }), semLarga: fmt({ weekday: 'long' }),
    mes: fmt({ month: 'short' }), larga: fmt({ weekday: 'long', day: 'numeric', month: 'long' }),
    corta: fmt({ weekday: 'short', day: 'numeric', month: 'short' }), mesAnio: fmt({ month: 'long', year: 'numeric' })
  };
  const clean = s => s.replace('.', '');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function hora12(h) {
    const [H, M] = h.split(':').map(Number);
    const p = H >= 12 ? 'p. m.' : 'a. m.'; const h12 = ((H + 11) % 12) + 1;
    return `${h12}:${String(M).padStart(2, '0')} ${p}`;
  }
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const EVENTS = RAW.map(e => {
    const fecha = at(e.when);
    const [H, M] = e.hora.split(':').map(Number);
    const extra = POR_TIPO[e.tipo];
    return Object.assign({
      fecha, dia: key(fecha), minutos: H * 60 + M,
      hora12: hora12(e.hora), valor: e.precio === 'costo' ? '$XX.XXX' : null,
      momento: H < 12 ? 'manana' : H < 18 ? 'tarde' : 'noche',
      vivir: extra.vivir, rec: extra.rec, accesibilidad: ACCESIBILIDAD,
      descripcion: e.resumen + ' Esta actividad hace parte de la programación de Maloka para que vivas la ciencia de nuevas maneras: preguntando, probando y descubriendo con otras personas.'
    }, e);
  }).sort((a, b) => a.fecha - b.fecha || a.minutos - b.minutos);

  window.MalokaAgenda = { EVENTS, LABELS, EXPERIENCIAS, today, sat, sun, DAY, F, key, cap, clean, hora12,
    byId: id => EVENTS.find(e => e.id === id) };
})();
