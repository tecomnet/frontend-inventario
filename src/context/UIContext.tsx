// Avisos tipo toast (notify / notifyError) + overlay de carga (loading).
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { describirError, separarCampos } from '../lib/errores';

type Variant = 'warning' | 'success' | 'danger' | 'info' | 'primary';
interface ToastItem { id: number; message: string; variant: Variant }

interface UI {
  notify: (message: string, variant?: Variant) => void;
  /**
   * Aviso único para un error de la API: "<accion>. <mensaje claro según el status>".
   * Los errores de validación de "camposEnPantalla" NO se listan en el aviso:
   * se devuelven para mostrarlos junto a su campo (ver useErroresForm). Los
   * demás sí se listan, para que ningún error quede sin mostrarse.
   */
  notifyError: (
    err: unknown,
    accion: string,
    camposEnPantalla?: readonly string[],
  ) => Record<string, string[]>;
  loading: (show: boolean, msg?: string) => void;
}

// Los errores se leen con más calma (y pueden traer una lista de campos).
const DURACION_MS: Partial<Record<Variant, number>> = { danger: 8000, warning: 6000 };

const UIContext = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [load, setLoad] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const seq = useRef(0);

  const notify = useCallback((message: string, variant: Variant = 'warning') => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), DURACION_MS[variant] ?? 3500);
  }, []);

  const notifyError = useCallback((err: unknown, accion: string, camposEnPantalla: readonly string[] = []) => {
    const d = describirError(err);
    if (d.silencioso) return {};
    const { visibles, resto } = separarCampos(d.campos, camposEnPantalla);
    const otros = Object.entries(resto).flatMap(([campo, msgs]) =>
      msgs.map((m) => `• ${campo ? `${campo}: ` : ''}${m}`));
    const mensaje = Object.keys(visibles).length || !otros.length
      ? d.mensaje
      : 'Hay datos inválidos:';
    notify([`${accion}. ${mensaje}`, ...otros].join('\n'), d.variante);
    return visibles;
  }, [notify]);

  const loading = useCallback((show: boolean, msg = 'Procesando…') => {
    setLoad({ show, msg });
  }, []);

  const claro = (v: Variant) => /warning|light|info/.test(v);

  return (
    <UIContext.Provider value={{ notify, notifyError, loading }}>
      {children}

      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1090 }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show align-items-center text-bg-${t.variant} border-0`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">
                {t.message.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={`btn-close ${claro(t.variant) ? '' : 'btn-close-white'} me-2 m-auto`}
                aria-label="Cerrar"
                onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}
              />
            </div>
          </div>
        ))}
      </div>

      {load.show && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,.35)', zIndex: 1080 }}
        >
          <div className="spinner-border text-light" role="status" />
          <div className="text-light mt-2">{load.msg}</div>
        </div>
      )}
    </UIContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI(): UI {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de <UIProvider>');
  return ctx;
}
