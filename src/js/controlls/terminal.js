// src/js/controlls/terminal.js

let productos = [];
let total = 0;

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

function cobrar(metodoPago) {
    if (productos.length === 0) {
        alert("No hay productos");
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

    // evento global (compatible con tu arquitectura)
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

/**
 * 👇 EXPORT DEFAULT OBLIGATORIO
 */
export default {
    cobrarEfectivo,
    cobrarTarjeta,
    cobrarTransferencia,
    eliminarArticulo,
    cancelarVenta,
    loadView
};
