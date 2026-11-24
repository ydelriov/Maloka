// Agenda compartida por la home (V13, solo texto) y la página Agéndate (con afiche y descripción).
// Mismos datos (src/data/n/agenda.json) y mismos tipos de evento que la taxonomía «tipo_evento» de WordPress.
// Los próximos y los pasados se calculan con la fecha del día en que se construye el sitio.
import a from '../data/n/agenda.json';

export const agenda = a;
export const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }); // AAAA-MM-DD
export const tipo = Object.fromEntries(a.tipos.map((t) => [t.id, t]));
const fin = (e) => e.fechaFin || e.fecha;
export const proximos = a.eventos.filter((e) => fin(e) >= hoy).sort((x, y) => x.fecha.localeCompare(y.fecha));
export const pasados = a.eventos.filter((e) => fin(e) < hoy).sort((x, y) => y.fecha.localeCompare(x.fecha));
const f = (iso, o) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', o);
export const dia = (iso) => f(iso, { day: 'numeric' });
export const mes = (iso) => f(iso, { month: 'short' }).replace('.', '');
export const sem = (iso) => f(iso, { weekday: 'short' }).replace('.', '');
export const rango = (e) => (e.fechaFin ? `${dia(e.fecha)}–${dia(e.fechaFin)}` : dia(e.fecha));
export const acceso = (e) => `${a.acceso[e.acceso]}${e.valor ? ` · ${e.valor}` : ''}`;
export const cta = (e) => (e.acceso === 'pago' ? 'Compra tu entrada' : e.acceso === 'inscripcion' ? 'Inscríbete' : null);
export const filtros = [{ id: 'todo', label: 'Todos' }, ...a.tipos.map((t) => ({ id: t.id, label: t.label }))];
