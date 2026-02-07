import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import trebeca from './js/trebeca.js';
import renderView from './js/views.js';
import sqlite from './js/sqlite.js';
import '@fortawesome/fontawesome-free/css/all.css'
import '../src/css/ticket.css';

//controlles
import cdatabase from './js/controlls/database.js';
import cempleados from './js/controlls/empleados.js';
//import home from './js/controlls/home.js';

// Configuración de Axios para futuras peticiones al backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

window.Swal = Swal;
window.trebeca = trebeca;
window.renderView = renderView;
window.sqlite = sqlite;
window.cdatabase = cdatabase;
window.cterminal = cterminal;
window.cinventarios = cinventarios;
window.cticket=cticket;
window.cusers = cusers;
window.cload = cload;
window.cticket = cticket;
window.cterminal = cterminal;
window.api = api;
window.cempleados = cempleados;


//Check database connection
//cdatabase.checkDB();
window.cload = cload;
window.cusers = cusers;
window.ccategorias = ccategorias;
window.clogin = clogin;
window.cticket = cticket;
window.cproductos = cproductos;
window.api = api;
//Checa si hay un usuario registrado
await cload.checkRegister();

window.cempleados = cempleados;

// Cargar la vista inicial
window.renderView('app', 'view/home');