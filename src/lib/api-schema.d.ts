// ARCHIVO GENERADO por `npm run gen:api`. No editar a mano.
// Origen: api/swagger.json (Tecomnet Inventario API v1)

export interface paths {
    "/api/Ajustes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista los ajustes de inventario.
         * @description Sin page ni pageSize devuelve el arreglo completo; con cualquiera de los dos responde un PagedResult. empresaId, udnId, fechaDesde y fechaHasta filtran en ambos modos.
         */
        get: operations["Ajustes_GetAll"];
        put?: never;
        /**
         * Registra un ajuste de inventario.
         * @description Devuelve el ajuste registrado.
         */
        post: operations["Ajustes_Registrar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Ajustes/buscar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Busca un ajuste por id.
         * @description Recibe la consulta en el cuerpo de la petición.
         */
        get: operations["Ajustes_GetById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Inicia sesión y devuelve un JWT. */
        post: operations["Auth_Login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/almacenes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista los almacenes.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetAlmacenes"];
        put?: never;
        /**
         * Crea un almacén.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateAlmacen"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/almacenes/{empresaId}/{udnId}/{almacenId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza un almacén.
         * @description Responde 400 si la clave de la ruta (empresa, udn y almacén) no coincide con la del cuerpo.
         */
        put: operations["Catalogos_UpdateAlmacen"];
        post?: never;
        /** Elimina un almacén. */
        delete: operations["Catalogos_DeleteAlmacen"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/empresas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las empresas.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetEmpresas"];
        put?: never;
        /**
         * Crea una empresa.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateEmpresa"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/empresas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una empresa.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateEmpresa"];
        post?: never;
        /** Elimina una empresa. */
        delete: operations["Catalogos_DeleteEmpresa"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/lineas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las líneas.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetLineas"];
        put?: never;
        /**
         * Crea una línea.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateLinea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/lineas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una línea.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateLinea"];
        post?: never;
        /** Elimina una línea. */
        delete: operations["Catalogos_DeleteLinea"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/marcas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las marcas.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetMarcas"];
        put?: never;
        /**
         * Crea una marca.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateMarca"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/marcas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una marca.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateMarca"];
        post?: never;
        /** Elimina una marca. */
        delete: operations["Catalogos_DeleteMarca"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/presentaciones": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las presentaciones.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetPresentaciones"];
        put?: never;
        /**
         * Crea una presentación.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreatePresentacion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/presentaciones/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una presentación.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdatePresentacion"];
        post?: never;
        /** Elimina una presentación. */
        delete: operations["Catalogos_DeletePresentacion"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/proveedores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista los proveedores.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetProveedores"];
        put?: never;
        /**
         * Crea un proveedor.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateProveedor"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/proveedores/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza un proveedor.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateProveedor"];
        post?: never;
        /** Elimina un proveedor. */
        delete: operations["Catalogos_DeleteProveedor"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/simdet": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las SIMs (SimDet).
         * @description Sin page, pageSize, search ni ninguno de los filtros lote, estadoSim o productoId devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetSimDets"];
        put?: never;
        /**
         * Crea una SIM (SimDet).
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateSimDet"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/simdet/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una SIM (SimDet).
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateSimDet"];
        post?: never;
        /** Elimina una SIM (SimDet). */
        delete: operations["Catalogos_DeleteSimDet"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/tipostransaccion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista los tipos de transacción.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetTiposTransaccion"];
        put?: never;
        /**
         * Crea un tipo de transacción.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateTipoTransaccion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/tipostransaccion/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza un tipo de transacción.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateTipoTransaccion"];
        post?: never;
        /** Elimina un tipo de transacción. */
        delete: operations["Catalogos_DeleteTipoTransaccion"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/unidadesmedida": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las unidades de medida.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetUnidadesMedida"];
        put?: never;
        /**
         * Crea una unidad de medida.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateUnidadMedida"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/unidadesmedida/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una unidad de medida.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateUnidadMedida"];
        post?: never;
        /** Elimina una unidad de medida. */
        delete: operations["Catalogos_DeleteUnidadMedida"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/unidadesnegocio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las unidades de negocio.
         * @description Sin page, pageSize ni search devuelve el arreglo completo; con cualquiera de ellos responde un PagedResult.
         */
        get: operations["Catalogos_GetUnidadesNegocio"];
        put?: never;
        /**
         * Crea una unidad de negocio.
         * @description Devuelve el registro creado.
         */
        post: operations["Catalogos_CreateUnidadNegocio"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Catalogos/unidadesnegocio/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una unidad de negocio.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Catalogos_UpdateUnidadNegocio"];
        post?: never;
        /** Elimina una unidad de negocio. */
        delete: operations["Catalogos_DeleteUnidadNegocio"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Compras": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las compras.
         * @description Sin page ni pageSize devuelve el arreglo completo; con cualquiera de los dos responde un PagedResult. empresaId y udnId filtran en ambos modos.
         */
        get: operations["Compras_GetAll"];
        put?: never;
        /**
         * Registra una compra.
         * @description Devuelve la compra registrada.
         */
        post: operations["Compras_Registrar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Compras/buscar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Busca una compra por id. */
        get: operations["Compras_GetById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Compras/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una compra.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Compras_Update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Existencias": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las existencias.
         * @description Sin page ni pageSize devuelve el arreglo completo; con cualquiera de los dos responde un PagedResult. idAlmacen e idProducto filtran en ambos modos.
         */
        get: operations["Existencias_GetAll"];
        put?: never;
        /**
         * Crea una existencia.
         * @description Devuelve el registro creado.
         */
        post: operations["Existencias_Create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Existencias/buscar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Busca una existencia por su clave.
         * @description La clave es la combinación de empresa, almacén, udn y producto.
         */
        get: operations["Existencias_GetById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Existencias/{empresaId}/{almacenId}/{udnId}/{productoId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una existencia.
         * @description Responde 400 si la clave de la ruta no coincide con la del cuerpo.
         */
        put: operations["Existencias_Update"];
        post?: never;
        /** Elimina una existencia. */
        delete: operations["Existencias_Delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Importador/Importador": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Importa productos desde un archivo.
         * @description Además de los productos, genera la compra, la recepción, el movimiento y el kardex, y afecta existencias. Un archivo vacío no es un error HTTP: responde 200 con Exito = false y el motivo en Errores.
         */
        post: operations["Importador_CreateImportador"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Importador/ImportadorSims": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Importa SIMs desde un archivo.
         * @description Solo da de alta las SIMs; no genera documentos ni afecta existencias. Un archivo vacío no es un error HTTP: responde 200 con Exito = false y el motivo en Errores.
         */
        post: operations["Importador_CreateImportadorSims"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Kardex": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista los registros del kardex.
         * @description Sin page ni pageSize devuelve el arreglo completo; con cualquiera de los dos responde un PagedResult. idProducto e idEmpresa filtran en ambos modos.
         */
        get: operations["Kardex_GetAll"];
        put?: never;
        /**
         * Crea un registro del kardex.
         * @description Devuelve el registro creado.
         */
        post: operations["Kardex_Create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Kardex/buscar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Busca un registro del kardex por id. */
        get: operations["Kardex_GetById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/MovimientosDeAlmacen": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista los movimientos de almacén.
         * @description Sin page ni pageSize devuelve el arreglo completo; con cualquiera de los dos responde un PagedResult. empresaId, udnId, fechaDesde y fechaHasta filtran en ambos modos.
         */
        get: operations["MovimientosDeAlmacen_GetAll"];
        put?: never;
        /**
         * Registra un movimiento de almacén.
         * @description Devuelve el movimiento registrado.
         */
        post: operations["MovimientosDeAlmacen_Registrar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/MovimientosDeAlmacen/buscar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Busca un movimiento por id.
         * @description Recibe la consulta en el cuerpo de la petición.
         */
        get: operations["MovimientosDeAlmacen_GetById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/MovimientosDeAlmacen/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza un movimiento de almacén.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["MovimientosDeAlmacen_Update"];
        post?: never;
        /** Elimina un movimiento de almacén. */
        delete: operations["MovimientosDeAlmacen_Delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Productos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Sin parametros devuelve el arreglo completo, igual que siempre, para no
         *     romper a quien ya consume este endpoint. En cuanto llega page, pageSize o
         *     search, responde un PagedResult con el total y la informacion de pagina.
         *     Ver KL-12.
         */
        get: operations["Productos_GetAll"];
        put?: never;
        /**
         * Crea un producto.
         * @description Devuelve el registro creado.
         */
        post: operations["Productos_Create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Productos/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza un producto.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo.
         */
        put: operations["Productos_Update"];
        post?: never;
        /** Elimina un producto. */
        delete: operations["Productos_Delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Productos/proveedores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Version paginada. A diferencia de POST proveedores, IdProducto es
         *     opcional: sin el se listan todas las relaciones, ya acotadas por la
         *     paginacion. Ver KL-12.
         */
        get: operations["Productos_GetProveedoresPaginados"];
        put?: never;
        /**
         * Lista los proveedores de un producto.
         * @description Es una consulta aunque use POST: no modifica nada. Para la versión paginada, ver GET proveedores.
         */
        post: operations["Productos_GetProveedores"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Productos/proveedor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Relaciona un proveedor con un producto.
         * @description Devuelve la relación creada.
         */
        post: operations["Productos_AddProveedor"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Productos/proveedor/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una relación producto-proveedor.
         * @description Responde 400 si el id de la ruta no coincide con IdProductoProveedor del cuerpo.
         */
        put: operations["Productos_UpdateProveedor"];
        post?: never;
        /** Elimina una relación producto-proveedor. */
        delete: operations["Productos_RemoveProveedor"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Recepciones": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lista las recepciones.
         * @description Sin page ni pageSize devuelve el arreglo completo; con cualquiera de los dos responde un PagedResult. empresaId y udnId filtran en ambos modos.
         */
        get: operations["Recepciones_GetAll"];
        put?: never;
        /**
         * Registra una recepción.
         * @description Devuelve la recepción registrada.
         */
        post: operations["Recepciones_Registrar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Recepciones/buscar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Busca una recepción por id. */
        get: operations["Recepciones_GetById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/Recepciones/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Actualiza una recepción.
         * @description Responde 400 si el id de la ruta no coincide con el del cuerpo o si el cambio de estado no está permitido.
         */
        put: operations["Recepciones_Update"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AjusteDetalleDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            ajusteId: number;
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            renglon: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPiezas: number;
            /** Format: double */
            costo: number | null;
        };
        AjusteDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            tipoTransaccionId: number;
            /** Format: int32 */
            almacenId: number | null;
            transaccion: string | null;
            serie: string | null;
            /** Format: int32 */
            folio: number | null;
            /** Format: date-time */
            fecha: string;
            referencia: string | null;
            observaciones: string | null;
            /** Format: int32 */
            estadoId: number;
            isDeleted: boolean;
            ajusteDet: components["schemas"]["AjusteDetalleDto"][];
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        AjusteDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["AjusteDto"][];
        };
        AlmacenDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            descripcion: string;
            tipo: string;
            esActivo: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        AlmacenDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["AlmacenDto"][];
        };
        CompraDetalleDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            idCompraEnc: number;
            /** Format: int32 */
            idEmpresa: number;
            /** Format: int32 */
            idUdn: number;
            transaccion: string;
            serie: string;
            /** Format: int32 */
            folio: number;
            /** Format: int32 */
            renglon: number;
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPieza: number;
            /** Format: double */
            costoProveedor: number;
            /** Format: double */
            costoUnitario: number;
            /** Format: double */
            total: number;
        };
        CompraDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            transaccion: string;
            serie: string;
            /** Format: int32 */
            folio: number | null;
            folioProveedor: string | null;
            uudI_Factura: string | null;
            banco: string | null;
            referenciaPago: string | null;
            /** Format: date-time */
            fechaPago: string;
            /** Format: date-time */
            fechaCompra: string;
            /** Format: int32 */
            idProveedor: number;
            referencia: string | null;
            referenciaRecepcion: string | null;
            observaciones: string | null;
            /** Format: int32 */
            estadoId: number;
            isDeleted: boolean;
            /** Format: date-time */
            fechaModificacion: string;
            compraDet: components["schemas"]["CompraDetalleDto"][];
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        CompraDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["CompraDto"][];
        };
        CreateAjusteDetalleCommand: {
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPiezas: number;
            /** Format: double */
            costo: number;
        };
        CreateAlmacenCommand: {
            descripcion: string;
            tipo: string;
            /** Format: int32 */
            idEmpresa: number;
            /** Format: int32 */
            idUdn: number;
            esActivo?: boolean | null;
        };
        CreateCompraDetalleCommand: {
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPieza: number;
            /** Format: double */
            costoProveedor: number;
            /** Format: double */
            costoUnitario: number;
        };
        CreateEmpresaCommand: {
            descripcion: string;
            rfc: string;
            esActiva?: boolean | null;
        };
        CreateExistenciaCommand: {
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            almacenId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPiezas: number;
            /** Format: double */
            costoUnitario: number;
        };
        CreateKardexCommand: {
            /** Format: int32 */
            idEmpresa: number;
            /** Format: int32 */
            idUdn: number;
            transaccion: string;
            serie: string;
            /** Format: int32 */
            folio: number;
            /** Format: int32 */
            renglon: number;
            /** Format: int32 */
            idProducto: number;
            /** Format: date-time */
            fechaMovimiento: string;
            naturaleza: boolean;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            piezas: number;
        };
        CreateLineaCommand: {
            descripcion: string;
            /** Format: int32 */
            idLineaPadre: number;
            esActiva?: boolean | null;
        };
        CreateMarcaCommand: {
            descripcion: string;
            esActiva?: boolean | null;
        };
        CreateMovimientoDetalleCommand: {
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPiezas: number;
            /** Format: double */
            costoUnitario: number;
            loteAltan?: string | null;
            loteTecomnet?: string | null;
        };
        CreatePresentacionCommand: {
            descripcion: string;
            esActiva?: boolean | null;
        };
        CreateProductoCommand: {
            codInterno: string;
            descripcion: string;
            /** Format: int32 */
            marcaId?: number | null;
            /** Format: int32 */
            lineaId?: number | null;
            /** Format: int32 */
            presentacionId?: number | null;
            /** Format: int32 */
            unidadMedidaId?: number | null;
            /** Format: int32 */
            materialId?: number | null;
            /** Format: double */
            iva?: number | null;
            /** Format: double */
            ieps?: number | null;
            esActivo?: boolean | null;
        };
        CreateProductoProveedorCommand: {
            /** Format: int32 */
            idProducto: number;
            /** Format: int32 */
            idProveedor: number;
            /** Format: double */
            costo1: number;
            /** Format: double */
            costo2: number;
        };
        CreateProveedorCommand: {
            descripcion: string;
            contacto?: string | null;
            /** Format: int32 */
            diasCredito?: number | null;
            esActivo?: boolean | null;
        };
        CreateRecepcionDetalleCommand: {
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPieza: number;
        };
        CreateSimDetCommand: {
            bE_ID: string;
            imsi: string;
            iccid: string;
            msisdn: string;
            pin: string;
            puk: string;
            /** Format: int32 */
            productoId: number;
            loteTecomnet: string;
            loteALtan: string;
            /** Format: date-time */
            fechaRegistro: string;
            /** Format: date-time */
            fechaCompra: string;
            /** Format: date-time */
            fechaRecepcion: string;
            estadoSim?: components["schemas"]["EnumSimDet"];
        };
        CreateTipoTransaccionCommand: {
            descripcion: string;
            /** Format: int32 */
            naturaleza: number;
        };
        CreateUnidadMedidaCommand: {
            descripcion: string;
            esActiva?: boolean | null;
        };
        CreateUnidadNegocioCommand: {
            descripcion: string;
            /** Format: int32 */
            idEmpresa: number;
            esActiva?: boolean | null;
        };
        EmpresaDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            rfc: string;
            esActiva: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        EmpresaDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["EmpresaDto"][];
        };
        /**
         * Format: int32
         * @enum {integer}
         */
        EnumSimDet: 1 | 2 | 3 | 4 | 5;
        ExistenciaDto: {
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            almacenId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPiezas: number;
            /** Format: double */
            costoUnitario: number;
            /** Format: date-time */
            ultimaActualizacion: string;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        ExistenciaDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["ExistenciaDto"][];
        };
        GetAjusteByIdQuery: {
            /** Format: int32 */
            id: number;
        };
        GetMovimientoByIdQuery: {
            /** Format: int32 */
            id: number;
        };
        GetProductoProveedoresQuery: {
            /** Format: int32 */
            idProducto: number;
        };
        KardexDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            idEmpresa: number;
            /** Format: int32 */
            idUdn: number;
            transaccion: string;
            serie: string;
            /** Format: int32 */
            folio: number;
            /** Format: int32 */
            renglon: number;
            /** Format: int32 */
            idProducto: number;
            /** Format: date-time */
            fechaMovimiento: string;
            /** Format: date-time */
            fechaKardex: string;
            naturaleza: boolean;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            piezas: number;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        KardexDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["KardexDto"][];
        };
        LineaDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            esActiva: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        LineaDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["LineaDto"][];
        };
        LoginRequest: {
            username?: string;
            password?: string;
        };
        MarcaDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            esActiva: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        MarcaDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["MarcaDto"][];
        };
        MovimientoDetalleDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            movimientoId: number;
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            renglon: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPiezas: number;
            /** Format: double */
            costoUnitario: number | null;
            loteAltan: string | null;
            loteTecomnet: string | null;
        };
        MovimientoDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            tipoTransaccionId: number;
            /** Format: int32 */
            almacenId: number;
            transaccion: string | null;
            serie: string | null;
            /** Format: int32 */
            folio: number | null;
            /** Format: date-time */
            fecha: string;
            referencia: string | null;
            observaciones: string | null;
            /** Format: int32 */
            estadoId: number;
            isDeleted: boolean;
            movimientoDet: components["schemas"]["MovimientoDetalleDto"][];
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        MovimientoDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["MovimientoDto"][];
        };
        PresentacionDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            esActiva: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        PresentacionDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["PresentacionDto"][];
        };
        ProductoDto: {
            /** Format: int32 */
            id: number;
            codInterno: string;
            descripcion: string;
            /** Format: int32 */
            marcaId: number;
            marcaDescripcion: string | null;
            /** Format: int32 */
            lineaId: number;
            lineaDescripcion: string | null;
            /** Format: int32 */
            presentacioniD: number;
            presentacionDescripcion: string | null;
            /** Format: int32 */
            unidadMedidaId: number;
            /** Format: int32 */
            materialId: number;
            materialDescripcion: string | null;
            /** Format: double */
            iva: number;
            /** Format: double */
            ieps: number;
            esActivo: boolean;
            isDeleted: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        ProductoDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["ProductoDto"][];
        };
        ProductoProveedorDto: {
            /** Format: int32 */
            idProductoProveedor: number;
            /** Format: int32 */
            idProducto: number;
            /** Format: int32 */
            idProveedor: number;
            /** Format: double */
            costo1: number;
            /** Format: double */
            costo2: number;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        ProductoProveedorDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["ProductoProveedorDto"][];
        };
        ProveedorDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            contacto: string | null;
            /** Format: int32 */
            diasCredito: number | null;
            esActivo: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        ProveedorDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["ProveedorDto"][];
        };
        RecepcionDetalleDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            idRecepcionEnc: number;
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            transaccion: string;
            serie: string;
            /** Format: int32 */
            folio: number;
            /** Format: int32 */
            renglon: number;
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad: number;
            /** Format: int32 */
            cantidadPieza: number;
        };
        RecepcionDto: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            transaccion: string;
            serie: string;
            /** Format: int32 */
            folio: number | null;
            /** Format: date-time */
            fechaRecepcion: string;
            referencia: string | null;
            referenciaCompra: string;
            /** Format: int32 */
            estadoId: number;
            isDeleted: boolean;
            /** Format: date-time */
            fechaModificacion: string;
            recepcionDet: components["schemas"]["RecepcionDetalleDto"][];
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        RecepcionDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["RecepcionDto"][];
        };
        RegistrarAjusteCommand: {
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            tipoTransaccionId: number;
            /** Format: int32 */
            almacenId: number;
            observaciones?: string | null;
            /** Format: int32 */
            estadoId: number;
            detalles: components["schemas"]["CreateAjusteDetalleCommand"][];
        };
        RegistrarCompraCommand: {
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            proveedorId: number;
            /** Format: date-time */
            fechaCompra?: string | null;
            folioProveedor?: string | null;
            uudI_Factura?: string | null;
            banco?: string | null;
            referenciaPago?: string | null;
            /** Format: date-time */
            fechaPago?: string | null;
            observaciones?: string | null;
            /** Format: int32 */
            estadoId: number;
            detalles: components["schemas"]["CreateCompraDetalleCommand"][];
        };
        RegistrarMovimientoCommand: {
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            tipoTransaccionId: number;
            /** Format: int32 */
            almacenId: number;
            observaciones?: string | null;
            /** Format: int32 */
            estadoId: number;
            detalles: components["schemas"]["CreateMovimientoDetalleCommand"][];
        };
        RegistrarRecepcionCommand: {
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: date-time */
            fechaRecepcion?: string | null;
            referenciaCompra?: string | null;
            detalles: components["schemas"]["CreateRecepcionDetalleCommand"][];
        };
        /** @description Cuerpo de las respuestas de error de la API. */
        RespuestaDeError: {
            /** @description Descripcion del error, legible para el usuario. */
            error: string;
            /**
             * @description Identificador de la peticion para buscarla en los logs. Solo lo incluyen
             *     los errores que pasan por el middleware (409, 500 y algunos 400).
             */
            traceId?: string | null;
        };
        /** @description Resultado de un inicio de sesion correcto. Ver KL-28. */
        RespuestaDeLogin: {
            /** @description JWT que se manda como "Authorization: Bearer {token}". */
            token: string;
        };
        /**
         * @description Confirmacion de una operacion que no devuelve el registro afectado, como
         *     actualizar o eliminar un catalogo. Ver KL-28.
         */
        RespuestaDeMensaje: {
            /** @description Texto de confirmacion, legible para el usuario. */
            mensaje: string;
        };
        ResultadoImportacionDto: {
            /** Format: int32 */
            total: number;
            exito: boolean;
            errores: string[];
        };
        SimDetDto: {
            /** Format: int32 */
            id: number;
            bE_ID: string;
            imsi: string | null;
            iccid: string | null;
            msisdn: string | null;
            /** Format: int32 */
            idProducto: number;
            productoDescripcion: string | null;
            loteTecomnet: string | null;
            loteALtan: string | null;
            /** Format: date-time */
            fechaRegistro: string;
            estadoSim: string;
            /** Format: date-time */
            fechaCompra: string;
            /** Format: date-time */
            fechaRecepcion: string;
            /** Format: date-time */
            fechaEntrega: string | null;
            /** Format: date-time */
            fechaActivacion: string | null;
            /** Format: date-time */
            fechaSuspencion: string | null;
            /** Format: date-time */
            fechaReactivacion: string | null;
            /** Format: date-time */
            fechaInicioFacturacion: string | null;
            /** Format: date-time */
            fechaBaja: string | null;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        SimDetDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["SimDetDto"][];
        };
        TipoTransaccionDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            /** Format: int32 */
            naturaleza: number;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        TipoTransaccionDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["TipoTransaccionDto"][];
        };
        UnidadMedidaDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            esActiva: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        UnidadMedidaDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["UnidadMedidaDto"][];
        };
        UnidadNegocioDto: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            /** Format: int32 */
            empresaId: number;
            esActiva: boolean;
        };
        /**
         * @description Respuesta estandar de los GET paginados: la pagina de datos mas lo que el
         *     cliente necesita para pintar el paginador. Existe para que todos los
         *     endpoints devuelvan la misma forma en vez de un objeto anonimo distinto por
         *     consulta. Ver KL-12.
         */
        UnidadNegocioDtoPagedResult: {
            /**
             * Format: int32
             * @description Total de registros que cumplen el filtro, sin paginar.
             */
            totalRecords: number;
            /**
             * Format: int32
             * @description Pagina devuelta, base 1.
             */
            page: number;
            /**
             * Format: int32
             * @description Tamano de pagina efectivo (ya topado por el servidor).
             */
            pageSize: number;
            /**
             * Format: int32
             * @description Paginas totales. Devuelve 0 si el tamano de pagina no es valido.
             */
            readonly totalPages: number;
            /** @description Los registros de esta pagina. */
            data: components["schemas"]["UnidadNegocioDto"][];
        };
        UpdateAlmacenCommand: {
            /** Format: int32 */
            idAlmacen: number;
            /** Format: int32 */
            idEmpresa: number;
            /** Format: int32 */
            idUdn: number;
            descripcion: string;
            tipo: string;
            esActivo: boolean | null;
        };
        UpdateCompraCommand: {
            /** Format: int32 */
            id: number;
            /** Format: int32 */
            proveedorId: number | null;
            folioProveedor?: string | null;
            uudI_Factura?: string | null;
            banco?: string | null;
            referenciaPago?: string | null;
            /** Format: date-time */
            fechaPago: string | null;
            /** Format: date-time */
            fechaCompra: string | null;
            observaciones?: string | null;
            /** Format: int32 */
            estadoId: number | null;
            detalles?: components["schemas"]["CreateCompraDetalleCommand"][] | null;
        };
        UpdateEmpresaCommand: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            rfc: string;
            esActiva: boolean | null;
        };
        UpdateExistenciaCommand: {
            /** Format: int32 */
            empresaId: number;
            /** Format: int32 */
            almacenId: number;
            /** Format: int32 */
            udnId: number;
            /** Format: int32 */
            productoId: number;
            /** Format: int32 */
            cantidad?: number | null;
            /** Format: int32 */
            cantidadPiezas?: number | null;
            /** Format: double */
            costoUnitario?: number | null;
        };
        UpdateLineaCommand: {
            /** Format: int32 */
            id: number;
            descripcion: string;
        };
        UpdateMarcaCommand: {
            /** Format: int32 */
            id: number;
            descripcion: string;
        };
        UpdateMovimientoCommand: {
            /** Format: int32 */
            id: number;
            referencia?: string | null;
            observaciones?: string | null;
            /** Format: int32 */
            estadoId: number | null;
        };
        UpdatePresentacionCommand: {
            /** Format: int32 */
            id: number;
            descripcion: string;
        };
        UpdateProductoCommand: {
            /** Format: int32 */
            id: number;
            codInterno: string;
            descripcion: string;
            /** Format: int32 */
            marcaId?: number | null;
            /** Format: int32 */
            lineaId?: number | null;
            /** Format: int32 */
            presentacionId?: number | null;
            /** Format: int32 */
            unidadMedidaId?: number | null;
            /** Format: int32 */
            materialId?: number | null;
            /** Format: double */
            iva?: number | null;
            /** Format: double */
            ieps?: number | null;
            esActivo: boolean | null;
        };
        UpdateProductoProveedorCommand: {
            /** Format: int32 */
            idProductoProveedor: number;
        };
        UpdateProveedorCommand: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            contacto?: string | null;
            /** Format: int32 */
            diasCredito?: number | null;
            esActivo: boolean | null;
        };
        UpdateRecepcionCommand: {
            /** Format: int32 */
            id: number;
            /** Format: date-time */
            fechaRecepcion: string | null;
            referenciaCompra: string;
            /** Format: int32 */
            estadoId: number | null;
            /** Format: int32 */
            almacenId?: number | null;
            detalles?: components["schemas"]["CreateRecepcionDetalleCommand"][] | null;
        };
        UpdateSimDetCommand: {
            /** Format: int32 */
            id: number;
            estadoSim: components["schemas"]["EnumSimDet"];
            /** Format: date-time */
            fechaInstalacion?: string | null;
            /** Format: date-time */
            fechaActivacion?: string | null;
            /** Format: date-time */
            fechaReactivacion?: string | null;
            /** Format: date-time */
            fechaSuspencion?: string | null;
            /** Format: date-time */
            fechaInicioFacturacion?: string | null;
            /** Format: date-time */
            fechaVenta?: string | null;
            /** Format: date-time */
            ultimaFecha?: string | null;
            /** Format: date-time */
            fechaEntrega?: string | null;
            /** Format: date-time */
            fechaBaja?: string | null;
        };
        UpdateTipoTransaccionCommand: {
            /** Format: int32 */
            id: number;
            descripcion: string;
            /** Format: int32 */
            naturaleza: number | null;
        };
        UpdateUnidadMedidaCommand: {
            /** Format: int32 */
            id: number;
            descripcion: string;
        };
        UpdateUnidadNegocioCommand: {
            /** Format: int32 */
            idUdn: number;
            descripcion: string;
            /** Format: int32 */
            idEmpresa: number | null;
            esActiva: boolean | null;
        };
        ValidationProblemDetails: {
            type?: string | null;
            title?: string | null;
            /** Format: int32 */
            status?: number | null;
            detail?: string | null;
            instance?: string | null;
            errors?: {
                [key: string]: string[];
            };
        } & {
            [key: string]: unknown;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    Ajustes_GetAll: {
        parameters: {
            query?: {
                FechaDesde?: string;
                FechaHasta?: string;
                EmpresaId?: number;
                UdnId?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AjusteDto"][] | components["schemas"]["AjusteDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Ajustes_Registrar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RegistrarAjusteCommand"];
                "text/json": components["schemas"]["RegistrarAjusteCommand"];
                "application/*+json": components["schemas"]["RegistrarAjusteCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["AjusteDto"];
                    "application/json": components["schemas"]["AjusteDto"];
                    "text/json": components["schemas"]["AjusteDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Ajustes_GetById: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["GetAjusteByIdQuery"];
                "text/json": components["schemas"]["GetAjusteByIdQuery"];
                "application/*+json": components["schemas"]["GetAjusteByIdQuery"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["AjusteDto"];
                    "application/json": components["schemas"]["AjusteDto"];
                    "text/json": components["schemas"]["AjusteDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Auth_Login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
                "text/json": components["schemas"]["LoginRequest"];
                "application/*+json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeLogin"];
                    "application/json": components["schemas"]["RespuestaDeLogin"];
                    "text/json": components["schemas"]["RespuestaDeLogin"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetAlmacenes: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AlmacenDto"][] | components["schemas"]["AlmacenDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateAlmacen: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateAlmacenCommand"];
                "text/json": components["schemas"]["CreateAlmacenCommand"];
                "application/*+json": components["schemas"]["CreateAlmacenCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["AlmacenDto"];
                    "application/json": components["schemas"]["AlmacenDto"];
                    "text/json": components["schemas"]["AlmacenDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateAlmacen: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                empresaId: number;
                udnId: number;
                almacenId: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateAlmacenCommand"];
                "text/json": components["schemas"]["UpdateAlmacenCommand"];
                "application/*+json": components["schemas"]["UpdateAlmacenCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteAlmacen: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                empresaId: number;
                udnId: number;
                almacenId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetEmpresas: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmpresaDto"][] | components["schemas"]["EmpresaDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateEmpresa: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateEmpresaCommand"];
                "text/json": components["schemas"]["CreateEmpresaCommand"];
                "application/*+json": components["schemas"]["CreateEmpresaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["EmpresaDto"];
                    "application/json": components["schemas"]["EmpresaDto"];
                    "text/json": components["schemas"]["EmpresaDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateEmpresa: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateEmpresaCommand"];
                "text/json": components["schemas"]["UpdateEmpresaCommand"];
                "application/*+json": components["schemas"]["UpdateEmpresaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteEmpresa: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetLineas: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LineaDto"][] | components["schemas"]["LineaDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateLinea: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateLineaCommand"];
                "text/json": components["schemas"]["CreateLineaCommand"];
                "application/*+json": components["schemas"]["CreateLineaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["LineaDto"];
                    "application/json": components["schemas"]["LineaDto"];
                    "text/json": components["schemas"]["LineaDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateLinea: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateLineaCommand"];
                "text/json": components["schemas"]["UpdateLineaCommand"];
                "application/*+json": components["schemas"]["UpdateLineaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteLinea: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetMarcas: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MarcaDto"][] | components["schemas"]["MarcaDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateMarca: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateMarcaCommand"];
                "text/json": components["schemas"]["CreateMarcaCommand"];
                "application/*+json": components["schemas"]["CreateMarcaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["MarcaDto"];
                    "application/json": components["schemas"]["MarcaDto"];
                    "text/json": components["schemas"]["MarcaDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateMarca: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateMarcaCommand"];
                "text/json": components["schemas"]["UpdateMarcaCommand"];
                "application/*+json": components["schemas"]["UpdateMarcaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteMarca: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetPresentaciones: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PresentacionDto"][] | components["schemas"]["PresentacionDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreatePresentacion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreatePresentacionCommand"];
                "text/json": components["schemas"]["CreatePresentacionCommand"];
                "application/*+json": components["schemas"]["CreatePresentacionCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["PresentacionDto"];
                    "application/json": components["schemas"]["PresentacionDto"];
                    "text/json": components["schemas"]["PresentacionDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdatePresentacion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdatePresentacionCommand"];
                "text/json": components["schemas"]["UpdatePresentacionCommand"];
                "application/*+json": components["schemas"]["UpdatePresentacionCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeletePresentacion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetProveedores: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProveedorDto"][] | components["schemas"]["ProveedorDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateProveedor: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateProveedorCommand"];
                "text/json": components["schemas"]["CreateProveedorCommand"];
                "application/*+json": components["schemas"]["CreateProveedorCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ProveedorDto"];
                    "application/json": components["schemas"]["ProveedorDto"];
                    "text/json": components["schemas"]["ProveedorDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateProveedor: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateProveedorCommand"];
                "text/json": components["schemas"]["UpdateProveedorCommand"];
                "application/*+json": components["schemas"]["UpdateProveedorCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteProveedor: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetSimDets: {
        parameters: {
            query?: {
                /** @description Lote exacto. Se compara contra LoteTecomnet y LoteALtan. */
                Lote?: string;
                /** @description Idle, Activado, Reactivado, Suspendido o Baja. */
                EstadoSim?: components["schemas"]["EnumSimDet"];
                /** @description Producto al que pertenece la SIM. */
                ProductoId?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SimDetDto"][] | components["schemas"]["SimDetDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateSimDet: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateSimDetCommand"];
                "text/json": components["schemas"]["CreateSimDetCommand"];
                "application/*+json": components["schemas"]["CreateSimDetCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["SimDetDto"];
                    "application/json": components["schemas"]["SimDetDto"];
                    "text/json": components["schemas"]["SimDetDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateSimDet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateSimDetCommand"];
                "text/json": components["schemas"]["UpdateSimDetCommand"];
                "application/*+json": components["schemas"]["UpdateSimDetCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteSimDet: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetTiposTransaccion: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TipoTransaccionDto"][] | components["schemas"]["TipoTransaccionDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateTipoTransaccion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateTipoTransaccionCommand"];
                "text/json": components["schemas"]["CreateTipoTransaccionCommand"];
                "application/*+json": components["schemas"]["CreateTipoTransaccionCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["TipoTransaccionDto"];
                    "application/json": components["schemas"]["TipoTransaccionDto"];
                    "text/json": components["schemas"]["TipoTransaccionDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateTipoTransaccion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateTipoTransaccionCommand"];
                "text/json": components["schemas"]["UpdateTipoTransaccionCommand"];
                "application/*+json": components["schemas"]["UpdateTipoTransaccionCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteTipoTransaccion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetUnidadesMedida: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnidadMedidaDto"][] | components["schemas"]["UnidadMedidaDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateUnidadMedida: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateUnidadMedidaCommand"];
                "text/json": components["schemas"]["CreateUnidadMedidaCommand"];
                "application/*+json": components["schemas"]["CreateUnidadMedidaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["UnidadMedidaDto"];
                    "application/json": components["schemas"]["UnidadMedidaDto"];
                    "text/json": components["schemas"]["UnidadMedidaDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateUnidadMedida: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateUnidadMedidaCommand"];
                "text/json": components["schemas"]["UpdateUnidadMedidaCommand"];
                "application/*+json": components["schemas"]["UpdateUnidadMedidaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteUnidadMedida: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_GetUnidadesNegocio: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnidadNegocioDto"][] | components["schemas"]["UnidadNegocioDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_CreateUnidadNegocio: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateUnidadNegocioCommand"];
                "text/json": components["schemas"]["CreateUnidadNegocioCommand"];
                "application/*+json": components["schemas"]["CreateUnidadNegocioCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["UnidadNegocioDto"];
                    "application/json": components["schemas"]["UnidadNegocioDto"];
                    "text/json": components["schemas"]["UnidadNegocioDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_UpdateUnidadNegocio: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateUnidadNegocioCommand"];
                "text/json": components["schemas"]["UpdateUnidadNegocioCommand"];
                "application/*+json": components["schemas"]["UpdateUnidadNegocioCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Catalogos_DeleteUnidadNegocio: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Compras_GetAll: {
        parameters: {
            query?: {
                EmpresaId?: number;
                UdnId?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompraDto"][] | components["schemas"]["CompraDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Compras_Registrar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RegistrarCompraCommand"];
                "text/json": components["schemas"]["RegistrarCompraCommand"];
                "application/*+json": components["schemas"]["RegistrarCompraCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["CompraDto"];
                    "application/json": components["schemas"]["CompraDto"];
                    "text/json": components["schemas"]["CompraDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Compras_GetById: {
        parameters: {
            query?: {
                id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["CompraDto"];
                    "application/json": components["schemas"]["CompraDto"];
                    "text/json": components["schemas"]["CompraDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Compras_Update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateCompraCommand"];
                "text/json": components["schemas"]["UpdateCompraCommand"];
                "application/*+json": components["schemas"]["UpdateCompraCommand"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Existencias_GetAll: {
        parameters: {
            query?: {
                IdAlmacen?: number;
                IdProducto?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExistenciaDto"][] | components["schemas"]["ExistenciaDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Existencias_Create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateExistenciaCommand"];
                "text/json": components["schemas"]["CreateExistenciaCommand"];
                "application/*+json": components["schemas"]["CreateExistenciaCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ExistenciaDto"];
                    "application/json": components["schemas"]["ExistenciaDto"];
                    "text/json": components["schemas"]["ExistenciaDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Existencias_GetById: {
        parameters: {
            query?: {
                empresaId?: number;
                almacenId?: number;
                udnId?: number;
                productoId?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ExistenciaDto"];
                    "application/json": components["schemas"]["ExistenciaDto"];
                    "text/json": components["schemas"]["ExistenciaDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Existencias_Update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                empresaId: number;
                almacenId: number;
                udnId: number;
                productoId: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateExistenciaCommand"];
                "text/json": components["schemas"]["UpdateExistenciaCommand"];
                "application/*+json": components["schemas"]["UpdateExistenciaCommand"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Existencias_Delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                empresaId: number;
                almacenId: number;
                udnId: number;
                productoId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Importador_CreateImportador: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    archivo?: string;
                    /** Format: int32 */
                    material?: number;
                    /** Format: int32 */
                    tipo?: number;
                    loteTecomnet?: string;
                    /** Format: date-time */
                    dtFechaCompra?: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ResultadoImportacionDto"];
                    "application/json": components["schemas"]["ResultadoImportacionDto"];
                    "text/json": components["schemas"]["ResultadoImportacionDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Importador_CreateImportadorSims: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    archivo?: string;
                    /** Format: int32 */
                    material?: number;
                    /** Format: int32 */
                    tipo?: number;
                    loteTecomnet?: string;
                    /** Format: date-time */
                    dtFechaCompra?: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ResultadoImportacionDto"];
                    "application/json": components["schemas"]["ResultadoImportacionDto"];
                    "text/json": components["schemas"]["ResultadoImportacionDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Kardex_GetAll: {
        parameters: {
            query?: {
                IdProducto?: number;
                IdEmpresa?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KardexDto"][] | components["schemas"]["KardexDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Kardex_Create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateKardexCommand"];
                "text/json": components["schemas"]["CreateKardexCommand"];
                "application/*+json": components["schemas"]["CreateKardexCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["KardexDto"];
                    "application/json": components["schemas"]["KardexDto"];
                    "text/json": components["schemas"]["KardexDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Kardex_GetById: {
        parameters: {
            query?: {
                id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["KardexDto"];
                    "application/json": components["schemas"]["KardexDto"];
                    "text/json": components["schemas"]["KardexDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    MovimientosDeAlmacen_GetAll: {
        parameters: {
            query?: {
                FechaDesde?: string;
                FechaHasta?: string;
                EmpresaId?: number;
                UdnId?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MovimientoDto"][] | components["schemas"]["MovimientoDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    MovimientosDeAlmacen_Registrar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RegistrarMovimientoCommand"];
                "text/json": components["schemas"]["RegistrarMovimientoCommand"];
                "application/*+json": components["schemas"]["RegistrarMovimientoCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["MovimientoDto"];
                    "application/json": components["schemas"]["MovimientoDto"];
                    "text/json": components["schemas"]["MovimientoDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    MovimientosDeAlmacen_GetById: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["GetMovimientoByIdQuery"];
                "text/json": components["schemas"]["GetMovimientoByIdQuery"];
                "application/*+json": components["schemas"]["GetMovimientoByIdQuery"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["MovimientoDto"];
                    "application/json": components["schemas"]["MovimientoDto"];
                    "text/json": components["schemas"]["MovimientoDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    MovimientosDeAlmacen_Update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateMovimientoCommand"];
                "text/json": components["schemas"]["UpdateMovimientoCommand"];
                "application/*+json": components["schemas"]["UpdateMovimientoCommand"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    MovimientosDeAlmacen_Delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_GetAll: {
        parameters: {
            query?: {
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductoDto"][] | components["schemas"]["ProductoDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_Create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateProductoCommand"];
                "text/json": components["schemas"]["CreateProductoCommand"];
                "application/*+json": components["schemas"]["CreateProductoCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ProductoDto"];
                    "application/json": components["schemas"]["ProductoDto"];
                    "text/json": components["schemas"]["ProductoDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_Update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateProductoCommand"];
                "text/json": components["schemas"]["UpdateProductoCommand"];
                "application/*+json": components["schemas"]["UpdateProductoCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_Delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_GetProveedoresPaginados: {
        parameters: {
            query?: {
                IdProducto?: number;
                IdProveedor?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ProductoProveedorDtoPagedResult"];
                    "application/json": components["schemas"]["ProductoProveedorDtoPagedResult"];
                    "text/json": components["schemas"]["ProductoProveedorDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_GetProveedores: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["GetProductoProveedoresQuery"];
                "text/json": components["schemas"]["GetProductoProveedoresQuery"];
                "application/*+json": components["schemas"]["GetProductoProveedoresQuery"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ProductoProveedorDto"][];
                    "application/json": components["schemas"]["ProductoProveedorDto"][];
                    "text/json": components["schemas"]["ProductoProveedorDto"][];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_AddProveedor: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CreateProductoProveedorCommand"];
                "text/json": components["schemas"]["CreateProductoProveedorCommand"];
                "application/*+json": components["schemas"]["CreateProductoProveedorCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ProductoProveedorDto"];
                    "application/json": components["schemas"]["ProductoProveedorDto"];
                    "text/json": components["schemas"]["ProductoProveedorDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_UpdateProveedor: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateProductoProveedorCommand"];
                "text/json": components["schemas"]["UpdateProductoProveedorCommand"];
                "application/*+json": components["schemas"]["UpdateProductoProveedorCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Productos_RemoveProveedor: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeMensaje"];
                    "application/json": components["schemas"]["RespuestaDeMensaje"];
                    "text/json": components["schemas"]["RespuestaDeMensaje"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Recepciones_GetAll: {
        parameters: {
            query?: {
                EmpresaId?: number;
                UdnId?: number;
                /** @description Texto libre. Que columnas se miran lo decide cada endpoint. */
                Search?: string;
                /**
                 * @description Pagina solicitada, base 1. Cualquier valor menor se trata como 1: acotar
                 *     en vez de rechazar evita el 500 que devolvia SQL Server, porque page = 0
                 *     producia un OFFSET negativo.
                 */
                Page?: number;
                /**
                 * @description Renglones por pagina. Nulo significa que el cliente no pidio ninguno y se
                 *     usara el tamano por omision de la configuracion.
                 */
                PageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecepcionDto"][] | components["schemas"]["RecepcionDtoPagedResult"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Recepciones_Registrar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RegistrarRecepcionCommand"];
                "text/json": components["schemas"]["RegistrarRecepcionCommand"];
                "application/*+json": components["schemas"]["RegistrarRecepcionCommand"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RecepcionDto"];
                    "application/json": components["schemas"]["RecepcionDto"];
                    "text/json": components["schemas"]["RecepcionDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Recepciones_GetById: {
        parameters: {
            query?: {
                id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RecepcionDto"];
                    "application/json": components["schemas"]["RecepcionDto"];
                    "text/json": components["schemas"]["RecepcionDto"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["ValidationProblemDetails"];
                    "application/json": components["schemas"]["ValidationProblemDetails"];
                    "text/json": components["schemas"]["ValidationProblemDetails"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
    Recepciones_Update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["UpdateRecepcionCommand"];
                "text/json": components["schemas"]["UpdateRecepcionCommand"];
                "application/*+json": components["schemas"]["UpdateRecepcionCommand"];
            };
        };
        responses: {
            /** @description No Content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationProblemDetails"] | components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
            /** @description Internal Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": components["schemas"]["RespuestaDeError"];
                    "application/json": components["schemas"]["RespuestaDeError"];
                    "text/json": components["schemas"]["RespuestaDeError"];
                };
            };
        };
    };
}
