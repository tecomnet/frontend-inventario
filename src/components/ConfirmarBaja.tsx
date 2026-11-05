interface Props{
    mensaje: string | null;
    procesando?: boolean;
    onConfirmar:() => void;
    onCancelar:() => void;
}

export default function ConfirmarBaja({mensaje, procesando, onConfirmar, onCancelar}: Props){
    if (mensaje == null) return null;
    return(
        <>
        <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="confirmarBajaTitulo">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="confirmarBajaTitulo">Dar de baja</h2>
            </div>
            <div className="modal-body">{mensaje}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={procesando}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={onConfirmar} disabled={procesando}>
                {procesando ? 'Dando de baja…' : 'Dar de baja'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}    