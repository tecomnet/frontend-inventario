// Errores de validación de un formulario: el aviso general sale en el toast
// (notifyError) y el de cada campo se muestra junto a él con <CampoError>.
import { useCallback, useState } from 'react';
import { useUI } from '../context/UIContext';
import { erroresDeCampo } from '../lib/errores';

export interface ErroresForm {
  /** Muestra el error de la API; los de validación quedan marcados por campo. */
  capturar: (err: unknown, accion: string) => void;
  /** Mensajes del campo (sin distinguir mayúsculas), o undefined si no tiene. */
  de: (campo: string) => string[] | undefined;
  /** Borra los errores de un campo (al editarlo) o todos (al abrir el form). */
  limpiar: (campo?: string) => void;
}

/** @param campos nombres de los campos que el formulario muestra, como los manda el payload. */
export function useErroresForm(campos: readonly string[]): ErroresForm {
  const { notifyError } = useUI();
  const [errores, setErrores] = useState<Record<string, string[]>>({});

  const capturar = useCallback((err: unknown, accion: string) => {
    setErrores(notifyError(err, accion, campos));
  }, [notifyError, campos]);

  const de = useCallback((campo: string) => erroresDeCampo(errores, campo), [errores]);

  const limpiar = useCallback((campo?: string) => {
    setErrores((prev) => {
      if (campo === undefined) return Object.keys(prev).length ? {} : prev;
      const k = Object.keys(prev).find((c) => c.toLowerCase() === campo.toLowerCase());
      if (!k) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  }, []);

  return { capturar, de, limpiar };
}
