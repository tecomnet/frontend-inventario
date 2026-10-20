// Aviso para pantallas que solo sirven para escribir (p. ej. los importadores)
// cuando el rol del usuario es de solo lectura. Solo es experiencia de
// usuario: la API rechaza igual la operación con 403.
export default function SinPermiso() {
  return (
    <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
      <i className="bi bi-lock" />
      <span>Tu usuario es de solo lectura. No tienes permiso para usar esta pantalla.</span>
    </div>
  );
}
