// Importador de Inventario (archivo + datos del lote).
// Equivale a renderImportador / enviarImportador del panel viejo.
import { useRef, useState } from 'react';
import AppLayout from '../components/AppLayout';
import SinPermiso from '../components/SinPermiso';
import { useUI } from '../context/UIContext';
import { usePermisos } from '../hooks/usePermisos';
import { API, sendForm } from '../lib/api';
import type { ResultadoImportacion } from '../lib/api-types';

export default function Importador() {
  const { notify, notifyError } = useUI();
  const { puedeEscribir } = usePermisos();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [material, setMaterial] = useState('');
  const [tipo, setTipo] = useState('');
  const [lote, setLote] = useState('');
  const [fecha, setFecha] = useState('');
  const [enviando, setEnviando] = useState(false);

  const setFile = (files: FileList | null) => {
    if (files && files[0]) {
      if (fileRef.current) fileRef.current.files = files;
      setFileName(files[0].name);
    }
  };

  const importar = async () => {
    const archivo = fileRef.current?.files?.[0];
    if (!archivo) { notify('Falta archivo'); return; }
    const form = new FormData();
    form.append('archivo', archivo);
    form.append('material', material);
    form.append('tipo', tipo);
    form.append('loteTecomnet', lote);
    form.append('dtFechaCompra', fecha);
    setEnviando(true);
    try {
      const data = await sendForm<Partial<ResultadoImportacion> | undefined>(`${API}/importador/importador`, form);
      // La API responde 200 con exito=false cuando el archivo trae errores.
      if (!data?.exito) {
        const lista = data?.errores?.length ? data.errores : ['La API no detalló el error.'];
        notify('Error en la importación:\n' + lista.map((e) => `• ${e}`).join('\n'), 'danger');
        return;
      }
      notify(`Importación exitosa. Registros: ${data.total ?? 0}`, 'success');
    } catch (err) {
      notifyError(err, 'No se pudo importar el archivo');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AppLayout active="importador">
      <div className="mb-4">
        <span className="eyebrow">Importador</span>
        <h1 className="page-title mb-0"><i className="bi bi-file-arrow-up" /> Importador de Inventario</h1>
        <p className="page-subtitle">Carga tu archivo y configura los datos del lote.</p>
      </div>

      {!puedeEscribir ? <SinPermiso /> : (
      <div className="form-card">
        <div
          className={`drop-zone${dragging ? ' active' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files); }}
        >
          <p>{fileName ? `✅ ${fileName}` : <><i className="bi bi-cloud-arrow-up" /> Arrastra tu archivo aquí o haz click</>}</p>
          <input ref={fileRef} type="file" style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files)} />
        </div>

        <div className="form-grid">
          <div className="form-group"><label>Material</label>
            <input type="number" value={material} onChange={(e) => setMaterial(e.target.value)} /></div>
          <div className="form-group"><label>Tipo</label>
            <input type="number" value={tipo} onChange={(e) => setTipo(e.target.value)} /></div>
          <div className="form-group"><label>Lote</label>
            <input type="text" value={lote} onChange={(e) => setLote(e.target.value)} /></div>
          <div className="form-group"><label>Fecha de compra</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
        </div>

        <button className="btn btn-tec" onClick={importar} disabled={enviando}>
          <i className="bi bi-upload" /> {enviando ? 'Importando…' : 'Importar archivo'}
        </button>
      </div>
      )}
    </AppLayout>
  );
}
