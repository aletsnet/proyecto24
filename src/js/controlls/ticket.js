/* ===== FECHA ===== */
document.getElementById("fecha").textContent = new Date().toLocaleString();

/* ===== LOGO ===== */
const logo = document.getElementById("logo");
logo.src = "logoterminado.png";
logo.style.width = "120px";
logo.style.height = "100px";
logo.style.left = "50%";
logo.style.transform = "translateX(-50%)";

/* ===== HISTORIAL ===== */
let historial = [];
let indice = -1;

const ticket = document.getElementById("ticket");
const contenido = document.getElementById("contenido");

function guardarEstado(){
    historial = historial.slice(0, indice + 1);
    historial.push(ticket.innerHTML);
    indice++;
}

guardarEstado();

contenido.addEventListener("input", guardarEstado);

function undo(){
    if(indice > 0){
        indice--;
        ticket.innerHTML = historial[indice];
    }
}

function redo(){
    if(indice < historial.length - 1){
        indice++;
        ticket.innerHTML = historial[indice];
    }
}

function activarEdicion(){
    contenido.contentEditable = true;
}

function imprimir(){
    window.print();
}

/* ===== PDF ===== */
function guardarTicketPDF(){
    html2pdf().set({
        margin:0,
        filename:"ticket_final.pdf",
        html2canvas:{scale:3},
        jsPDF:{unit:"mm", format:[100,200]}
    }).from(ticket).save();
}

/* ===== IMPORTAR VENTA ===== */
function recargarProductos(){

    fetch("producto.json")
    .then(res => res.json())
    .then(productos => {

        const tbody = document.getElementById("tbodyProductos");
        tbody.innerHTML = "";

        let total = 0;

        productos.forEach(p => {
            const subtotal = p.cantidad * p.precio;
            total += subtotal;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio}</td>
                <td>$${subtotal}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById("total").textContent = "Total: $" + total;
        document.getElementById("pago").textContent = "Pago efectivo: $" + total;
        document.getElementById("cambio").textContent = "Cambio: $0";

        guardarEstado();
    })
    .catch(error => {
        alert("Error al cargar productos.json");
        console.error(error);
    });
}
