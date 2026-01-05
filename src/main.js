import axios from "axios";
import { initInventario } from "./inventario.js";
import { eraseElement } from "./inventario.js";
import {editElement } from "./inventario.js"
import {addElement} from "./inventario.js"
import { trebeca } from "./trebeca.js";
import { loadLibs } from "./load.js";
// Configuración de Axios para futuras peticiones al backend
function getCellValue(row, field) {
    const cell = row.querySelector(`[data-field="${field}"]`);
    if (!cell) return null;

    const input = cell.querySelector('input');
    return input ? input.value : cell.textContent.trim();
}

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Elementos del formulario
let usernameInput = null;
let passwordInput = null;
let rememberCheckbox = null;
let loginMessage = null;

// Función de login
async function handleLogin(event) {
  event.preventDefault();

  if (!usernameInput || !passwordInput || !loginMessage) {
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showMessage("Por favor, complete todos los campos", "danger");
    return;
  }

  try {
    showMessage("Iniciando sesión...", "info");

    const response = await authenticateUser(username, password);

    if (response.success) {
      showMessage("¡Inicio de sesión exitoso!", "success");

      if (rememberCheckbox?.checked) {
        localStorage.setItem("remember_user", username);
      }

      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.user));

      setTimeout(() => {
        loadMainApplication();
      }, 1000);
    } else {
      showMessage("Usuario o contraseña incorrectos", "danger");
    }
  } catch (error) {
    console.error("Error en el login:", error);
    showMessage("Error al conectar con el servidor", "danger");
  }
}

// Autenticación simulada
async function authenticateUser(username, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username && password) {
        resolve({
          success: true,
          token: "fake-jwt-token-" + Date.now(),
          user: {
            id: 1,
            username: username,
            name: "Usuario Demo",
          },
        });
      } else {
        resolve({
          success: false,
          token: "",
          user: null,
        });
      }
    }, 1000);
  });
}

// Mostrar mensajes
function showMessage(message, type) {
  if (loginMessage) {
    loginMessage.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }
}

// Cargar app principal
function loadMainApplication() {
  if (loginMessage) {
    const userDataStr = localStorage.getItem("user_data");
    let userName = "Usuario";

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        userName = userData.name || userData.username || "Usuario";
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    loginMessage.innerHTML = `
      <div class="alert alert-success" role="alert">
        <h4 class="alert-heading">¡Bienvenido!</h4>
        <p>La aplicación principal se cargará aquí...</p>
        <hr>
        <p class="mb-0">Usuario: ${userName}</p>
      </div>
    `;
  }
}

// Inicialización
window.addEventListener("DOMContentLoaded", () => {
  usernameInput = document.querySelector("#username");
  passwordInput = document.querySelector("#password");
  rememberCheckbox = document.querySelector("#remember");
  loginMessage = document.querySelector("#login-message");

  const rememberedUser = localStorage.getItem("remember_user");
  if (rememberedUser && usernameInput) {
    usernameInput.value = rememberedUser;
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
  }

  const loginForm = document.querySelector("#login-form");
  loginForm?.addEventListener("submit", handleLogin);
});

const btnInventario = document.getElementById("btn-inventario");

async function cargarInventario() {
  await loadLibs();
  const loginView = document.getElementById("login-view");
  const appView = document.getElementById("app-view");

  const res = await fetch("./tabla.html");
  const html = await res.text();

  appView.innerHTML = html;

  loginView.classList.add("d-none");
  appView.classList.remove("d-none");
  //const data = initInventario();
  let data = [
    { id: 1, name: "Ana", price: 28 },
    { id: 2, name: "Juana", price: 34 },
    { id: 3, name: "Laura", price: 25 },
  ];
  console.log("data1: ", data);

  data = await initInventario();
  console.log("data2: ", data);
  const config_default = {
    search: {
      value: "",
      fields: ["id", "Nombre", "Precio"],
    },
    table: {
      cols: [
        { label: "ID", field: "id", type: "number" },
        { label: "Nombre", field: "Nombre", type: "text" },
        { label: "Precio", field: "Precio", type: "money", min: 0 },

        {
          label: "*",
          field: "actions",
          type: "button",
          buttons: ["add", "edit", "delete", "save"],
        },
      ],
      footer: {
        label: "Total de registros:",
        field: "count",
        type: "text",
      },
    },
    tableClass: "miTabla",
    buttons: [
      {
        name: "add",
        label: '<i class="fas fa-plus"></i>',
        class: "btn btn-success btn-sm me-1",
        modo: "new",
      },
      {
        name: "edit",
        label: '<i class="fas fa-edit"></i>',
        class: "btn btn-warning btn-sm me-1",
        modo: "row",
      },
      {
        name: "delete",
        label: '<i class="fas fa-trash"></i>',
        class: "btn btn-danger btn-sm me-1",
        modo: "row",
      },
      {
        name: "save",
        label: '<i class="fas fa-save"></i>',
        class: "btn btn-success btn-sm me-1",
        modo: "row",
      },
      {
        name: "btn_extra",
        label: '<i class="fas fa-info-circle"></i>',
        class: "btn btn-info btn-sm m-1",
        modo: "row_extra",
        function: (event) => {
          other_function(event);
        },
      },
      {
        name: "btn_extra",
        label: '<i class="fas fa-cube"></i>',
        class: "btn btn-info btn-sm m-1",
        modo: "row_extra",
        property: {
          "data-bs-toggle": "modal",
          "data-bs-target": "#personModal",
        },
        function: (event) => {
          modal_function(event);
        },
      },
    ],
    // Usando referencias a funciones (más seguro que eval)
    add: (event) => {
      btn_add(event);
    },
    edit: (event) => {
      btn_edit(event);
    },
    delete: (event) => {
      btn_delete(event);
    },
    save: (event) => {
      btn_save(event);
    },
  };

  const btn_add = () => {
    console.log("Agregar nuevo registro");
  };

  const btn_edit = (event) => {
    // event.target puede ser el <i>, así que usamos closest para subir al botón
    const button = event.target.closest("button");
    if (!button) return;

    // buscamos el tr padre
    const row = button.closest("tr");
    if (!row) return;

    // obtenemos el id del atributo data-id
    const id = row.dataset.id;
    if (!id) {
      console.error("No se pudo obtener el id del registro");
      return;
    }

    console.log("Editar registro id:", id);
  };

  const btn_delete = (event) => {
    // event.target puede ser el <i>, así que usamos closest para subir al botón
    const button = event.target.closest("button");
    if (!button) return;

    // buscamos el tr padre
    const row = button.closest("tr");
    if (!row) return;

    // obtenemos el id del atributo data-id
    const id = row.dataset.id;
    if (!id) {
      console.error("No se pudo obtener el id del registro");
      return;
    }

    eraseElement(id);

    console.log("Eliminar registro id:", id);
    cargarInventario();
  };

  const btn_save = (event) => {
    const button = event.target.closest('button');
    const row = button.closest('tr');
    const id = row.dataset.id;
    let nuevoID = getCellValue(row,'id');
    let nombre = getCellValue(row, "Nombre");
    let precio = getCellValue(row, "Precio");
    //console.log("Precio obtenido: ",precio);
    precio=Number(precio.slice(1,-1));
    //Mandar objeto en vez de mandar uno por uno
    if (row.querySelector('[data-id="_new"]') !== null) {
        // INSERT
        console.log("NUEVO ID: ",nuevoID);
        addElement(nuevoID,nombre,precio);
        console.log("Producto agregado");
        
    } else {
        // UPDATE
        editElement(id,nuevoID,nombre,precio);
        console.log("Producto actualizado:", id);
        
    }
    //const nombre = row.querySelector('[data-field="Nombre"] input').value;
    //const precio = row.querySelector('[data-field="Precio"] input').value;
    
    console.log("Guardar registro id:", nuevoID);
    cargarInventario();
    
  };

  const modal_function = (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const row = button.closest("tr");
    if (!row) return;

    const id = row.dataset.id;
    console.log("Función modal para registro id:", id);
  };

  trebeca(config_default, data);
  //await initInventario();
}

btnInventario.addEventListener("click", () => {
  cargarInventario();
});
