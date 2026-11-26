import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CampoError from '../components/CampoError';
import SinPermiso from '../components/SinPermiso';

describe('CampoError', () => {
  it('muestra cada mensaje del campo', () => {
    render(<CampoError mensajes={['Es obligatorio.', 'Máximo 50 caracteres.']} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('Máximo 50 caracteres.')).toBeInTheDocument();
  });

  it('sin mensajes no pinta nada', () => {
    const { container } = render(<CampoError mensajes={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('SinPermiso', () => {
  it('avisa que el usuario es de solo lectura', () => {
    render(<SinPermiso />);

    expect(screen.getByRole('alert')).toHaveTextContent('Tu usuario es de solo lectura');
  });
});