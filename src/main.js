import axios from 'axios';
import Swal from 'sweetalert2';
import trebeca from './js/trebeca.js';
import view from './js/views.js';

// Configuración de Axios para futuras peticiones al backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});


