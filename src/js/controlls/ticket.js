const loadView = () => {

  /* ===== FECHA ===== */
  document.getElementById("fecha").textContent =
    new Date().toLocaleString();

  /* ===== VARIABLES ===== */
  let historial = [];
  let indice = -1;
  let restaurando = false;

  const ticket = document.getElementById("ticket");
  let contenido = document.getElementById("contenido");
  let logo = document.getElementById("logo");

  const logoInput = document.getElementById("logoInput");
  const controlesLogo = document.getElementById("controlesLogo");
  const anchoLogo = document.getElementById("anchoLogo");
  const altoLogo = document.getElementById("altoLogo");
  const posicionLogo = document.getElementById("posicionLogo");

  /* ===== HISTORIAL ===== */
  const guardarEstado = () => {
    if (restaurando) return;
    historial = historial.slice(0, indice + 1);
    historial.push(ticket.innerHTML);
    indice++;
  };

  const restaurarReferencias = () => {
    contenido = document.getElementById("contenido");
    logo = document.getElementById("logo");
  };

  /* ===== UNDO / REDO ===== */
  const undo = () => {
    if (indice > 0) {
      restaurando = true;
      indice--;
      ticket.innerHTML = historial[indice];
      restaurarReferencias();
      restaurando = false;
    }
  };

  const redo = () => {
    if (indice < historial.length - 1) {
      restaurando = true;
      indice++;
      ticket.innerHTML = historial[indice];
      restaurarReferencias();
      restaurando = false;
    }
  };

  /* ===== EDICIÓN ===== */
  const activarEdicion = () => {
    contenido.contentEditable = true;
    contenido.addEventListener("input", guardarEstado);
  };

  /* ===== LOGO ===== */
  const abrirLogo = () => {
    controlesLogo.style.display = "flex";
    logoInput.click();
  };

  logoInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      logo.src = reader.result;
      logo.style.display = "block";
      guardarEstado();
    };
    reader.readAsDataURL(file);
  };

  anchoLogo.oninput = () => {
    logo.style.width = anchoLogo.value + "px";
    guardarEstado();
  };

  altoLogo.oninput = () => {
    logo.style.height = altoLogo.value + "px";
    guardarEstado();
  };

  posicionLogo.onchange = () => {
    logo.classList.remove("logo-left", "logo-center", "logo-right");
    if (posicionLogo.value) {
      logo.classList.add("logo-" + posicionLogo.value);
    }
    guardarEstado();
  };

  const guardarLogo = () => {
    controlesLogo.style.display = "none";
    guardarEstado();
  };

  /* ===== PRODUCTOS ===== */
  const agregarProducto = () => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true">Producto</td>
      <td contenteditable="true">1</td>
      <td contenteditable="true">$10</td>
      <td contenteditable="true">$10</td>
    `;
    document.querySelector("#tabla tbody").appendChild(tr);
    guardarEstado();
  };

  /* ===== GUARDAR PDF ===== */
  const guardarTicketFinal = () => {
    const ticketPDF = document.getElementById("ticket");

    const opciones = {
      margin: 5,
      filename: "ticket.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      },
      jsPDF: {
        unit: "mm",
        format: [80, 250], // ticket térmico
        orientation: "portrait"
      }
    };

    html2pdf()
      .set(opciones)
      .from(ticketPDF)
      .save();
  };

  /* ===== IMPRIMIR ===== */
  const imprimir = () => {
    window.print();
  };

  /* ===== INICIALIZACIÓN ===== */
  activarEdicion();
  guardarEstado();

  /* ===== EXPONER FUNCIONES ===== */
  window.undo = undo;
  window.redo = redo;
  window.activarEdicion = activarEdicion;
  window.abrirLogo = abrirLogo;
  window.guardarLogo = guardarLogo;
  window.agregarProducto = agregarProducto;
  window.guardarTicketFinal = guardarTicketFinal;
  window.imprimir = imprimir;
};

export default {
  loadView
};
