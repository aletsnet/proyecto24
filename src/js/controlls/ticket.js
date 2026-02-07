const cticket = {

    historial: [],
    indice: -1,

    ticket: null,
    contenido: null,
    toast: null,
    toastTimeout: null,


    /* ======================================================
       INIT
    ====================================================== */
    async loadView() {

        const fecha = document.getElementById("fecha");
        if (fecha) fecha.textContent = new Date().toLocaleString();

        this.ticket = document.getElementById("ticket");
        this.contenido = document.getElementById("contenido");
        this.toast = document.getElementById("mensajeFlotante");

        if (!this.ticket || !this.contenido) return;

        await this.forzarCargaImagenes();
        await this.prepararImagenes();

        this.guardarEstado();

        this.contenido.addEventListener("input", () => this.guardarEstado());

        this.mostrarMensaje(" Has ingresado al Modo edicion📒");
    },


    /* ======================================================
       IMÁGENES
    ====================================================== */
    async forzarCargaImagenes() {

        const imgs = this.ticket.querySelectorAll("img");

        await Promise.all([...imgs].map(img => {

            return new Promise(resolve => {

                if (img.complete && img.naturalWidth !== 0)
                    return resolve();

                const src = img.src;

                img.onload = resolve;
                img.onerror = resolve;

                img.src = "";
                img.src = src;
            });
        }));
    },


    async prepararImagenes() {

        const imgs = this.ticket.querySelectorAll("img");

        await Promise.all([...imgs].map(img => {

            if (img.src.startsWith("data:")) return;

            return new Promise(resolve => {

                const temp = new Image();
                temp.crossOrigin = "anonymous";

                temp.onload = () => {

                    const canvas = document.createElement("canvas");
                    canvas.width = temp.width;
                    canvas.height = temp.height;

                    canvas.getContext("2d").drawImage(temp, 0, 0);

                    img.src = canvas.toDataURL("image/png");

                    resolve();
                };

                temp.src = img.src;
            });
        }));
    },


    /* ======================================================
       🔥 TOAST (FIX DEFINITIVO)
    ====================================================== */
    mostrarMensaje(texto, tiempo = 2500) {

        if (!this.toast) return;

        this.toast.textContent = texto;

        clearTimeout(this.toastTimeout);

        /* 🔥 reinicia animación si ya estaba visible */
        this.toast.classList.remove("show-toast");
        void this.toast.offsetWidth; // reflow

        this.toast.classList.add("show-toast");

        this.toastTimeout = setTimeout(() => {
            this.toast.classList.remove("show-toast");
        }, tiempo);
    },


    /* ======================================================
       HISTORIAL
    ====================================================== */
    guardarEstado() {

        this.historial = this.historial.slice(0, this.indice + 1);
        this.historial.push(this.ticket.innerHTML);
        this.indice++;
    },


    undo() {

        if (this.indice > 0) {
            this.indice--;
            this.ticket.innerHTML = this.historial[this.indice];
            this.mostrarMensaje("↩️ Cambios deshechos");
        }
    },


    redo() {

        if (this.indice < this.historial.length - 1) {
            this.indice++;
            this.ticket.innerHTML = this.historial[this.indice];
            this.mostrarMensaje("↪️ Cambios rehechos");
        }
    },


    /* ======================================================
       EDICIÓN
    ====================================================== */
    activarEdicion() {

        const editando = this.contenido.contentEditable === "true";

        this.contenido.contentEditable = !editando;

        const btn = document.getElementById("btnEditar");

        if (btn) {
            btn.textContent = !editando
                ? "✅ Finalizar Edición"
                : "📝 Editar Ticket";
        }

        if (editando) this.guardarEstado();

        this.mostrarMensaje(
            !editando ? "✍️ Modo edición activo" : "✅ Cambios guardados"
        );
    },


    /* ======================================================
       IMPRIMIR
    ====================================================== */
    imprimir() {

        if (this.contenido?.contentEditable === "true")
            this.activarEdicion();

        this.mostrarMensaje("🖨️ Imprimiendo...");

        setTimeout(() => window.print(), 400);
    },


    /* ======================================================
       PDF
    ====================================================== */
    async guardarTicketPDF() {

        const { jsPDF } = window.jspdf;

        try {

            this.mostrarMensaje("⏳ Generando PDF...");

            await this.forzarCargaImagenes();
            await this.prepararImagenes();

            const canvas = await html2canvas(this.ticket, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#fff"
            });

            const imgData = canvas.toDataURL("image/png");

            const width = 80;
            const height = (canvas.height * width) / canvas.width;

            const pdf = new jsPDF("p", "mm", [width, height]);

            pdf.addImage(imgData, "PNG", 0, 0, width, height);

            pdf.save(`Ticket_${Date.now()}.pdf`);

            this.mostrarMensaje("📄 PDF generado");

        } catch (e) {

            console.error(e);
            this.mostrarMensaje("❌ Error PDF");
        }
    },


    /* ======================================================
       PRODUCTOS
    ====================================================== */
    recargarProductos() {

        this.mostrarMensaje("🔍 Buscando venta...");

        fetch("producto.json")
            .then(r => r.json())
            .then(data => {

                const tbody = document.getElementById("tbodyProductos");

                tbody.innerHTML = "";

                let total = 0;

                data.forEach(p => {

                    const sub = p.cantidad * p.precio;
                    total += sub;

                    tbody.innerHTML += `
                        <tr>
                            <td>${p.nombre}</td>
                            <td>${p.cantidad}</td>
                            <td>$${p.precio.toFixed(2)}</td>
                            <td>$${sub.toFixed(2)}</td>
                        </tr>`;
                });

                document.getElementById("total").textContent =
                    `Total: $${total.toFixed(2)}`;

                this.guardarEstado();

                this.mostrarMensaje("🛒 Venta importada");
            })
            .catch(() =>
                this.mostrarMensaje("❌ Venta no importada")
            );
    }
};


/* ======================================================
   INIT
====================================================== */
document.addEventListener("DOMContentLoaded", () => cticket.loadView());


/* ======================================================
   GLOBAL
====================================================== */
window.imprimir = () => cticket.imprimir();
window.undo = () => cticket.undo();
window.redo = () => cticket.redo();
window.activarEdicion = () => cticket.activarEdicion();
window.guardarTicketPDF = () => cticket.guardarTicketPDF();
window.recargarProductos = () => cticket.recargarProductos();

export default cticket;
