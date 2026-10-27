// A dónde lleva cada ítem del menú, del footer y de los accesos de la home. Las páginas que aún no existen
// llevan a su sección en la home (V7); lo que no aparece aquí sigue apuntando a «#».
import { url } from './url.js';

const RUTAS = {
  // Visítanos
  'Visítanos': 'visitanos/',
  'Horarios y tarifas': 'visitanos/#horarios',
  'Cómo llegar': 'visitanos/#llegar',
  'Servicios': 'visitanos/#servicios',
  'Servicios y accesibilidad': 'visitanos/#servicios',
  'Accesibilidad': 'visitanos/#accesibilidad',
  'Experiencias': 'visitanos/#experiencias',
  'Preguntas frecuentes': 'visitanos/#preguntas',
  'Guía digital': 'visitanos/#servicios',
  // Agéndate
  'Agéndate': 'agendate/',
  'Programación': 'agendate/',
  'Cine Domo': 'agendate/#programacion',
  // Ven en grupo (sección de la home hasta que exista la página)
  'Ven en grupo': 'v7/#grupos',
  'Colegios y universidades': 'v7/#grupos',
  'Cumpleaños': 'v7/#grupos',
  'Empresas y eventos': 'v7/#grupos',
  'MPA': 'v7/#grupos',
  // Descubre
  'Descubre': 'v7/#descubre',
  'Programas y proyectos': 'v7/#descubre',
  'Conoce Maloka': 'v7/#descubre',
  'Recursos educativos': 'v7/#descubre',
  'Noticias': 'v7/#noticias',
  // Crea con Maloka
  'Crea con Maloka': 'v7/#crea',
  'Patrocinios y alianzas': 'v7/#crea',
  'Experiencias museográficas': 'v7/#crea',
  'Acompañamiento pedagógico': 'v7/#crea',
  'Investigación y consultoría': 'v7/#crea',
  'Maloka viajera': 'v7/#crea'
};

export const ruta = (label) => (RUTAS[label] ? url(RUTAS[label]) : '#');
