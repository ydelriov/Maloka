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
  // Ven en grupo
  'Ven en grupo': 'ven-en-grupo/',
  'Colegios y universidades': 'ven-en-grupo/#colegios',
  'Cumpleaños': 'ven-en-grupo/#cumpleanos',
  'Empresas y eventos': 'ven-en-grupo/#empresas',
  'MPA': 'ven-en-grupo/#mpa',
  'Maloka Puertas Abiertas': 'ven-en-grupo/#mpa',
  'Cotiza tu visita': 'ven-en-grupo/#cotizar',
  // Descubre
  'Descubre': 'descubre/',
  'Programas y proyectos': 'descubre/#programas',
  'Conoce Maloka': 'descubre/#conoce',
  'Recursos educativos': 'descubre/#recursos',
  'Noticias': 'noticias/',
  // Crea con Maloka
  'Crea con Maloka': 'crea-con-maloka/',
  'Patrocinios y alianzas': 'crea-con-maloka/#patrocinios',
  'Experiencias museográficas': 'crea-con-maloka/#museografia',
  'Acompañamiento pedagógico': 'crea-con-maloka/#pedagogia',
  'Investigación y consultoría': 'crea-con-maloka/#investigacion',
  'Maloka viajera': 'crea-con-maloka/#viajera',
  'Hablemos de tu proyecto': 'crea-con-maloka/#contacto'
};

export const ruta = (label) => (RUTAS[label] ? url(RUTAS[label]) : '#');
