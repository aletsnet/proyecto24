let total = 0;

// =========================
// AGREGAR PRODUCTO
// =========================
function agregarProducto() {
    const input = document.getElementById("producto");
    const nombre = input.value || "Producto genérico";
    const precio = 50;
    const cantidad = 1;
    const subtotal = precio * cantidad;

    total += subtotal;

    const fila = `
        <tr>
            <td>${nombre}</td>
            <td>${cantidad}</td>
            <td>$${precio}</td>
            <td>$${subtotal}</td>
        </tr>
    `;

    document.getElementById("listaProductos").innerHTML += fila;
    document.getElementById("total").textContent = total.toFixed(2);
    input.value = "";
}

// =========================
// COBROS
// =========================
function cobrarEfectivo() {
    alert("Cobro en efectivo seleccionado");
}

function cobrarTarjeta() {
    alert("Cobro con tarjeta seleccionado");
}

function cobrarTransferencia() {
    alert("Cobro por transferencia seleccionado");
}

// =========================
// MENÚ INFERIOR
// =========================
function consultarPrecio() {
    alert("Consultar precio");
}

function mostrarMenu() {
    alert("Mostrar menú de productos");
}

function cambiarUsuario() {
    alert("Cambiar usuario");
}

function eliminarArticulo() {
    alert("Eliminar último artículo");
}

function cancelarVenta() {
    if (confirm("¿Seguro que deseas cancelar la venta?")) {
        document.getElementById("listaProductos").innerHTML = "";
        total = 0;
        document.getElementById("total").textContent = "0.00";
    }
}
const loadView = async () => {
    const lquery = document.getElementById('lquery');
    lquery.value = "SELECT * FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    queryLoad();
}

export default {
    agregarProducto,
    cobrarEfectivo,
    cobrarTarjeta,
    cobrarTransferencia,
    consultarPrecio,
    mostrarMenu,
    cambiarUsuario,
    eliminarArticulo,
    cancelarVenta,
    loadView
};