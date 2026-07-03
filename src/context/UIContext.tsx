// Avisos tipo toast (notify) + overlay de carga (loading).
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type Variant = 'warning' | 'success' | 'danger' | 'info' | 'primary';
interface ToastItem { id: number; message: string; variant: Variant }

interface UI {
  notify: (message: string, variant?: Variant) => void;
  loading: (show: boolean, msg?: string) => void;
}

const UIContext = createContext<UI | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [load, setLoad] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const seq = useRef(0);

  const notify = useCallback((message: string, variant: Variant = 'warning') => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const loading = useCallback((show: boolean, msg = 'Procesando…') => {
    setLoad({ show, msg });
  }, []);

  const claro = (v: Variant) => /warning|light|info/.test(v);

  return (
    <UIContext.Provider value={{ notify, loading }}>
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
