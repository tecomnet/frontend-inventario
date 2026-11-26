import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DynamicTable from '../components/DynamicTable';

describe('DynamicTable', () => {
  it('toma las columnas del primer registro y formatea las celdas', () => {
    render(<DynamicTable payload={[
      { folio: 'AA-1', activo: true, fecha: '2026-11-21', nota: null },
      { folio: 'AA-2', activo: false, fecha: '2026-11-22', nota: 'ok' },
    ]} />);

    expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['folio', 'activo', 'fecha', 'nota']);
    expect(screen.getByText('AA-1')).toBeInTheDocument();
    expect(screen.getByText('Sí')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('21/11/2026')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('acepta una respuesta paginada con data', () => {
    render(<DynamicTable payload={{ data: [{ id: 5 }], totalRecords: 1 }} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('acepta un solo objeto', () => {
    render(<DynamicTable payload={{ id: 9 }} />);

    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('sin datos muestra el mensaje vacío', () => {
    render(<DynamicTable payload={[]} emptyTitle="Nada" emptyMessage="Prueba otros filtros." />);

    expect(screen.getByText('Nada')).toBeInTheDocument();
    expect(screen.getByText('Prueba otros filtros.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});