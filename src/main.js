import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import trebeca from './js/trebeca.js';
import renderView from './js/views.js';
import '@fortawesome/fontawesome-free/css/all.css'

// Configuración de Axios para futuras peticiones al backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log(renderView);

