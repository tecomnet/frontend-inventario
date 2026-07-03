// Catálogo de Presentaciones. Equivale a getPresentacion del panel viejo.
import DescripcionCatalog from '../components/DescripcionCatalog';
import { API } from '../lib/api';

export default function Presentaciones() {
  return (
    <DescripcionCatalog
      active="presentaciones"
      titulo="Presentaciones"
      singular="Presentación"
      url={`${API}/Catalogos/presentaciones`}
    />
  );
}
