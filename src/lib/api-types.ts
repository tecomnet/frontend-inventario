// ============================================================
//  Tipos del contrato con la API de Inventario. Las pantallas importan de aquí,
//  nunca declaran sus propias interfaces de la API.
//
//  - Peticiones (Create*/Update*): GENERADAS desde api/swagger.json con
//    `npm run gen:api` (src/lib/api-schema.d.ts). Si la API cambia un comando,
//    al regenerar el build marca las pantallas que quedaron desalineadas.
//  - Respuestas (*Dto): también generadas (documentadas desde KL-28). Solo se
//    les agregan aquí los campos que el front ya usa y la API aún no publica.
// ============================================================
import type { components } from './api-schema';

type Schemas = components['schemas'];

// ---------------- Peticiones (generadas) ----------------
export type CreateEmpresa = Schemas['CreateEmpresaCommand'];
export type UpdateEmpresa = Schemas['UpdateEmpresaCommand'];
export type CreateProveedor = Schemas['CreateProveedorCommand'];
export type UpdateProveedor = Schemas['UpdateProveedorCommand'];
export type CreateLinea = Schemas['CreateLineaCommand'];
/**
 * Pendiente en inventarioBE: UpdateLineaCommand no recibe idLineaPadre ni
 * esActiva. El front ya los manda para cuando la API los acepte (hoy los ignora).
 */
export type UpdateLinea = Schemas['UpdateLineaCommand'] & { idLineaPadre: number; esActiva: boolean };
export type CreateUnidadNegocio = Schemas['CreateUnidadNegocioCommand'];
export type UpdateUnidadNegocio = Schemas['UpdateUnidadNegocioCommand'];
export type CreateAlmacen = Schemas['CreateAlmacenCommand'];
export type UpdateAlmacen = Schemas['UpdateAlmacenCommand'];
export type CreateProducto = Schemas['CreateProductoCommand'];
export type UpdateProducto = Schemas['UpdateProductoCommand'];
export type UpdateSimDet = Schemas['UpdateSimDetCommand'];
export type EstadoSim = Schemas['EnumSimDet'];
/** Marcas, Presentaciones y Unidades de Medida comparten la misma forma. */
export type CreateDescripcion = Schemas['CreateMarcaCommand'];
export type UpdateDescripcion = Schemas['UpdateMarcaCommand'];

// ---------------- Respuestas (generadas) ----------------
// Fechas: DateTime de .NET, llegan como string ISO.

export type Empresa = Schemas['EmpresaDto'];
export type Proveedor = Schemas['ProveedorDto'];
/** Pendiente en inventarioBE: LineaDto aún no trae idLineaPadre. */
export type Linea = Schemas['LineaDto'] & { idLineaPadre?: number };
/** Ojo: lista id/empresaId, el PUT recibe idUdn/idEmpresa. */
export type UnidadNegocio = Schemas['UnidadNegocioDto'];
/**
 * Ojo: lista id/empresaId/udnId, el PUT recibe idAlmacen/idEmpresa/idUdn.
 * Pendiente en inventarioBE: "id" llega siempre en 0.
 */
export type Almacen = Schemas['AlmacenDto'];
/** "presentacioniD" es el nombre tal cual lo serializa la API. */
export type Producto = Schemas['ProductoDto'];
/**
 * estadoSim llega por nombre (Idle, Activado…); el PUT lo pide por número.
 * Pendiente en inventarioBE: fechaInstalacion, fechaVenta y ultimaFecha (el DTO
 * aún no las trae, pero el PUT sí las recibe).
 */
export type SimDet = Schemas['SimDetDto'] & {
  fechaInstalacion?: string | null;
  fechaVenta?: string | null;
  ultimaFecha?: string | null;
};
export type Existencia = Schemas['ExistenciaDto'];
export type TipoTransaccion = Schemas['TipoTransaccionDto'];
/** Marcas, Presentaciones y Unidades de Medida comparten la misma forma. */
export type CatalogoDescripcion = Schemas['MarcaDto'];
/** Los importadores responden 200 aun si fallan: revisar "exito". */
export type ResultadoImportacion = Schemas['ResultadoImportacionDto'];
