import axios from 'axios';

// Configuración de Axios para futuras peticiones al backend
// @ts-ignore - api será usado cuando se implemente el backend real
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambiar según el backend
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Elementos del formulario
let usernameInput: HTMLInputElement | null;
let passwordInput: HTMLInputElement | null;
let rememberCheckbox: HTMLInputElement | null;
let loginMessage: HTMLElement | null;

// Función de login
async function handleLogin(event: Event) {
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
    // Mostrar indicador de carga
    showMessage('Iniciando sesión...', 'info');
    
    // Aquí se haría la petición real al backend
    // Por ahora, simularemos la autenticación
    const response = await authenticateUser(username, password);
    
    if (response.success) {
      showMessage('¡Inicio de sesión exitoso!', 'success');
      
      // Guardar sesión si se marcó "Recordar"
      if (rememberCheckbox?.checked) {
        localStorage.setItem('remember_user', username);
      }
      
      // Guardar token o datos de sesión
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      // Redirigir o cargar la aplicación principal después de 1 segundo
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

// Función para autenticar usuario (simulada o real con axios)
async function authenticateUser(username: string, password: string) {
  // Opción 1: Autenticación simulada (para desarrollo)
  // Eliminar esto cuando se tenga un backend real
  return new Promise<{ success: boolean; token: string; user: any }>((resolve) => {
    setTimeout(() => {
      // Simulación: acepta cualquier usuario con contraseña no vacía
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

  // Opción 2: Autenticación real con axios (descomentar cuando se tenga backend)
  /*
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    
    return {
      success: true,
      token: response.data.token,
      user: response.data.user
    };
  } catch (error) {
    return {
      success: false,
      token: '',
      user: null
    };
  }
  */
}

// Función para mostrar mensajes
function showMessage(message: string, type: 'success' | 'danger' | 'info' | 'warning') {
  if (loginMessage) {
    loginMessage.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }
}

// Función para cargar la aplicación principal
function loadMainApplication() {
  if (loginMessage) {
    loginMessage.innerHTML = `
      <div class="alert alert-success" role="alert">
        <h4 class="alert-heading">¡Bienvenido!</h4>
        <p>La aplicación principal se cargará aquí...</p>
        <hr>
        <p class="mb-0">Usuario: ${localStorage.getItem('user_data')}</p>
      </div>
    `;
  }
  
  // Aquí se cargaría la interfaz principal de la aplicación
  // Por ejemplo, ocultar el login y mostrar el dashboard
}

// Inicialización cuando el DOM está listo
window.addEventListener("DOMContentLoaded", () => {
  usernameInput = document.querySelector("#username");
  passwordInput = document.querySelector("#password");
  rememberCheckbox = document.querySelector("#remember");
  loginMessage = document.querySelector("#login-message");
  
  // Cargar usuario recordado si existe
  const rememberedUser = localStorage.getItem('remember_user');
  if (rememberedUser && usernameInput) {
    usernameInput.value = rememberedUser;
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
  }
  
  // Agregar listener al formulario
  const loginForm = document.querySelector("#login-form");
  loginForm?.addEventListener("submit", handleLogin);
});
