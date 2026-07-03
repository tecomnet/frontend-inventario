// Catálogo de Unidades de Medida. Equivale a getUnidadMedida del panel viejo.
import DescripcionCatalog from '../components/DescripcionCatalog';
import { API } from '../lib/api';

export default function UnidadesMedida() {
  return (
    <DescripcionCatalog
      active="unidades-medida"
      titulo="Unidades de Medida"
      singular="Unidad de Medida"
      url={`${API}/Catalogos/unidadesmedida`}
    />
  );
}
