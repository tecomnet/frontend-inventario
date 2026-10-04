// Mensaje de validación debajo de un campo del formulario. El input lleva
// aria-invalid para que admin.css lo marque en rojo.
export default function CampoError({ mensajes }: { mensajes?: string[] }) {
  if (!mensajes?.length) return null;
  return (
    <div className="campo-error" role="alert">
      {mensajes.map((m, i) => <div key={i}>{m}</div>)}
    </div>
  );
}
