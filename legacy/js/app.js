//const API = "https://localhost:50005/api";
const API = "https://tecomnet.net/Inventario/api";
const scriptLoaders = {};

function loadScript(src) {
    if (scriptLoaders[src]) return scriptLoaders[src];
    scriptLoaders[src] = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            if (existing.dataset.loaded === "1") { resolve(); return; }
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => { script.dataset.loaded = "1"; resolve(); };
        script.onerror = reject;
        document.head.appendChild(script);
    });
    return scriptLoaders[src];
}

async function ensureSweetAlert() {
    if (window.Swal) return;
    await loadScript("https://cdn.jsdelivr.net/npm/sweetalert2@11");
}

async function ensureGoogleCharts() {
    if (!window.google?.charts) {
        await loadScript("https://www.gstatic.com/charts/loader.js");
    }
    return new Promise(resolve => {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(resolve);
    });
}

// ================= ROUTER =================
function router(view) {
    // Close mobile drawer on navigation
    if (window.innerWidth <= 860) closeMobileSidebar();

    if (view === "home") {
        render(`
            <div class="page-title">
                <div>
                    <span class="eyebrow">Resumen general</span>
                    <h1>Dashboard</h1>
                    <p>Indicadores principales del sistema de inventario.</p>
                </div>
            </div>
            <div class="kpi-container">
                <div class="card-kpi">
                    <h3>Total Productos</h3>
                    <p id="totalProductos">...</p>
                </div>
                <div class="card-kpi">
                    <h3>Productos con IVA</h3>
                    <p id="totalProductosIva">...</p>
                </div>
                <div class="card-kpi">
                    <h3>Productos con IEPS</h3>
                    <p id="totalProductosIeps">...</p>
                </div>
            </div>
            <div class="charts-container">
                <div class="chart-card"><div id="chartProductos"></div></div>
                <div class="chart-card"><div id="chartImpuestos"></div></div>
            </div>
        `);
        charts();
    }
    if (view === "productos") getProductos();
    if (view === "marcas") getMarcas();
    if (view === "presentacion") getPresentacion();
    if (view === "unidadmedida") getUnidadMedida();
    if (view === "tipos") getTiposDeTransaccion();
    if (view === "empresas") getEmpresas();
    if (view === "unidadesNegocio") getUnidadesNegocio();
    if (view === "almacenes") getAlmacenes();
    if (view === "proveedores") getProveedores();
    if (view === "lineas") getLineas();
    if (view === "compras") renderCompras();
    if (view === "movimientos") renderMovimientos();
    if (view === "existencias") getExistencias();
    if (view === "buscarExistencias") renderBuscarExistencias();
    if (view === "importador") renderImportador();
    if (view === "importadorSims") renderImportadorSims();
    if (view === "Sims") getSims();
    if (view === "kpis") renderKardex();
}

function render(html) {
    document.getElementById("app").innerHTML = html;
}

// ================= SIMS =================
let currentPage = 1;
const pageSize = 50;
let currentSearch = "";
let simsCache = [];

function buildSimsPagination(page, totalPages) {
    if (!totalPages || totalPages <= 1) return "";
    const pages = new Set([1, totalPages]);
    for (let i = page - 2; i <= page + 2; i++) {
        if (i >= 1 && i <= totalPages) pages.add(i);
    }
    const orderedPages = [...pages].sort((a, b) => a - b);
    let lastPage = 0;
    const numberButtons = orderedPages.map(pageNumber => {
        const gap = pageNumber - lastPage > 1 ? `<span class="pagination-ellipsis">...</span>` : "";
        lastPage = pageNumber;
        return `${gap}<button class="page-btn ${pageNumber === page ? "active" : ""}" onclick="getSims(${pageNumber})" ${pageNumber === page ? "disabled" : ""}>${pageNumber}</button>`;
    }).join("");
    return `
        <div class="pagination">
            <button class="page-btn page-nav" onclick="getSims(${page - 1})" ${page <= 1 ? "disabled" : ""}><i class="fa-solid fa-chevron-left"></i> Anterior</button>
            <div class="page-numbers">${numberButtons}</div>
            <button class="page-btn page-nav" onclick="getSims(${page + 1})" ${page >= totalPages ? "disabled" : ""}>Siguiente <i class="fa-solid fa-chevron-right"></i></button>
        </div>
    `;
}

async function getSims(page = 1) {
    try {
        const res = await fetch(`${API}/Catalogos/simdet/pages?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(currentSearch)}`);
        const result = await res.json();
        currentPage = result.page;
        simsCache = result.data;
        let html = `
        <div class="page-title">
            <div>
                <span class="eyebrow">Catálogo</span>
                <h2>Sims</h2>
                <p>Página ${result.page} de ${result.totalPages} · Total registros: ${result.totalRecords}</p>
            </div>
        </div>
        <div class="search-container">
            <input type="text" id="searchInput" placeholder="Buscar ICCID, IMSI o MSISDN..." value="${escapeHtml(currentSearch)}" />
            <button class="btn" id="btnBuscar"><i class="fa-solid fa-magnifying-glass"></i> Buscar</button>
            <button class="btn" id="btnLimpiar" onclick="clearSearch()"><i class="fa-solid fa-filter-circle-xmark"></i> Limpiar filtro</button>
        </div>
        <div id="simFormPanel"></div>
        <div class="table-container"><table>
        <tr><th>Editar</th><th>Id</th><th>Imsi</th><th>Iccid</th><th>Msisdn</th><th>Producto</th><th>Desc. Producto</th><th>Lote Tecomnet</th><th>Lote ALtan</th><th>F. Registro</th><th>Estado Sim</th><th>F. Compra</th><th>F. Recepcion</th><th>F. Entrega</th><th>F. Activacion</th><th>F. Suspencion</th><th>F. Reactivacion</th><th>F. Inicio Facturacion</th><th>F. Baja</th></tr>`;
        result.data.forEach(p => {
            html += `<tr>
                <td><button class="table-action-btn" onclick="editarSim(${Number(p.id)})"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td>${escapeHtml(p.id)}</td><td>${escapeHtml(p.imsi)}</td><td>${escapeHtml(p.iccid)}</td><td>${escapeHtml(p.msisdn)}</td>
                <td>${escapeHtml(p.idProducto)}</td><td>${escapeHtml(p.productoDescripcion)}</td><td>${escapeHtml(p.loteTecomnet)}</td><td>${escapeHtml(p.loteALtan)}</td>
                <td>${escapeHtml(formatearFecha(p.fechaRegistro))}</td><td>${escapeHtml(p.estadoSim)}</td>
                <td>${escapeHtml(formatearFecha(p.fechaCompra))}</td><td>${escapeHtml(formatearFecha(p.fechaRecepcion))}</td>
                <td>${escapeHtml(formatearFecha(p.fechaEntrega))}</td><td>${escapeHtml(formatearFecha(p.fechaActivacion))}</td>
                <td>${escapeHtml(formatearFecha(p.fechaSuspencion))}</td><td>${escapeHtml(formatearFecha(p.fechaReactivacion))}</td>
                <td>${escapeHtml(formatearFecha(p.fechaInicioFacturacion))}</td><td>${escapeHtml(formatearFecha(p.fechaBaja))}</td>
            </tr>`;
        });
        html += `</table></div>${buildSimsPagination(result.page, result.totalPages)}`;
        render(html);
        document.getElementById("btnBuscar")?.addEventListener("click", searchSims);
    } catch (error) {
        console.error(error);
        render("Error cargando sims");
    }
}

function searchSims() {
    currentSearch = document.getElementById("searchInput").value;
    getSims(1);
}

function clearSearch() {
    currentSearch = "";
    const input = document.getElementById("searchInput");
    if (input) input.value = "";
    getSims(1);
}

const ESTADOS_SIM = { 1: "Registrada", 2: "Activa", 3: "Suspendida", 4: "Reactivada", 5: "Baja" };

function toDateInput(value) {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
}

function editarSim(id) {
    const sim = simsCache.find(s => Number(s.id) === Number(id));
    if (!sim) return;
    const panel = document.getElementById("simFormPanel");
    const estadoOptions = Object.entries(ESTADOS_SIM)
        .map(([k, label]) => `<option value="${k}" ${Number(sim.estadoSim) === Number(k) ? "selected" : ""}>${label}</option>`)
        .join("");
    panel.innerHTML = `
        <form class="entity-form" id="simForm">
            <div class="entity-form-header">
                <div><span class="eyebrow">Editar</span><h3>SIM ${escapeHtml(sim.id)} · ${escapeHtml(sim.iccid ?? "")}</h3></div>
                <button class="icon-button" type="button" onclick="cerrarSimForm()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="simId" type="hidden" value="${Number(sim.id)}">
            <div class="entity-grid">
                <div class="form-group"><label>Estado Sim</label><select id="simEstado">${estadoOptions}</select></div>
                <div class="form-group"><label>F. Instalación</label><input id="simFechaInstalacion" type="date" value="${escapeHtml(toDateInput(sim.fechaInstalacion))}"></div>
                <div class="form-group"><label>F. Activación</label><input id="simFechaActivacion" type="date" value="${escapeHtml(toDateInput(sim.fechaActivacion))}"></div>
                <div class="form-group"><label>F. Reactivación</label><input id="simFechaReactivacion" type="date" value="${escapeHtml(toDateInput(sim.fechaReactivacion))}"></div>
                <div class="form-group"><label>F. Suspensión</label><input id="simFechaSuspencion" type="date" value="${escapeHtml(toDateInput(sim.fechaSuspencion))}"></div>
                <div class="form-group"><label>F. Inicio Facturación</label><input id="simFechaInicioFacturacion" type="date" value="${escapeHtml(toDateInput(sim.fechaInicioFacturacion))}"></div>
                <div class="form-group"><label>F. Venta</label><input id="simFechaVenta" type="date" value="${escapeHtml(toDateInput(sim.fechaVenta))}"></div>
                <div class="form-group"><label>Última fecha</label><input id="simUltimaFecha" type="date" value="${escapeHtml(toDateInput(sim.ultimaFecha))}"></div>
                <div class="form-group"><label>F. Entrega</label><input id="simFechaEntrega" type="date" value="${escapeHtml(toDateInput(sim.fechaEntrega))}"></div>
                <div class="form-group"><label>F. Baja</label><input id="simFechaBaja" type="date" value="${escapeHtml(toDateInput(sim.fechaBaja))}"></div>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>
                <button class="btn-secondary-action" type="button" onclick="cerrarSimForm()">Cancelar</button>
            </div>
        </form>`;
    document.getElementById("simForm")?.addEventListener("submit", guardarSim);
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cerrarSimForm() { const p = document.getElementById("simFormPanel"); if (p) p.innerHTML = ""; }

async function guardarSim(event) {
    event.preventDefault();
    await ensureSweetAlert();
    const id = Number(document.getElementById("simId").value);
    const dateOrNull = inputId => {
        const v = document.getElementById(inputId).value;
        return v ? v : null;
    };
    const payload = {
        id,
        estadoSim: Number(document.getElementById("simEstado").value),
        fechaInstalacion: dateOrNull("simFechaInstalacion"),
        fechaActivacion: dateOrNull("simFechaActivacion"),
        fechaReactivacion: dateOrNull("simFechaReactivacion"),
        fechaSuspencion: dateOrNull("simFechaSuspencion"),
        fechaInicioFacturacion: dateOrNull("simFechaInicioFacturacion"),
        fechaVenta: dateOrNull("simFechaVenta"),
        ultimaFecha: dateOrNull("simUltimaFecha"),
        fechaEntrega: dateOrNull("simFechaEntrega"),
        fechaBaja: dateOrNull("simFechaBaja")
    };
    await postOrPut("SIM", `${API}/Catalogos/simdet`, true, payload, () => getSims(currentPage));
}

// ================= PRODUCTOS =================
let productosCache = [];

async function getProductos() {
    try {
        const res = await fetch(`${API}/Productos`);
        const data = await res.json();
        productosCache = data;
        let html = `
        <div class="page-title">
            <div>
                <span class="eyebrow">Catálogo</span>
                <h2>Productos</h2>
                <p>Alta, edición y baja de productos.</p>
            </div>
            <button class="btn-primary" onclick="nuevoProducto()"><i class="fa-solid fa-plus"></i> Nuevo producto</button>
        </div>
        <div id="productoFormPanel"></div>
        <div class="table-container"><table>
        <tr><th>Editar</th><th>Baja</th><th>Id</th><th>Código</th><th>Nombre</th><th>Material</th><th>Tipo</th><th>Línea</th><th>IVA</th><th>IEPS</th><th>Activo</th></tr>`;
        data.forEach(p => {
            html += `<tr>
                <td><button class="table-action-btn" onclick="editarProducto(${Number(p.id)})"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td><button class="table-action-btn table-action-danger" onclick="bajaProducto(${Number(p.id)})"><i class="fa-solid fa-ban"></i></button></td>
                <td>${escapeHtml(p.id)}</td><td>${escapeHtml(p.codInterno ?? "-")}</td><td>${escapeHtml(p.descripcion)}</td>
                <td>${escapeHtml(p.materialDescripcion)}</td><td>${escapeHtml(p.presentacionDescripcion)}</td><td>${escapeHtml(p.lineaDescripcion)}</td>
                <td>${escapeHtml(p.iva)}</td><td>${escapeHtml(p.ieps)}</td><td>${formatCellValue(p.esActivo)}</td>
            </tr>`;
        });
        html += "</table></div>";
        render(html);
    } catch {
        render("Error cargando productos");
    }
}

function nuevoProducto() {
    renderProductoForm({ codInterno:"", descripcion:"", marcaId:0, lineaId:0, presentacionId:0, unidadMedidaId:0, materialId:0, iva:0, ieps:0, esActivo:true });
}

async function editarProducto(id) {
    const producto = productosCache.find(p => Number(p.id) === Number(id));
    if (!producto) {
        await ensureSweetAlert();
        Swal.fire({ icon: "warning", title: "No se encontró el producto seleccionado." });
        return;
    }
    renderProductoForm(producto);
}

function renderProductoForm(producto) {
    const isEdit = Boolean(producto.id);
    const presentacionId = producto.presentacionId ?? producto.presentacioniD ?? 0;
    const panel = document.getElementById("productoFormPanel");
    panel.innerHTML = `
        <form class="entity-form" id="productoForm">
            <div class="entity-form-header">
                <div>
                    <span class="eyebrow">${isEdit ? "Editar" : "Nuevo"}</span>
                    <h3>${isEdit ? `Producto ${escapeHtml(producto.id)}` : "Nuevo producto"}</h3>
                </div>
                <button class="icon-button" type="button" onclick="cerrarProductoForm()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="productoId" type="hidden" value="${escapeHtml(producto.id ?? 0)}">
            <div class="entity-grid">
                <div class="form-group"><label>Código interno</label><input id="productoCodInterno" type="text" value="${escapeHtml(producto.codInterno ?? "")}" required></div>
                <div class="form-group"><label>Descripción</label><input id="productoDescripcion" type="text" value="${escapeHtml(producto.descripcion ?? "")}" required></div>
                <div class="form-group"><label>Marca Id</label><input id="productoMarcaId" type="number" min="0" step="1" value="${escapeHtml(producto.marcaId ?? 0)}" required></div>
                <div class="form-group"><label>Línea Id</label><input id="productoLineaId" type="number" min="0" step="1" value="${escapeHtml(producto.lineaId ?? 0)}" required></div>
                <div class="form-group"><label>Presentación Id</label><input id="productoPresentacionId" type="number" min="0" step="1" value="${escapeHtml(presentacionId)}" required></div>
                <div class="form-group"><label>Unidad Medida Id</label><input id="productoUnidadMedidaId" type="number" min="0" step="1" value="${escapeHtml(producto.unidadMedidaId ?? 0)}" required></div>
                <div class="form-group"><label>Material Id</label><input id="productoMaterialId" type="number" min="0" step="1" value="${escapeHtml(producto.materialId ?? 0)}" required></div>
                <div class="form-group"><label>IVA</label><input id="productoIva" type="number" min="0" step="0.01" value="${escapeHtml(producto.iva ?? 0)}" required></div>
                <div class="form-group"><label>IEPS</label><input id="productoIeps" type="number" min="0" step="0.01" value="${escapeHtml(producto.ieps ?? 0)}" required></div>
                <label class="check-field"><input id="productoEsActivo" type="checkbox" ${(producto.esActivo ?? true) ? "checked" : ""}> Activo</label>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${isEdit ? "Guardar cambios" : "Crear producto"}</button>
                <button class="btn-secondary-action" type="button" onclick="cerrarProductoForm()">Cancelar</button>
            </div>
        </form>`;
    document.getElementById("productoForm")?.addEventListener("submit", guardarProducto);
}

function cerrarProductoForm() {
    const panel = document.getElementById("productoFormPanel");
    if (panel) panel.innerHTML = "";
}

function getProductoPayload() {
    return {
        id: Number(document.getElementById("productoId").value) || 0,
        codInterno: document.getElementById("productoCodInterno").value.trim(),
        descripcion: document.getElementById("productoDescripcion").value.trim(),
        marcaId: Number(document.getElementById("productoMarcaId").value),
        lineaId: Number(document.getElementById("productoLineaId").value),
        presentacionId: Number(document.getElementById("productoPresentacionId").value),
        unidadMedidaId: Number(document.getElementById("productoUnidadMedidaId").value),
        materialId: Number(document.getElementById("productoMaterialId").value),
        iva: Number(document.getElementById("productoIva").value),
        ieps: Number(document.getElementById("productoIeps").value),
        esActivo: document.getElementById("productoEsActivo").checked
    };
}

async function guardarProducto(event) {
    event.preventDefault();
    await ensureSweetAlert();
    const payload = getProductoPayload();
    const isEdit = payload.id > 0;
    try {
        const res = await fetch(`${API}/Productos`, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = null; }
        if (!res.ok) {
            console.error("guardarProducto", res.status, text, "payload:", payload);
            const lines = data?.errors
                ? Object.values(data.errors).flat()
                : [data?.title || data?.message || data?.error || text || "Sin detalle"];
            const detailHtml = lines.map(l => `<div>• ${escapeHtml(l)}</div>`).join("");
            Swal.fire({
                icon: "error",
                title: `No se pudo guardar (HTTP ${res.status})`,
                html: `<div style="text-align:left">${detailHtml}</div>`
            });
            return;
        }
        Swal.fire({ icon: "success", title: isEdit ? "Producto actualizado." : "Producto creado." });
        getProductos();
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: "error", title: "Error de red", text: error.message });
    }
}

async function bajaProducto(id) {
    await ensureSweetAlert();
    const confirm = await Swal.fire({
        icon: "warning",
        title: `¿Dar de baja el producto ${id}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, dar de baja",
        cancelButtonText: "Cancelar"
    });
    if (!confirm.isConfirmed) return;
    try {
        const res = await fetch(`${API}/Productos`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        Swal.fire({ icon: "success", title: "Producto dado de baja." });
        getProductos();
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: "error", title: "No se pudo dar de baja el producto", text: "Revisa el API." });
    }
}

// ================= CATÁLOGOS SIMPLES =================
function renderCatalogoLoading(eyebrow, title) {
    render(`<div class="page-title"><div><span class="eyebrow">${eyebrow}</span><h2>${title}</h2></div></div><div class="loading-state">Cargando...</div>`);
}

// --- Helper genérico para catálogos con un solo campo "descripcion" ---
function renderDescripcionCatalogList(opts, data) {
    let html = `
    <div class="page-title">
        <div><span class="eyebrow">${opts.eyebrow}</span><h2>${opts.title}</h2><p>Alta y edición.</p></div>
        <button class="btn-primary" onclick="${opts.nuevoFn}()"><i class="fa-solid fa-plus"></i> Nuevo</button>
    </div>
    <div id="${opts.panelId}"></div>
    <div class="table-container"><table>
    <tr><th>Editar</th><th>Id</th><th>Descripción</th></tr>`;
    data.forEach(m => {
        html += `<tr>
            <td><button class="table-action-btn" onclick="${opts.editarFn}(${Number(m.id)})"><i class="fa-solid fa-pen-to-square"></i></button></td>
            <td>${escapeHtml(m.id)}</td><td>${escapeHtml(m.descripcion)}</td>
        </tr>`;
    });
    html += "</table></div>";
    render(html);
}

function renderDescripcionForm(opts, item) {
    const id = Number(item.id ?? 0);
    const isEdit = id > 0;
    const panel = document.getElementById(opts.panelId);
    panel.innerHTML = `
        <form class="entity-form" id="${opts.formId}">
            <div class="entity-form-header">
                <div><span class="eyebrow">${isEdit ? "Editar" : "Nuevo"}</span><h3>${isEdit ? `${opts.singular} ${id}` : `Nuevo ${opts.singular.toLowerCase()}`}</h3></div>
                <button class="icon-button" type="button" onclick="document.getElementById('${opts.panelId}').innerHTML=''"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="${opts.formId}_id" type="hidden" value="${id}">
            <div class="entity-grid">
                <div class="form-group"><label>Descripción</label><input id="${opts.formId}_desc" type="text" value="${escapeHtml(item.descripcion ?? "")}" required></div>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${isEdit ? "Guardar cambios" : "Crear"}</button>
                <button class="btn-secondary-action" type="button" onclick="document.getElementById('${opts.panelId}').innerHTML=''">Cancelar</button>
            </div>
        </form>`;
    document.getElementById(opts.formId)?.addEventListener("submit", async event => {
        event.preventDefault();
        await ensureSweetAlert();
        const formId = Number(document.getElementById(`${opts.formId}_id`).value) || 0;
        const isEditNow = formId > 0;
        const base = { descripcion: document.getElementById(`${opts.formId}_desc`).value.trim() };
        const payload = isEditNow ? { id: formId, ...base } : base;
        await postOrPut(opts.singular, opts.url, isEditNow, payload, opts.refreshFn);
    });
}

// --- MARCAS ---
let marcasCache = [];
async function getMarcas() {
    renderCatalogoLoading("Catálogo", "Marcas");
    try {
        const res = await fetch(`${API}/Catalogos/marcas`);
        marcasCache = await res.json();
        renderDescripcionCatalogList({ eyebrow: "Catálogo", title: "Marcas", nuevoFn: "nuevaMarca", editarFn: "editarMarca", panelId: "marcaFormPanel" }, marcasCache);
    } catch (error) { console.error(error); render("Error cargando marcas"); }
}
function nuevaMarca() { renderDescripcionForm({ singular: "Marca", panelId: "marcaFormPanel", formId: "marcaForm", url: `${API}/Catalogos/marcas`, refreshFn: getMarcas }, {}); }
function editarMarca(id) { const m = marcasCache.find(x => Number(x.id) === Number(id)); if (m) renderDescripcionForm({ singular: "Marca", panelId: "marcaFormPanel", formId: "marcaForm", url: `${API}/Catalogos/marcas`, refreshFn: getMarcas }, m); }

// --- PRESENTACIONES ---
let presentacionesCache = [];
async function getPresentacion() {
    renderCatalogoLoading("Catálogo", "Presentaciones");
    try {
        const res = await fetch(`${API}/Catalogos/presentaciones`);
        presentacionesCache = await res.json();
        renderDescripcionCatalogList({ eyebrow: "Catálogo", title: "Presentaciones", nuevoFn: "nuevaPresentacion", editarFn: "editarPresentacion", panelId: "presentacionFormPanel" }, presentacionesCache);
    } catch (error) { console.error(error); render("Error cargando presentaciones"); }
}
function nuevaPresentacion() { renderDescripcionForm({ singular: "Presentación", panelId: "presentacionFormPanel", formId: "presentacionForm", url: `${API}/Catalogos/presentaciones`, refreshFn: getPresentacion }, {}); }
function editarPresentacion(id) { const m = presentacionesCache.find(x => Number(x.id) === Number(id)); if (m) renderDescripcionForm({ singular: "Presentación", panelId: "presentacionFormPanel", formId: "presentacionForm", url: `${API}/Catalogos/presentaciones`, refreshFn: getPresentacion }, m); }

// --- UNIDADES DE MEDIDA ---
let unidadMedidaCache = [];
async function getUnidadMedida() {
    renderCatalogoLoading("Catálogo", "Unidades de Medida");
    try {
        const res = await fetch(`${API}/Catalogos/unidadesmedida`);
        unidadMedidaCache = await res.json();
        renderDescripcionCatalogList({ eyebrow: "Catálogo", title: "Unidades de Medida", nuevoFn: "nuevaUnidadMedida", editarFn: "editarUnidadMedida", panelId: "unidadMedidaFormPanel" }, unidadMedidaCache);
    } catch (error) { console.error(error); render("Error cargando unidades"); }
}
function nuevaUnidadMedida() { renderDescripcionForm({ singular: "Unidad de Medida", panelId: "unidadMedidaFormPanel", formId: "unidadMedidaForm", url: `${API}/Catalogos/unidadesmedida`, refreshFn: getUnidadMedida }, {}); }
function editarUnidadMedida(id) { const m = unidadMedidaCache.find(x => Number(x.id) === Number(id)); if (m) renderDescripcionForm({ singular: "Unidad de Medida", panelId: "unidadMedidaFormPanel", formId: "unidadMedidaForm", url: `${API}/Catalogos/unidadesmedida`, refreshFn: getUnidadMedida }, m); }

// --- TIPOS DE TRANSACCIÓN ---
async function getTiposDeTransaccion() {
    renderCatalogoLoading("Configuración", "Tipos de Transacción");
    try {
        const res = await fetch(`${API}/Catalogos/tipostransaccion`);
        const data = await res.json();
        let html = `<div class="page-title"><div><span class="eyebrow">Configuración</span><h2>Tipos de Transacción</h2></div></div><div class="table-container"><table><tr><th>Id</th><th>Descripcion</th><th>Naturaleza</th></tr>`;
        data.forEach(m => { html += `<tr><td>${escapeHtml(m.id)}</td><td>${escapeHtml(m.descripcion)}</td><td>${escapeHtml(m.naturaleza)}</td></tr>`; });
        html += "</table></div>";
        render(html);
    } catch (error) { console.error(error); render("Error cargando tipos"); }
}

// --- PROVEEDORES ---
let proveedoresCache = [];
async function getProveedores() {
    renderCatalogoLoading("Catálogo", "Proveedores");
    try {
        const res = await fetch(`${API}/Catalogos/proveedores`);
        const data = await res.json();
        proveedoresCache = data;
        let html = `
        <div class="page-title">
            <div><span class="eyebrow">Catálogo</span><h2>Proveedores</h2><p>Alta y edición de proveedores.</p></div>
            <button class="btn-primary" onclick="nuevoProveedor()"><i class="fa-solid fa-plus"></i> Nuevo proveedor</button>
        </div>
        <div id="proveedorFormPanel"></div>
        <div class="table-container"><table>
        <tr><th>Editar</th><th>Id</th><th>Descripción</th><th>Contacto</th><th>Días Crédito</th><th>Activo</th></tr>`;
        data.forEach(p => {
            html += `<tr>
                <td><button class="table-action-btn" onclick="editarProveedor(${Number(p.id)})"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td>${escapeHtml(p.id)}</td><td>${escapeHtml(p.descripcion)}</td><td>${escapeHtml(p.contacto)}</td><td>${escapeHtml(p.diasCredito)}</td><td>${formatCellValue(p.esActivo)}</td>
            </tr>`;
        });
        html += "</table></div>";
        render(html);
    } catch (error) { console.error(error); render("Error cargando Proveedores"); }
}

function nuevoProveedor() { renderProveedorForm({ descripcion: "", contacto: "", diasCredito: 0, esActivo: true }); }
function editarProveedor(id) { const p = proveedoresCache.find(x => Number(x.id) === Number(id)); if (p) renderProveedorForm(p); }

function renderProveedorForm(p) {
    const id = Number(p.id ?? 0);
    const isEdit = id > 0;
    const panel = document.getElementById("proveedorFormPanel");
    panel.innerHTML = `
        <form class="entity-form" id="proveedorForm">
            <div class="entity-form-header">
                <div><span class="eyebrow">${isEdit ? "Editar" : "Nuevo"}</span><h3>${isEdit ? `Proveedor ${id}` : "Nuevo proveedor"}</h3></div>
                <button class="icon-button" type="button" onclick="cerrarProveedorForm()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="proveedorId" type="hidden" value="${id}">
            <div class="entity-grid">
                <div class="form-group"><label>Descripción</label><input id="proveedorDescripcion" type="text" value="${escapeHtml(p.descripcion ?? "")}" required></div>
                <div class="form-group"><label>Contacto</label><input id="proveedorContacto" type="text" value="${escapeHtml(p.contacto ?? "")}"></div>
                <div class="form-group"><label>Días de Crédito</label><input id="proveedorDiasCredito" type="number" min="0" step="1" value="${escapeHtml(p.diasCredito ?? 0)}" required></div>
                <label class="check-field"><input id="proveedorEsActivo" type="checkbox" ${(p.esActivo ?? true) ? "checked" : ""}> Activo</label>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${isEdit ? "Guardar cambios" : "Crear proveedor"}</button>
                <button class="btn-secondary-action" type="button" onclick="cerrarProveedorForm()">Cancelar</button>
            </div>
        </form>`;
    document.getElementById("proveedorForm")?.addEventListener("submit", guardarProveedor);
}

function cerrarProveedorForm() { const p = document.getElementById("proveedorFormPanel"); if (p) p.innerHTML = ""; }

async function guardarProveedor(event) {
    event.preventDefault();
    await ensureSweetAlert();
    const id = Number(document.getElementById("proveedorId").value) || 0;
    const isEdit = id > 0;
    const base = {
        descripcion: document.getElementById("proveedorDescripcion").value.trim(),
        contacto: document.getElementById("proveedorContacto").value.trim(),
        diasCredito: Number(document.getElementById("proveedorDiasCredito").value),
        esActivo: document.getElementById("proveedorEsActivo").checked
    };
    const payload = isEdit ? { id, ...base } : base;
    await postOrPut("Proveedor", `${API}/Catalogos/proveedores`, isEdit, payload, getProveedores);
}

// --- LÍNEAS ---
let lineasCache = [];
async function getLineas() {
    renderCatalogoLoading("Catálogo", "Líneas");
    try {
        const res = await fetch(`${API}/Catalogos/lineas`);
        const data = await res.json();
        lineasCache = data;
        let html = `
        <div class="page-title">
            <div><span class="eyebrow">Catálogo</span><h2>Líneas</h2><p>Alta y edición de líneas (con jerarquía).</p></div>
            <button class="btn-primary" onclick="nuevaLinea()"><i class="fa-solid fa-plus"></i> Nueva línea</button>
        </div>
        <div id="lineaFormPanel"></div>
        <div class="table-container"><table>
        <tr><th>Editar</th><th>Id</th><th>Descripción</th><th>Línea Padre</th><th>Activa</th></tr>`;
        data.forEach(l => {
            html += `<tr>
                <td><button class="table-action-btn" onclick="editarLinea(${Number(l.id)})"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td>${escapeHtml(l.id)}</td><td>${escapeHtml(l.descripcion)}</td><td>${escapeHtml(l.idLineaPadre ?? "-")}</td><td>${formatCellValue(l.esActiva)}</td>
            </tr>`;
        });
        html += "</table></div>";
        render(html);
    } catch (error) { console.error(error); render("Error cargando Líneas"); }
}

function nuevaLinea() { renderLineaForm({ descripcion: "", idLineaPadre: 0, esActiva: true }); }
function editarLinea(id) { const l = lineasCache.find(x => Number(x.id) === Number(id)); if (l) renderLineaForm(l); }

function renderLineaForm(l) {
    const id = Number(l.id ?? 0);
    const isEdit = id > 0;
    const panel = document.getElementById("lineaFormPanel");
    panel.innerHTML = `
        <form class="entity-form" id="lineaForm">
            <div class="entity-form-header">
                <div><span class="eyebrow">${isEdit ? "Editar" : "Nueva"}</span><h3>${isEdit ? `Línea ${id}` : "Nueva línea"}</h3></div>
                <button class="icon-button" type="button" onclick="cerrarLineaForm()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="lineaId" type="hidden" value="${id}">
            <div class="entity-grid">
                <div class="form-group"><label>Descripción</label><input id="lineaDescripcion" type="text" value="${escapeHtml(l.descripcion ?? "")}" required></div>
                <div class="form-group"><label>Id Línea Padre <small>(0 si es raíz)</small></label><input id="lineaIdPadre" type="number" min="0" step="1" value="${escapeHtml(l.idLineaPadre ?? 0)}"></div>
                <label class="check-field"><input id="lineaEsActiva" type="checkbox" ${(l.esActiva ?? true) ? "checked" : ""}> Activa</label>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${isEdit ? "Guardar cambios" : "Crear línea"}</button>
                <button class="btn-secondary-action" type="button" onclick="cerrarLineaForm()">Cancelar</button>
            </div>
        </form>`;
    document.getElementById("lineaForm")?.addEventListener("submit", guardarLinea);
}

function cerrarLineaForm() { const p = document.getElementById("lineaFormPanel"); if (p) p.innerHTML = ""; }

async function guardarLinea(event) {
    event.preventDefault();
    await ensureSweetAlert();
    const id = Number(document.getElementById("lineaId").value) || 0;
    const isEdit = id > 0;
    const base = {
        descripcion: document.getElementById("lineaDescripcion").value.trim(),
        idLineaPadre: Number(document.getElementById("lineaIdPadre").value) || 0,
        esActiva: document.getElementById("lineaEsActiva").checked
    };
    const payload = isEdit ? { id, ...base } : base;
    await postOrPut("Línea", `${API}/Catalogos/lineas`, isEdit, payload, getLineas);
}

// ================= EXISTENCIAS =================
async function getExistencias() {
    renderCatalogoLoading("Inventarios", "Existencias");
    try {
        const res = await fetch(`${API}/Existencias`);
        const data = await res.json();
        let html = `<div class="page-title"><div><span class="eyebrow">Inventarios</span><h2>Existencias</h2></div></div><div class="table-container"><table><tr><th>Empresa</th><th>Udn</th><th>Almacen</th><th>Producto</th><th>Cantidad</th><th>Piezas</th></tr>`;
        data.forEach(e => { html += `<tr><td>${escapeHtml(e.empresaId)}</td><td>${escapeHtml(e.udnId)}</td><td>${escapeHtml(e.almacenId)}</td><td>${escapeHtml(e.productoId)}</td><td>${escapeHtml(e.cantidad)}</td><td>${escapeHtml(e.cantidadPiezas)}</td></tr>`; });
        html += "</table></div>";
        render(html);
    } catch (error) { console.error(error); render("Error cargando existencias"); }
}

function renderBuscarExistencias() {
    render(`
        <div class="page-title">
            <div><span class="eyebrow">Inventarios</span><h2>Buscar Existencias</h2><p>Consulta existencias por empresa, almacén, UDN y producto.</p></div>
        </div>
        <form class="filter-panel filter-panel-four" id="existenciasBuscarForm">
            <div class="form-group"><label>Empresa Id</label><input id="existenciaEmpresaId" type="number" min="1" step="1" placeholder="Ej. 1" required></div>
            <div class="form-group"><label>Almacén Id</label><input id="existenciaAlmacenId" type="number" min="1" step="1" placeholder="Ej. 1" required></div>
            <div class="form-group"><label>UDN Id</label><input id="existenciaUdnId" type="number" min="1" step="1" placeholder="Ej. 1" required></div>
            <div class="form-group"><label>Producto Id</label><input id="existenciaProductoId" type="number" min="1" step="1" placeholder="Ej. 4" required></div>
            <button class="btn-primary" type="submit"><i class="fa-solid fa-magnifying-glass-chart"></i> Consultar</button>
        </form>
        <div id="existenciasBuscarResult" class="result-space">
            <div class="empty-state"><i class="fa-solid fa-boxes-stacked"></i><h2>Buscar Existencias</h2><p>Ingresa los parámetros para consultar la información.</p></div>
        </div>
    `);
    document.getElementById("existenciasBuscarForm")?.addEventListener("submit", getBuscarExistencias);
}

async function getBuscarExistencias(event) {
    event.preventDefault();
    const empresaId = document.getElementById("existenciaEmpresaId").value;
    const almacenId = document.getElementById("existenciaAlmacenId").value;
    const udnId = document.getElementById("existenciaUdnId").value;
    const productoId = document.getElementById("existenciaProductoId").value;
    const resultContainer = document.getElementById("existenciasBuscarResult");
    resultContainer.innerHTML = `<div class="loading-state">Consultando existencias...</div>`;
    try {
        const url = `${API}/Existencias/buscar?empresaId=${encodeURIComponent(empresaId)}&almacenId=${encodeURIComponent(almacenId)}&udnId=${encodeURIComponent(udnId)}&productoId=${encodeURIComponent(productoId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const payload = await res.json();
        renderDynamicTableResult(resultContainer, payload, "Sin resultados", "No se encontraron existencias para esos parámetros.");
    } catch (error) {
        console.error(error);
        resultContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h2>Error cargando existencias</h2><p>Revisa los parámetros o que el API esté disponible.</p></div>`;
    }
}

function renderDynamicTableResult(container, payload, emptyTitle, emptyMessage) {
    const data = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : payload ? [payload] : [];
    if (!data.length) {
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-info"></i><h2>${emptyTitle}</h2><p>${emptyMessage}</p></div>`;
        return;
    }
    const columns = Object.keys(data[0]);
    const headers = columns.map(c => `<th>${escapeHtml(c)}</th>`).join("");
    const rows = data.map(row => `<tr>${columns.map(c => `<td>${formatCellValue(row[c])}</td>`).join("")}</tr>`).join("");
    container.innerHTML = `<div class="table-container"><table><tr>${headers}</tr>${rows}</table></div>`;
}

// ================= EMPRESAS =================
let empresasCache = [];

async function getEmpresas() {
    renderCatalogoLoading("Catálogo", "Empresas");
    try {
        const res = await fetch(`${API}/Catalogos/empresas`);
        const data = await res.json();
        empresasCache = data;
        let html = `
        <div class="page-title">
            <div><span class="eyebrow">Catálogo</span><h2>Empresas</h2><p>Alta, edición y baja de empresas.</p></div>
            <button class="btn-primary" onclick="nuevaEmpresa()"><i class="fa-solid fa-plus"></i> Nueva empresa</button>
        </div>
        <div id="empresaFormPanel"></div>
        <div class="table-container"><table>
        <tr><th>Editar</th><th>Id</th><th>Descripción</th><th>RFC</th><th>Activa</th></tr>`;
        data.forEach(e => {
            html += `<tr>
                <td><button class="table-action-btn" onclick="editarEmpresa(${Number(e.id)})"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td>${escapeHtml(e.id)}</td><td>${escapeHtml(e.descripcion)}</td><td>${escapeHtml(e.rfc)}</td><td>${formatCellValue(e.esActiva)}</td>
            </tr>`;
        });
        html += "</table></div>";
        render(html);
    } catch (error) { console.error(error); render("Error cargando Empresas"); }
}

function nuevaEmpresa() { renderEmpresaForm({ descripcion: "", rfc: "", esActiva: true }); }

function editarEmpresa(id) {
    const e = empresasCache.find(x => Number(x.id) === Number(id));
    if (!e) return;
    renderEmpresaForm(e);
}

function renderEmpresaForm(e) {
    const isEdit = Boolean(e.id);
    const panel = document.getElementById("empresaFormPanel");
    panel.innerHTML = `
        <form class="entity-form" id="empresaForm">
            <div class="entity-form-header">
                <div><span class="eyebrow">${isEdit ? "Editar" : "Nueva"}</span><h3>${isEdit ? `Empresa ${escapeHtml(e.id)}` : "Nueva empresa"}</h3></div>
                <button class="icon-button" type="button" onclick="cerrarEmpresaForm()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="empresaId" type="hidden" value="${escapeHtml(e.id ?? 0)}">
            <div class="entity-grid">
                <div class="form-group"><label>Descripción</label><input id="empresaDescripcion" type="text" value="${escapeHtml(e.descripcion ?? "")}" required></div>
                <div class="form-group"><label>RFC</label><input id="empresaRfc" type="text" value="${escapeHtml(e.rfc ?? "")}" required></div>
                <label class="check-field"><input id="empresaEsActiva" type="checkbox" ${(e.esActiva ?? true) ? "checked" : ""}> Activa</label>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${isEdit ? "Guardar cambios" : "Crear empresa"}</button>
                <button class="btn-secondary-action" type="button" onclick="cerrarEmpresaForm()">Cancelar</button>
            </div>
        </form>`;
    document.getElementById("empresaForm")?.addEventListener("submit", guardarEmpresa);
}

function cerrarEmpresaForm() { const p = document.getElementById("empresaFormPanel"); if (p) p.innerHTML = ""; }

async function guardarEmpresa(event) {
    event.preventDefault();
    await ensureSweetAlert();
    const id = Number(document.getElementById("empresaId").value) || 0;
    const isEdit = id > 0;
    const base = {
        descripcion: document.getElementById("empresaDescripcion").value.trim(),
        rfc: document.getElementById("empresaRfc").value.trim(),
        esActiva: document.getElementById("empresaEsActiva").checked
    };
    const payload = isEdit ? { id, ...base } : base;
    await postOrPut("Empresas", `${API}/Catalogos/empresas`, isEdit, payload, getEmpresas);
}

// ================= UNIDADES DE NEGOCIO =================
let udnCache = [];

async function getUnidadesNegocio() {
    renderCatalogoLoading("Catálogo", "Unidades de Negocio");
    try {
        const res = await fetch(`${API}/Catalogos/unidadesnegocio`);
        const data = await res.json();
        udnCache = data;
        let html = `
        <div class="page-title">
            <div><span class="eyebrow">Catálogo</span><h2>Unidades de Negocio</h2><p>Alta, edición y baja de UDN.</p></div>
            <button class="btn-primary" onclick="nuevaUdn()"><i class="fa-solid fa-plus"></i> Nueva UDN</button>
        </div>
        <div id="udnFormPanel"></div>
        <div class="table-container"><table>
        <tr><th>Editar</th><th>Baja</th><th>Id</th><th>Descripción</th><th>Empresa Id</th><th>Activa</th></tr>`;
        data.forEach(u => {
            const id = Number(u.idUdn ?? u.id);
            html += `<tr>
                <td><button class="table-action-btn" onclick="editarUdn(${id})"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td><button class="table-action-btn table-action-danger" onclick="bajaUdn(${id})"><i class="fa-solid fa-ban"></i></button></td>
                <td>${escapeHtml(id)}</td><td>${escapeHtml(u.descripcion)}</td><td>${escapeHtml(u.idEmpresa)}</td><td>${formatCellValue(u.esActiva)}</td>
            </tr>`;
        });
        html += "</table></div>";
        render(html);
    } catch (error) { console.error(error); render("Error cargando Unidades de Negocio"); }
}

function nuevaUdn() { renderUdnForm({ descripcion: "", idEmpresa: 0, esActiva: true }); }

function editarUdn(id) {
    const u = udnCache.find(x => Number(x.idUdn ?? x.id) === Number(id));
    if (!u) return;
    renderUdnForm(u);
}

function renderUdnForm(u) {
    const id = Number(u.idUdn ?? u.id ?? 0);
    const isEdit = id > 0;
    const panel = document.getElementById("udnFormPanel");
    panel.innerHTML = `
        <form class="entity-form" id="udnForm">
            <div class="entity-form-header">
                <div><span class="eyebrow">${isEdit ? "Editar" : "Nueva"}</span><h3>${isEdit ? `UDN ${id}` : "Nueva UDN"}</h3></div>
                <button class="icon-button" type="button" onclick="cerrarUdnForm()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="udnId" type="hidden" value="${id}">
            <div class="entity-grid">
                <div class="form-group"><label>Descripción</label><input id="udnDescripcion" type="text" value="${escapeHtml(u.descripcion ?? "")}" required></div>
                <div class="form-group"><label>Empresa Id</label><input id="udnIdEmpresa" type="number" min="1" step="1" value="${escapeHtml(u.idEmpresa ?? 0)}" required></div>
                <label class="check-field"><input id="udnEsActiva" type="checkbox" ${(u.esActiva ?? true) ? "checked" : ""}> Activa</label>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${isEdit ? "Guardar cambios" : "Crear UDN"}</button>
                <button class="btn-secondary-action" type="button" onclick="cerrarUdnForm()">Cancelar</button>
            </div>
        </form>`;
    document.getElementById("udnForm")?.addEventListener("submit", guardarUdn);
}

function cerrarUdnForm() { const p = document.getElementById("udnFormPanel"); if (p) p.innerHTML = ""; }

async function guardarUdn(event) {
    event.preventDefault();
    await ensureSweetAlert();
    const idUdn = Number(document.getElementById("udnId").value) || 0;
    const isEdit = idUdn > 0;
    const base = {
        descripcion: document.getElementById("udnDescripcion").value.trim(),
        idEmpresa: Number(document.getElementById("udnIdEmpresa").value),
        esActiva: document.getElementById("udnEsActiva").checked
    };
    const payload = isEdit ? { idUdn, ...base } : base;
    await postOrPut("UDN", `${API}/Catalogos/unidadesnegocio`, isEdit, payload, getUnidadesNegocio);
}

async function bajaUdn(idUdn) {
    await ensureSweetAlert();
    const ok = await Swal.fire({ icon: "warning", title: `¿Dar de baja la UDN ${idUdn}?`, showCancelButton: true, confirmButtonText: "Sí, dar de baja", cancelButtonText: "Cancelar" });
    if (!ok.isConfirmed) return;
    await deleteEntity(`${API}/Catalogos/unidadesnegocio`, { idUdn }, "UDN", getUnidadesNegocio);
}

// ================= ALMACENES =================
let almacenesCache = [];

async function getAlmacenes() {
    renderCatalogoLoading("Catálogo", "Almacenes");
    try {
        const res = await fetch(`${API}/Catalogos/almacenes`);
        const data = await res.json();
        almacenesCache = data;
        let html = `
        <div class="page-title">
            <div><span class="eyebrow">Catálogo</span><h2>Almacenes</h2><p>Alta, edición y baja de almacenes.</p></div>
            <button class="btn-primary" onclick="nuevoAlmacen()"><i class="fa-solid fa-plus"></i> Nuevo almacén</button>
        </div>
        <div id="almacenFormPanel"></div>
        <div class="table-container"><table>
        <tr><th>Editar</th><th>Baja</th><th>Id</th><th>Descripción</th><th>Tipo</th><th>Empresa</th><th>UDN</th><th>Activo</th></tr>`;
        data.forEach(a => {
            const id = Number(a.idAlmacen ?? a.id);
            html += `<tr>
                <td><button class="table-action-btn" onclick="editarAlmacen(${id})"><i class="fa-solid fa-pen-to-square"></i></button></td>
                <td><button class="table-action-btn table-action-danger" onclick="bajaAlmacen(${id})"><i class="fa-solid fa-ban"></i></button></td>
                <td>${escapeHtml(id)}</td><td>${escapeHtml(a.descripcion)}</td><td>${escapeHtml(a.tipo)}</td><td>${escapeHtml(a.idEmpresa)}</td><td>${escapeHtml(a.idUdn)}</td><td>${formatCellValue(a.esActivo)}</td>
            </tr>`;
        });
        html += "</table></div>";
        render(html);
    } catch (error) { console.error(error); render("Error cargando Almacenes"); }
}

function nuevoAlmacen() { renderAlmacenForm({ descripcion: "", tipo: "", idEmpresa: 0, idUdn: 0, esActivo: true }); }

function editarAlmacen(id) {
    const a = almacenesCache.find(x => Number(x.idAlmacen ?? x.id) === Number(id));
    if (!a) return;
    renderAlmacenForm(a);
}

function renderAlmacenForm(a) {
    const id = Number(a.idAlmacen ?? a.id ?? 0);
    const isEdit = id > 0;
    const panel = document.getElementById("almacenFormPanel");
    panel.innerHTML = `
        <form class="entity-form" id="almacenForm">
            <div class="entity-form-header">
                <div><span class="eyebrow">${isEdit ? "Editar" : "Nuevo"}</span><h3>${isEdit ? `Almacén ${id}` : "Nuevo almacén"}</h3></div>
                <button class="icon-button" type="button" onclick="cerrarAlmacenForm()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <input id="almacenId" type="hidden" value="${id}">
            <div class="entity-grid">
                <div class="form-group"><label>Descripción</label><input id="almacenDescripcion" type="text" value="${escapeHtml(a.descripcion ?? "")}" required></div>
                <div class="form-group"><label>Tipo</label><input id="almacenTipo" type="text" value="${escapeHtml(a.tipo ?? "")}" required></div>
                <div class="form-group"><label>Empresa Id</label><input id="almacenIdEmpresa" type="number" min="1" step="1" value="${escapeHtml(a.idEmpresa ?? 0)}" required></div>
                <div class="form-group"><label>UDN Id</label><input id="almacenIdUdn" type="number" min="1" step="1" value="${escapeHtml(a.idUdn ?? 0)}" required></div>
                <label class="check-field"><input id="almacenEsActivo" type="checkbox" ${(a.esActivo ?? true) ? "checked" : ""}> Activo</label>
            </div>
            <div class="entity-actions">
                <button class="btn-primary" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${isEdit ? "Guardar cambios" : "Crear almacén"}</button>
                <button class="btn-secondary-action" type="button" onclick="cerrarAlmacenForm()">Cancelar</button>
            </div>
        </form>`;
    document.getElementById("almacenForm")?.addEventListener("submit", guardarAlmacen);
}

function cerrarAlmacenForm() { const p = document.getElementById("almacenFormPanel"); if (p) p.innerHTML = ""; }

async function guardarAlmacen(event) {
    event.preventDefault();
    await ensureSweetAlert();
    const idAlmacen = Number(document.getElementById("almacenId").value) || 0;
    const isEdit = idAlmacen > 0;
    const base = {
        descripcion: document.getElementById("almacenDescripcion").value.trim(),
        tipo: document.getElementById("almacenTipo").value.trim(),
        idEmpresa: Number(document.getElementById("almacenIdEmpresa").value),
        idUdn: Number(document.getElementById("almacenIdUdn").value),
        esActivo: document.getElementById("almacenEsActivo").checked
    };
    const payload = isEdit ? { idAlmacen, ...base } : base;
    await postOrPut("Almacén", `${API}/Catalogos/almacenes`, isEdit, payload, getAlmacenes);
}

async function bajaAlmacen(idAlmacen) {
    await ensureSweetAlert();
    const a = almacenesCache.find(x => Number(x.idAlmacen ?? x.id) === Number(idAlmacen));
    if (!a) return;
    const ok = await Swal.fire({ icon: "warning", title: `¿Dar de baja el almacén ${idAlmacen}?`, showCancelButton: true, confirmButtonText: "Sí, dar de baja", cancelButtonText: "Cancelar" });
    if (!ok.isConfirmed) return;
    await deleteEntity(`${API}/Catalogos/almacenes`, { idAlmacen, idEmpresa: a.idEmpresa, idUdn: a.idUdn }, "Almacén", getAlmacenes);
}

// ================= COMPRAS (consulta) =================
function renderCompras() {
    render(`
        <div class="page-title">
            <div><span class="eyebrow">Compras</span><h2>Compras</h2><p>Consulta de compras por empresa y UDN.</p></div>
        </div>
        <form class="filter-panel" id="comprasForm">
            <div class="form-group"><label>Empresa Id</label><input id="comprasEmpresaId" type="number" min="1" step="1" placeholder="Ej. 1" required></div>
            <div class="form-group"><label>UDN Id</label><input id="comprasUdnId" type="number" min="1" step="1" placeholder="Ej. 1" required></div>
            <button class="btn-primary" type="submit"><i class="fa-solid fa-magnifying-glass"></i> Consultar</button>
        </form>
        <div id="comprasResult" class="result-space">
            <div class="empty-state"><i class="fa-solid fa-cart-shopping"></i><h2>Compras</h2><p>Ingresa los parámetros para consultar.</p></div>
        </div>
    `);
    document.getElementById("comprasForm")?.addEventListener("submit", consultarCompras);
}

async function consultarCompras(event) {
    event.preventDefault();
    const empresaId = document.getElementById("comprasEmpresaId").value;
    const udnId = document.getElementById("comprasUdnId").value;
    const container = document.getElementById("comprasResult");
    container.innerHTML = `<div class="loading-state">Consultando compras...</div>`;
    try {
        const res = await fetch(`${API}/Compras?empresaId=${encodeURIComponent(empresaId)}&udnId=${encodeURIComponent(udnId)}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const payload = await res.json();
        renderDynamicTableResult(container, payload, "Sin resultados", "No se encontraron compras.");
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h2>Error cargando compras</h2><p>Revisa los parámetros o el API.</p></div>`;
    }
}

// ================= MOVIMIENTOS DE ALMACÉN (consulta) =================
function renderMovimientos() {
    render(`
        <div class="page-title">
            <div><span class="eyebrow">Inventarios</span><h2>Movimientos de Almacén</h2><p>Consulta de movimientos por empresa, UDN y rango de fechas.</p></div>
        </div>
        <form class="filter-panel filter-panel-four" id="movimientosForm">
            <div class="form-group"><label>Empresa Id</label><input id="movEmpresaId" type="number" min="1" step="1" placeholder="Ej. 1" required></div>
            <div class="form-group"><label>UDN Id</label><input id="movUdnId" type="number" min="1" step="1" placeholder="Ej. 1" required></div>
            <div class="form-group"><label>Fecha desde</label><input id="movFechaDesde" type="date"></div>
            <div class="form-group"><label>Fecha hasta</label><input id="movFechaHasta" type="date"></div>
            <button class="btn-primary" type="submit"><i class="fa-solid fa-magnifying-glass"></i> Consultar</button>
        </form>
        <div id="movimientosResult" class="result-space">
            <div class="empty-state"><i class="fa-solid fa-list-check"></i><h2>Movimientos</h2><p>Ingresa los parámetros para consultar.</p></div>
        </div>
    `);
    document.getElementById("movimientosForm")?.addEventListener("submit", consultarMovimientos);
}

async function consultarMovimientos(event) {
    event.preventDefault();
    const empresaId = document.getElementById("movEmpresaId").value;
    const udnId = document.getElementById("movUdnId").value;
    const desde = document.getElementById("movFechaDesde").value;
    const hasta = document.getElementById("movFechaHasta").value;
    const container = document.getElementById("movimientosResult");
    container.innerHTML = `<div class="loading-state">Consultando movimientos...</div>`;
    try {
        const params = new URLSearchParams({ empresaId, udnId });
        if (desde) params.set("fechaDesde", desde);
        if (hasta) params.set("fechaHasta", hasta);
        const res = await fetch(`${API}/MovimientosDeAlmacen?${params.toString()}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const payload = await res.json();
        renderDynamicTableResult(container, payload, "Sin resultados", "No se encontraron movimientos.");
    } catch (error) {
        console.error(error);
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h2>Error cargando movimientos</h2><p>Revisa los parámetros o el API.</p></div>`;
    }
}

// ================= IMPORTADOR SIMS =================
function renderImportadorSims() {
    render(`
        <div class="card">
            <div class="page-title">
                <div>
                    <span class="eyebrow">Importador</span>
                    <h2><i class="fa-solid fa-sim-card"></i> Importador de Sims</h2>
                    <p class="subtitle">Carga el archivo de sims y configura los datos del lote.</p>
                </div>
            </div>
            <div class="drop-zone" id="dropZoneSims">
                <p id="dropTextSims"><i class="fa-solid fa-cloud-arrow-up"></i> Arrastra tu archivo aquí o haz click</p>
                <input type="file" id="archivoSims" style="display:none;">
            </div>
            <div class="form-grid">
                <div class="form-group"><label>Producto Id</label><input id="simsProductoId" type="number" min="1" step="1"></div>
                <div class="form-group"><label>Lote Tecomnet</label><input id="simsLoteTecomnet" type="text"></div>
                <div class="form-group"><label>Lote Altan</label><input id="simsLoteAltan" type="text"></div>
                <div class="form-group"><label>Fecha de compra</label><input id="simsFechaCompra" type="date"></div>
            </div>
            <button class="btn-primary" id="btnImportarSims"><i class="fa-solid fa-upload"></i> Importar archivo</button>
            <div id="statusSims" class="status"></div>
        </div>
    `);
    initDropZoneSims();
    document.getElementById("btnImportarSims").addEventListener("click", enviarImportadorSims);
}

function initDropZoneSims() {
    const dropZone = document.getElementById("dropZoneSims");
    const fileInput = document.getElementById("archivoSims");
    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("active"); });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("active"));
    dropZone.addEventListener("drop", e => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        dropZone.classList.remove("active");
        dropZone.querySelector("p").innerText = `✅ ${e.dataTransfer.files[0].name}`;
    });
    fileInput.addEventListener("change", () => {
        dropZone.querySelector("p").innerText = `✅ ${fileInput.files[0].name}`;
    });
}

async function enviarImportadorSims() {
    await ensureSweetAlert();
    const archivo = document.getElementById("archivoSims")?.files?.[0];
    if (!archivo) { Swal.fire({ icon: "warning", title: "Falta archivo" }); return; }
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("productoId", document.getElementById("simsProductoId").value);
    formData.append("loteTecomnet", document.getElementById("simsLoteTecomnet").value);
    formData.append("loteALtan", document.getElementById("simsLoteAltan").value);
    formData.append("fechaCompra", document.getElementById("simsFechaCompra").value);
    Swal.fire({ title: "Importando...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const response = await fetch(`${API}/Importador/ImportadorSims`, { method: "POST", body: formData });
        const text = await response.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = null; }
        if (!response.ok || (data && data.exito === false)) {
            const errores = data?.errores ?? data?.Errors ?? data?.error ?? data?.message ?? [text || "Error del servidor"];
            const lista = Array.isArray(errores) ? errores : [errores];
            Swal.fire({ icon: "error", title: "Error en la importación", html: lista.map(e => `<div>• ${escapeHtml(e)}</div>`).join("") });
            return;
        }
        Swal.fire({ icon: "success", title: "Importación exitosa", text: data?.total != null ? `Registros: ${data.total}` : "" });
    } catch (err) {
        Swal.fire({ icon: "error", title: "Error de red", text: err.message });
    }
}

// ================= HELPERS CRUD =================
async function postOrPut(label, url, isEdit, payload, refreshFn) {
    try {
        const res = await fetch(url, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = null; }
        if (!res.ok) {
            console.error(label, res.status, text, "payload:", payload);
            const lines = data?.errors
                ? Object.values(data.errors).flat()
                : [data?.title || data?.message || data?.error || text || "Sin detalle"];
            Swal.fire({
                icon: "error",
                title: `No se pudo guardar (HTTP ${res.status})`,
                html: `<div style="text-align:left">${lines.map(l => `<div>• ${escapeHtml(l)}</div>`).join("")}</div>`
            });
            return;
        }
        Swal.fire({ icon: "success", title: isEdit ? `${label} actualizado.` : `${label} creado.` });
        refreshFn();
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: "error", title: "Error de red", text: error.message });
    }
}

async function deleteEntity(url, payload, label, refreshFn) {
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const text = await res.text();
            console.error(label, "DELETE", res.status, text);
            Swal.fire({ icon: "error", title: `No se pudo eliminar (HTTP ${res.status})`, text: text || "Sin detalle" });
            return;
        }
        Swal.fire({ icon: "success", title: `${label} dado de baja.` });
        refreshFn();
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: "error", title: "Error de red", text: error.message });
    }
}

// ================= KARDEX =================
const kardexQueryModes = {
    productoEmpresa: {
        endpoint: ({ idProducto, idEmpresa }) => `${API}/Kardex?idProducto=${encodeURIComponent(idProducto)}&idEmpresa=${encodeURIComponent(idEmpresa)}`,
        ready: true,
        help: "Usa el endpoint actual: /api/Kardex?idProducto=&idEmpresa=."
    },
    empresa: {
        endpoint: ({ idEmpresa }) => `${API}/Kardex/Empresa?idEmpresa=${encodeURIComponent(idEmpresa)}`,
        ready: false,
        help: "Pendiente: cuando exista, consultará el Kardex por empresa."
    },
    completo: {
        endpoint: () => `${API}/Kardex/Completo`,
        ready: false,
        help: "Pendiente: cuando exista, consultará el Kardex completo."
    }
};

function renderKardex() {
    render(`
        <div class="page-title">
            <div><span class="eyebrow">KPI's</span><h2>Kardex</h2><p>Consulta movimientos por alcance: completo, empresa o empresa y producto.</p></div>
        </div>
        <form class="filter-panel" id="kardexForm">
            <div class="form-group kardex-mode-field">
                <label>Tipo de consulta</label>
                <select id="kardexMode">
                    <option value="productoEmpresa">Por empresa y producto</option>
                    <option value="empresa">Por empresa (pendiente)</option>
                    <option value="completo">Kardex completo (pendiente)</option>
                </select>
                <small id="kardexModeHelp">Usa el endpoint actual: /api/Kardex?idProducto=&idEmpresa=.</small>
            </div>
            <div class="form-group" data-kardex-field="idProducto">
                <label>Id Producto</label>
                <input id="kardexIdProducto" type="number" min="1" step="1" placeholder="Ej. 4" required>
            </div>
            <div class="form-group" data-kardex-field="idEmpresa">
                <label>Id Empresa</label>
                <input id="kardexIdEmpresa" type="number" min="1" step="1" placeholder="Ej. 1" required>
            </div>
            <button class="btn-primary" id="kardexSubmit" type="submit"><i class="fa-solid fa-magnifying-glass-chart"></i> Consultar</button>
        </form>
        <div id="kardexResult" class="result-space">
            <div class="empty-state"><i class="fa-solid fa-chart-line"></i><h2>Kardex</h2><p>Ingresa los parámetros para consultar la información.</p></div>
        </div>
    `);
    document.getElementById("kardexForm")?.addEventListener("submit", getKardex);
    document.getElementById("kardexMode")?.addEventListener("change", updateKardexMode);
    updateKardexMode();
}

function updateKardexMode() {
    const mode = document.getElementById("kardexMode")?.value ?? "productoEmpresa";
    const config = kardexQueryModes[mode];
    const productField = document.querySelector('[data-kardex-field="idProducto"]');
    const companyField = document.querySelector('[data-kardex-field="idEmpresa"]');
    const productInput = document.getElementById("kardexIdProducto");
    const companyInput = document.getElementById("kardexIdEmpresa");
    const submitButton = document.getElementById("kardexSubmit");
    const help = document.getElementById("kardexModeHelp");
    if (productField) productField.hidden = mode !== "productoEmpresa";
    if (companyField) companyField.hidden = mode === "completo";
    if (productInput) productInput.required = mode === "productoEmpresa";
    if (companyInput) companyInput.required = mode !== "completo";
    if (submitButton) submitButton.disabled = !config.ready;
    if (help) help.textContent = config.help;
}

async function getKardex(event) {
    event.preventDefault();
    const mode = document.getElementById("kardexMode").value;
    const config = kardexQueryModes[mode];
    const idProducto = document.getElementById("kardexIdProducto").value;
    const idEmpresa = document.getElementById("kardexIdEmpresa").value;
    const resultContainer = document.getElementById("kardexResult");
    if (!config.ready) {
        resultContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-screwdriver-wrench"></i><h2>Endpoint pendiente</h2><p>${config.help}</p></div>`;
        return;
    }
    resultContainer.innerHTML = `<div class="loading-state">Consultando Kardex...</div>`;
    try {
        const res = await fetch(config.endpoint({ idProducto, idEmpresa }));
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const payload = await res.json();
        const data = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : payload ? [payload] : [];
        if (!data.length) {
            resultContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-info"></i><h2>Sin resultados</h2><p>No se encontraron movimientos para esos parámetros.</p></div>`;
            return;
        }
        const columns = Object.keys(data[0]);
        const headers = columns.map(c => `<th>${escapeHtml(c)}</th>`).join("");
        const rows = data.map(row => `<tr>${columns.map(c => `<td>${formatCellValue(row[c])}</td>`).join("")}</tr>`).join("");
        resultContainer.innerHTML = `<div class="table-container"><table><tr>${headers}</tr>${rows}</table></div>`;
    } catch (error) {
        console.error(error);
        resultContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><h2>Error cargando Kardex</h2><p>Revisa los parámetros o que el API esté disponible.</p></div>`;
    }
}

// ================= IMPORTADOR =================
function renderImportador() {
    render(`
        <div class="card">
            <div class="page-title">
                <div>
                    <span class="eyebrow">Importador</span>
                    <h2><i class="fa-solid fa-file-arrow-up"></i> Importador de Inventario</h2>
                    <p class="subtitle">Carga tu archivo y configura los datos del lote.</p>
                </div>
            </div>
            <div class="drop-zone" id="dropZone">
                <p id="dropText"><i class="fa-solid fa-cloud-arrow-up"></i> Arrastra tu archivo aquí o haz click</p>
                <input type="file" id="archivo" style="display:none;">
            </div>
            <div class="form-grid">
                <div class="form-group"><label>Material</label><input id="material" type="number"></div>
                <div class="form-group"><label>Tipo</label><input id="tipo" type="number"></div>
                <div class="form-group"><label>Lote</label><input id="lote" type="text"></div>
                <div class="form-group"><label>Fecha de compra</label><input type="date" id="fecha"></div>
            </div>
            <button class="btn-primary" id="btnImportar"><i class="fa-solid fa-upload"></i> Importar archivo</button>
            <div id="status" class="status"></div>
        </div>
    `);
    initDropZone();
    document.getElementById("btnImportar").addEventListener("click", enviarImportador);
}

function initDropZone() {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("archivo");
    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("active"); });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("active"));
    dropZone.addEventListener("drop", e => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        dropZone.classList.remove("active");
        dropZone.querySelector("p").innerText = `✅ ${e.dataTransfer.files[0].name}`;
    });
    fileInput.addEventListener("change", () => {
        dropZone.querySelector("p").innerText = `✅ ${fileInput.files[0].name}`;
    });
}

async function enviarImportador() {
    await ensureSweetAlert();
    const archivoInput = document.getElementById("archivo");
    const archivo = archivoInput?.files?.[0];
    const material = document.getElementById("material").value;
    const tipo = document.getElementById("tipo").value;
    const lote = document.getElementById("lote").value;
    const fecha = document.getElementById("fecha").value;
    if (!archivo) { Swal.fire({ icon: 'warning', title: 'Falta archivo' }); return; }
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("material", material);
    formData.append("tipo", tipo);
    formData.append("loteTecomnet", lote);
    formData.append("dtFechaCompra", fecha);
    Swal.fire({ title: 'Importando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const response = await fetch(`${API}/importador/importador`, { method: "POST", body: formData });
        const text = await response.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = null; }
        if (!response.ok || !data?.exito) {
            const errores = data?.errores ?? data?.Errors ?? data?.error ?? data?.message ?? [text || "Error del servidor"];
            const lista = Array.isArray(errores) ? errores : [errores];
            Swal.fire({ icon: 'error', title: 'Error en la importación', html: lista.map(e => `<div>• ${e}</div>`).join('') });
            return;
        }
        Swal.fire({ icon: 'success', title: 'Importación exitosa', text: `Registros: ${data.total}` });
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error de red', text: err.message });
    }
}

// ================= MENU =================
function toggleMenu(id) {
    // Close submenus when sidebar is collapsed
    if (document.getElementById("sidebar")?.classList.contains("collapsed")) {
        toggleSidebar();
        setTimeout(() => document.getElementById(id)?.classList.toggle("active"), 300);
        return;
    }
    document.getElementById(id).classList.toggle("active");
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const isCollapsed = sidebar.classList.toggle("collapsed");

    // Close all open submenus when collapsing
    if (isCollapsed) {
        document.querySelectorAll(".submenu.active").forEach(el => el.classList.remove("active"));
    }

    localStorage.setItem("sidebarCollapsed", isCollapsed);
}

function openMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    sidebar.classList.add("mobile-open");
    overlay.classList.add("visible");
}

function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("visible");
}

async function logout() {
    await ensureSweetAlert();
    Swal.fire({ icon: "info", title: "Salir", text: "La salida estará disponible cuando se implemente el login." });
}

// ================= CHARTS =================
async function charts() {
    try {
        const res = await fetch(`${API}/productos`);
        const json = await res.json();
        const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        await ensureGoogleCharts();

        const total = data.length;
        const totalProductos = document.getElementById("totalProductos");
        const totalProductosIva = document.getElementById("totalProductosIva");
        const totalProductosIeps = document.getElementById("totalProductosIeps");
        if (totalProductos) totalProductos.innerText = total;
        if (totalProductosIva) totalProductosIva.innerText = data.filter(p => Number(p.iva) > 0).length;
        if (totalProductosIeps) totalProductosIeps.innerText = data.filter(p => Number(p.ieps) > 0).length;

        const productosTable = new google.visualization.DataTable();
        productosTable.addColumn("string", "Producto");
        productosTable.addColumn("number", "ID");
        data.slice(0, 20).forEach(p => productosTable.addRow([String(p.descripcion ?? "-"), Number(p.id) || 0]));
        const taxData = [
            ["Impuesto", "Productos"],
            ["Con IVA", data.filter(p => Number(p.iva) > 0).length],
            ["Con IEPS", data.filter(p => Number(p.ieps) > 0).length],
            ["Sin impuestos", data.filter(p => !Number(p.iva) && !Number(p.ieps)).length]
        ];

        const baseOptions = {
            backgroundColor: "transparent",
            colors: ["#3b9eff", "#22d3a5", "#f5c542", "#38d9f5", "#a78bfa", "#fb923c"],
            titleTextStyle: { color: "#e8f0ff", fontSize: 15, bold: true },
            legend: { textStyle: { color: "#7a96c4", fontSize: 12 } },
            pieSliceTextStyle: { color: "#e8f0ff", bold: true },
            chartArea: { width: "85%", height: "75%" }
        };

        const productosChart = new google.visualization.ColumnChart(document.getElementById("chartProductos"));
        productosChart.draw(productosTable, {
            ...baseOptions,
            title: "Productos",
            legend: { position: "none" },
            hAxis: { textStyle: { color: "#7a96c4", fontSize: 10 } },
            vAxis: { minValue: 0, textStyle: { color: "#7a96c4" }, gridlines: { color: "rgba(64,140,255,0.1)" }, baselineColor: "rgba(64,140,255,0.2)" }
        });

        const impuestosChart = new google.visualization.ColumnChart(document.getElementById("chartImpuestos"));
        impuestosChart.draw(google.visualization.arrayToDataTable(taxData), {
            ...baseOptions,
            title: "Impuestos",
            legend: { position: "none" },
            hAxis: { textStyle: { color: "#7a96c4" } },
            vAxis: { minValue: 0, textStyle: { color: "#7a96c4" }, gridlines: { color: "rgba(64,140,255,0.1)" }, baselineColor: "rgba(64,140,255,0.2)" }
        });

    } catch (err) { console.error(err); }
}

// ================= UTILS =================
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatearFecha(fecha) {
    if (!fecha) return '-';
    const f = new Date(fecha);
    if (isNaN(f)) return '-';
    return f.toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCellValue(value) {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "object") return escapeHtml(JSON.stringify(value));
    const text = String(value);
    if (/^\d{4}-\d{2}-\d{2}T/.test(text) || /^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return escapeHtml(formatearFecha(text));
    }
    return escapeHtml(text);
}

// Restore sidebar collapsed state on load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("sidebarCollapsed") === "true") {
        document.getElementById("sidebar")?.classList.add("collapsed");
    }
});