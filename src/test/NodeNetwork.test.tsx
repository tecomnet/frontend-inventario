import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import NodeNetwork from '../components/NodeNetwork';

// jsdom no dibuja en <canvas>: se simula el contexto 2D con funciones vacías
// para revisar que la animación arranca, dibuja y se detiene.
const ctx = {
  setTransform: vi.fn(), clearRect: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(),
  lineTo: vi.fn(), stroke: vi.fn(), arc: vi.fn(), fill: vi.fn(),
  lineWidth: 0, strokeStyle: '', fillStyle: '',
};

/** Simula la preferencia "reducir movimiento" del sistema. */
function preferirMenosMovimiento(reduce: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduce })));
}

describe('NodeNetwork', () => {
  let cuadro: FrameRequestCallback | null;

  beforeEach(() => {
    cuadro = null;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    // Guarda el siguiente cuadro de la animación para correrlo a mano.
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb: FrameRequestCallback) => { cuadro = cb; return 1; }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    Object.values(ctx).forEach((v) => typeof v === 'function' && v.mockClear());
  });

  it('dibuja los nodos y reacciona al cursor', () => {
    preferirMenosMovimiento(false);
    const { container } = render(<NodeNetwork />);

    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    expect(ctx.setTransform).toHaveBeenCalled();

    fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });
    cuadro?.(0);

    expect(ctx.clearRect).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('se pausa con la pestaña oculta y se limpia al desmontar', () => {
    preferirMenosMovimiento(false);
    const { unmount } = render(<NodeNetwork />);

    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    fireEvent(document, new Event('visibilitychange'));
    expect(cancelAnimationFrame).toHaveBeenCalled();

    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    fireEvent(document, new Event('visibilitychange'));
    fireEvent(window, new Event('resize'));
    fireEvent.mouseOut(window);
    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it('si el usuario pide menos movimiento no anima', () => {
    preferirMenosMovimiento(true);
    render(<NodeNetwork />);

    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});