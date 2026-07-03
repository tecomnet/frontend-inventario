// Tabla dinámica para resultados de consulta (compras, movimientos,
// existencias, kardex): toma las columnas de las llaves del primer objeto.
// Equivale a renderDynamicTableResult del panel viejo.
import { cellValue } from '../lib/format';

interface Props {
  payload: unknown;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function DynamicTable({
  payload,
  emptyTitle = 'Sin resultados',
  emptyMessage = 'No se encontraron registros para esos parámetros.',
}: Props) {
  const data = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown[] })?.data)
      ? (payload as { data: unknown[] }).data
      : payload
        ? [payload]
        : [];

  if (!data.length) {
    return (
      <div className="empty-state">
        <i className="bi bi-info-circle" />
        <h2>{emptyTitle}</h2>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const columns = Object.keys(data[0] as Record<string, unknown>);
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c}>{cellValue((row as Record<string, unknown>)[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
