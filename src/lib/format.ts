// Utilidades de formato compartidas por las páginas del panel.
// React escapa el contenido en JSX, por eso no hace falta escapar a mano.

export const clean = (s: unknown): string =>
  String(s == null ? '' : s).replace(/[\t\r\n]+/g, ' ').trim();

/** dd/mm/yyyy (cadena '-' si no hay fecha válida). Equivale a formatearFecha. */
export const fecha = (iso: unknown): string => {
  if (!iso) return '-';
  const d = new Date(iso as string);
  if (isNaN(d.getTime())) return '-';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

/** ISO -> 'yyyy-mm-dd' para inputs type="date". */
export const isoToInput = (iso: unknown): string => {
  if (!iso) return '';
  const d = new Date(iso as string);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

/**
 * Formatea un valor para celdas de tablas dinámicas (compras, movimientos,
 * existencias, kardex). Equivale a formatCellValue del panel viejo.
 */
export const cellValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text) || /^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return fecha(text);
  }
  return text;
};

/** true/false -> 'Sí'/'No' (para columnas de activo). */
export const siNo = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  return value ? 'Sí' : 'No';
};
