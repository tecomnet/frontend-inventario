// Catálogo de Marcas. Equivale a getMarcas del panel viejo.
import DescripcionCatalog from '../components/DescripcionCatalog';
import { API } from '../lib/api';

export default function Marcas() {
  return (
    <DescripcionCatalog
      active="marcas"
      titulo="Marcas"
      singular="Marca"
      url={`${API}/Catalogos/marcas`}
    />
  );
}
