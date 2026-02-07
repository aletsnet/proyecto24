const cticket = {

    historial: [],
    indice: -1,
    ticket: null,
    contenido: null,

    loadView() {
        // ===== FECHA =====
        const fecha = document.getElementById("fecha");
        if (fecha) {
            fecha.textContent = new Date().toLocaleString();
        }

        // ===== ELEMENTOS =====
        this.ticket = document.getElementById("ticket");
        this.contenido = document.getElementById("contenido");

        if (!this.ticket || !this.contenido) {
            console.warn("ticket o contenido no encontrados");
            return;
        }

        // ===== HISTORIAL =====
        this.historial = [];
        this.indice = -1;
        this.guardarEstado();

        // ===== EVENTOS =====
        this.contenido.addEventListener("input", () => {
            this.guardarEstado();
        });
    },

    guardarEstado() {
        if (!this.ticket) return;

        this.historial = this.historial.slice(0, this.indice + 1);
        this.historial.push(this.ticket.innerHTML);
        this.indice++;
    },

    undo() {
        if (this.indice > 0) {
            this.indice--;
            this.ticket.innerHTML = this.historial[this.indice];
        }
    },

    redo() {
        if (this.indice < this.historial.length - 1) {
            this.indice++;
            this.ticket.innerHTML = this.historial[this.indice];
        }
    },

    activarEdicion() {
        if (!this.contenido) return;
        this.contenido.contentEditable = true;
        this.contenido.focus();
    },

    desactivarEdicion() {
        if (!this.contenido) return;
        this.contenido.contentEditable = false;
    },

    imprimir() {
        window.print();
    },

    guardarTicketPDF() {
        if (!this.ticket) return;

        html2pdf()
            .set({
                margin: 0,
                filename: "ticket_final.pdf",
                html2canvas: { scale: 3 },
                jsPDF: { unit: "mm", format: [100, 200] }
            })
            .from(this.ticket)
            .save();
    }
};

export default cticket;
// ===== EXPONER FUNCIONES AL HTML =====
window.guardarTicketPDF = () => cticket.guardarTicketPDF();
window.imprimir = () => cticket.imprimir();
window.activarEdicion = () => cticket.activarEdicion();
window.undo = () => cticket.undo();
window.redo = () => cticket.redo();
