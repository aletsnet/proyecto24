function init() {

  // ===== FECHA =====
  const fecha = document.getElementById("fecha");
  if (fecha) {
    fecha.textContent = new Date().toLocaleString();
  }

  // ===== LOGO =====
  const logo = document.getElementById("logo");
  if (logo) {
    logo.src = "logoterminado.png";
    logo.style.width = "120px";
    logo.style.height = "100px";
    logo.style.left = "50%";
    logo.style.transform = "translateX(-50%)";
  }

  // ===== UNDO / REDO =====
  let historial = [];
  let indice = -1;

  const ticket = document.getElementById("ticket");
  const contenido = document.getElementById("contenido");

  function guardarEstado() {
    if (!ticket) return;
    historial = historial.slice(0, indice + 1);
    historial.push(ticket.innerHTML);
    indice++;
  }

  if (contenido) {
    guardarEstado();
    contenido.addEventListener("input", guardarEstado);
  }

  // ===== FUNCIONES =====
  function undo() {
    if (indice > 0) {
      indice--;
      ticket.innerHTML = historial[indice];
    }
  }

  function redo() {
    if (indice < historial.length - 1) {
      indice++;
      ticket.innerHTML = historial[indice];
    }
  }

  function activarEdicion() {
    if (contenido) contenido.contentEditable = true;
  }

  function imprimir() {
    window.print();
  }

  function guardarTicketPDF() {
    if (!ticket) return;

    html2pdf()
      .set({
        margin: 0,
        filename: "ticket_final.pdf",
        html2canvas: { scale: 3 },
        jsPDF: { unit: "mm", format: [100, 200] }
      })
      .from(ticket)
      .save();
  }

  function recargarProductos() {
    fetch("/src/producto.json")
      .then(res => res.json())
      .then(productos => {
        const tbody = document.getElementById("tbodyProductos");
        if (!tbody) return;

        tbody.innerHTML = "";
        let total = 0;

        productos.forEach(p => {
          const subtotal = p.cantidad * p.precio;
          total += subtotal;

          tbody.innerHTML += `
            <tr>
              <td>${p.nombre}</td>
              <td>${p.cantidad}</td>
              <td>$${p.precio}</td>
              <td>$${subtotal}</td>
            </tr>
          `;
        });

        document.getElementById("total").textContent = "Total: $" + total;
        document.getElementById("pago").textContent = "Pago efectivo: $" + total;
        document.getElementById("cambio").textContent = "Cambio: $0";

        guardarEstado();
      });
  }

  // 🔥 Exponer funciones al HTML (onclick)
  window.undo = undo;
  window.redo = redo;
  window.activarEdicion = activarEdicion;
  window.imprimir = imprimir;
  window.guardarTicketPDF = guardarTicketPDF;
  window.recargarProductos = recargarProductos;
}

// 🔥 EXPORTAR INIT
export default { init };
document.addEventListener("DOMContentLoaded", init);
