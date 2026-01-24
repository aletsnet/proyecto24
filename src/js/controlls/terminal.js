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
        SELECT 
            id,
            nombre,
            precio_unidad
        FROM productos
        WHERE codigo_barras = ? OR codigo_sku = ?
        LIMIT 1
    `;

    // sqlite viene de window.sqlite (expuesto en main.js)
    const producto = await window.sqlite.query(sql, [codigo, codigo]);

    return producto || {};
}

/*    AGREGAR PRODUCTO */
async function agregarProductoPorCodigo(codigo) {
    if (!codigo) return;

    const producto = await buscarProducto(codigo);

    if (typeof producto.codigo_sku == 'undefined') {
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
function cobrar(metodoPago) {
    if (productos.length === 0) {
        Swal.fire('Sin productos', 'Agrega productos antes de cobrar', 'warning');
        return;
    }

    const ticket = {
        fecha: new Date().toLocaleString(),
        cajero: "Usuario demo",
        caja: "Caja 1",
        metodoPago,
        productos: [...productos],
        total,
        pago: total,
        cambio: 0
    };

    window.dispatchEvent(new CustomEvent("venta:finalizada", {
        detail: ticket
    }));

    productos = [];
    renderVenta();
}

function cobrarEfectivo() {
    cobrar("EFECTIVO");
}

function cobrarTarjeta() {
    cobrar("TARJETA");
}

function cobrarTransferencia() {
    cobrar("TRANSFERENCIA");
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
    cobrarEfectivo,
    cobrarTarjeta,
    cobrarTransferencia,
    eliminarArticulo,
    cancelarVenta,
    loadView
};
