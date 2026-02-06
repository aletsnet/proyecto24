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
        SELECT p.id, p.nombre, i.precio_venta as precio_unidad, i.id as inventario_id, i.stock
        FROM productos p
        JOIN inventarios i ON p.id = i.producto
        WHERE (p.codigo_barras = ? OR p.codigo_sku = ?) AND i.sucursal = 1 AND i.stock > 0 AND i.deleted_at IS NULL
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
            text: 'El artículo no existe en la base de datos o no hay stock'
        });
        return;
    }

    const existente = productos.find(p => p.id === producto.id);

    if (existente) {
        if (existente.cantidad + 1 > producto.stock) {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: 'No hay suficiente stock para este producto'
            });
            return;
        }
        existente.cantidad++;
    } else {
        productos.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio_unidad),
            cantidad: 1,
            inventario_id: producto.inventario_id
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
            inventario: p.inventario_id
        });
    }

    // 3️⃣ Actualizar inventario y movimientos
    for (const p of productos) {
        const currentStock = await query("SELECT stock FROM inventarios WHERE id = ?", [p.inventario_id]);
        const newStock = currentStock[0].stock - p.cantidad;
        await update("inventarios", { stock: newStock }, "id = ?", [p.inventario_id]);

        await insert("inventarios_movimientos", {
            inventario: p.inventario_id,
            tipo: "salida",
            cantidad: p.cantidad,
            precio: p.precio,
            user: 1,
            corte: corteId
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
