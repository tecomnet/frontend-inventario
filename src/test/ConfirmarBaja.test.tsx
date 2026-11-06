import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmarBaja from '../components/ConfirmarBaja';

describe('ConfirmarBaja', () => {
  it('sin mensaje no muestra nada', () => {
    render(<ConfirmarBaja mensaje={null} onConfirmar={vi.fn()} onCancelar={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('muestra el mensaje y avisa al confirmar o cancelar', async () => {
    const onConfirmar = vi.fn();
    const onCancelar = vi.fn();
    const user = userEvent.setup();
    render(<ConfirmarBaja mensaje='¿Dar de baja "Altan"?' onConfirmar={onConfirmar} onCancelar={onCancelar} />);

    expect(screen.getByRole('dialog')).toHaveTextContent('¿Dar de baja "Altan"?');
    await user.click(screen.getByRole('button', { name: 'Dar de baja' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onConfirmar).toHaveBeenCalledOnce();
    expect(onCancelar).toHaveBeenCalledOnce();
  });

  it('mientras procesa desactiva los botones', () => {
    render(<ConfirmarBaja mensaje="¿Dar de baja?" procesando onConfirmar={vi.fn()} onCancelar={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Dando de baja…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  });
});
