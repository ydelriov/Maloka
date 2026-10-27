// Páginas internas que ya existen. Los enlaces del menú, el footer y las tarjetas usan esta tabla;
// lo que no aparece aquí sigue apuntando a «#».
import { url } from './url.js';

const RUTAS = {
  'Visítanos': 'visitanos/',
  'Horarios y tarifas': 'visitanos/#horarios',
  'Cómo llegar': 'visitanos/#llegar',
  'Servicios': 'visitanos/#servicios',
  'Servicios y accesibilidad': 'visitanos/#servicios',
  'Accesibilidad': 'visitanos/#accesibilidad',
  'Experiencias': 'visitanos/#experiencias',
  'Preguntas frecuentes': 'visitanos/#preguntas',
  'Guía digital': 'visitanos/#servicios'
};

export const ruta = (label) => (RUTAS[label] ? url(RUTAS[label]) : '#');
