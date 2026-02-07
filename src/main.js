import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import trebeca from './js/trebeca.js';
import renderView from './js/views.js';
import sqlite from './js/sqlite.js';
import '@fortawesome/fontawesome-free/css/all.css'
import '../src/css/ticket.css';

//controlles
import cempleados from './js/controlls/empleados.js';
import cdatabase from './js/controlls/database.js';
import cterminal from './js/controlls/terminal.js';
import cventas from './js/controlls/ventas.js';
import cload from './js/controlls/load.js';
import cusers from './js/controlls/users.js';
import cinventarios from './js/controlls/inventarios.js';
import ccategorias from './js/controlls/categorias.js';
import clogin from './js/controlls/login.js';
import cticket from './js/controlls/ticket.js';
import cproductos from './js/controlls/productos.js';
import ccortes from './js/controlls/cortes.js';

 // Exponer funciones para botones HTML
    window.undo = () => cticket.undo();
    window.redo = () => cticket.redo();
    window.activarEdicion = () => cticket.activarEdicion();
    window.imprimir = () => cticket.imprimir();
    window.guardarTicketPDF = () => cticket.guardarTicketPDF();


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
window.cventas = cventas;
window.cinventarios = cinventarios;
window.cticket = cticket;
window.api = api;
window.cempleados = cempleados;
window.cload = cload;
window.cusers = cusers;
window.ccategorias = ccategorias;
window.clogin = clogin;
window.cproductos = cproductos;
window.ccortes = ccortes;

//Checa si hay un usuario registrado
await cload.checkRegister();
await cload.checkSeccion();
//await cload.abrirCaja();


// Cargar la vista inicial
window.renderView('app', 'view/home');