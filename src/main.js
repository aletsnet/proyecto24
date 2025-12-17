import axios from 'axios';
import conectarBD from './conexion.js';
// Configuración de Axios para futuras peticiones al backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
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
    showMessage('Por favor, complete todos los campos', 'danger');
    return;
  }

  try {
    showMessage('Iniciando sesión...', 'info');

    const response = await authenticateUser(username, password);

    if (response.success) {
      showMessage('¡Inicio de sesión exitoso!', 'success');

      if (rememberCheckbox?.checked) {
        localStorage.setItem('remember_user', username);
      }

      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));

      setTimeout(() => {
        loadMainApplication();
      }, 1000);
    } else {
      showMessage('Usuario o contraseña incorrectos', 'danger');
    }
  } catch (error) {
    console.error('Error en el login:', error);
    showMessage('Error al conectar con el servidor', 'danger');
  }
}

// Autenticación simulada
async function authenticateUser(username, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username && password) {
        resolve({
          success: true,
          token: 'fake-jwt-token-' + Date.now(),
          user: {
            id: 1,
            username: username,
            name: 'Usuario Demo'
          }
        });
      } else {
        resolve({
          success: false,
          token: '',
          user: null
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
    const userDataStr = localStorage.getItem('user_data');
    let userName = 'Usuario';

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        userName = userData.name || userData.username || 'Usuario';
      } catch (e) {
        console.error('Error parsing user data:', e);
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

  const rememberedUser = localStorage.getItem('remember_user');
  if (rememberedUser && usernameInput) {
    usernameInput.value = rememberedUser;
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
  }

  const loginForm = document.querySelector("#login-form");
  loginForm?.addEventListener("submit", handleLogin);
});

//Conexion a la base de datos
conectarBD();
