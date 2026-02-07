// src/js/controlls/terminal.js


let productos = [];
let total = 0;

/*    RENDER DE LA VENTA*/
function renderVenta() {
    const tbody = document.getElementById("listaProductos");
    if (!tbody) return;

    tbody.innerHTML = "";
    total = 0;

    productos.forEach(p => {
        const subtotal = p.cantidad * p.precio;
        total += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

/*    BUSCAR PRODUCTO EN SQLITE */
async function buscarProducto(codigo) {
    const sql = `
        SELECT id, nombre, precio_unidad
        FROM productos
        WHERE codigo_barras = ? OR codigo_sku = ?
        LIMIT 1
    `;

    const result = await window.sqlite.query(sql, [codigo, codigo]);

    return (Array.isArray(result) && result.length > 0) ? result[0] : null;
}


/*    AGREGAR PRODUCTO */
async function agregarProductoPorCodigo(codigo) {
    if (!codigo) return;

    const producto = await buscarProducto(codigo);

    if (!producto) {
        Swal.fire({
            icon: 'error',
            title: 'Producto no encontrado',
            text: 'El artículo no existe en la base de datos'
        });
        return;
    }

    const existente = productos.find(p => p.id === producto.id);

    if (existente) {
        existente.cantidad++;
    } else {
        productos.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio_unidad),
            cantidad: 1
        });
    }

    renderVenta();
}


/*    COBRO */
async function cobrar(metodoPagoId) {
    if (productos.length === 0) {
        Swal.fire('Sin productos', 'Agrega productos antes de cobrar', 'warning');
        return;
    }

    const corteId = localStorage.getItem("corte_activo");

    if (!corteId) {
        Swal.fire('Caja cerrada', 'No hay un corte activo', 'error');
        return;
    }

    // 1️⃣ Insertar venta
    const venta = await insert("ventas", {
        total: total,
        unidades: productos.reduce((s, p) => s + p.cantidad, 0),
        cliente: 1,
        corte: corteId,
        sucursal: 1,
        tipo: metodoPagoId, // ID de catalogos_detalles
        status: 1,
        user: 1
    });

    const ventaId = venta.last_insert_id;

    // 2️⃣ Insertar detalle
    for (const p of productos) {
        await insert("ventas_detalles", {
            cantidad: p.cantidad,
            precio: p.precio,
            precio_vendido: p.precio,
            venta: ventaId,
            inventario: p.id
        });
    }

    productos = [];
    renderVenta();

    Swal.fire('Venta registrada', 'Cobro exitoso', 'success');
}

function cobrarEfectivo() {
    cobrar(1); // ID EFECTIVO
}

function cobrarTarjeta() {
    cobrar(2); // ID TARJETA
}

function cobrarTransferencia() {
    cobrar(3); // ID TRANSFERENCIA
}



/*    OTROS */
function eliminarArticulo() {
    productos.pop();
    renderVenta();
}

function cancelarVenta() {
    productos = [];
    renderVenta();
}

function loadView() {
    renderVenta();
}

/*    EXPORT DEFAULT (OBLIGATORIO) */
export default {
    agregarProductoPorCodigo,
    cobrar,
    cobrarEfectivo,
    cobrarTarjeta,
    cobrarTransferencia,
    eliminarArticulo,
    cancelarVenta,
    loadView
};
