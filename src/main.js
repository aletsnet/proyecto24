import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import trebeca from './js/trebeca.js';
import renderView from './js/views.js';
import sqlite from './js/sqlite.js';
import '@fortawesome/fontawesome-free/css/all.css'

//controlles
import cempleados from './js/controlls/empleados.js';
import cdatabase from './js/controlls/database.js';
import cterminal from './js/controlls/terminal.js';
import cload from './js/controlls/load.js';
import cusers from './js/controlls/users.js';
import cinventarios from './js/controlls/inventarios.js';

import cticket from './js/controlls/ticket.js'
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
window.cinventarios = cinventarios;
window.cusers = cusers;
window.cload = cload;
window.cticket = cticket;
window.cterminal = cterminal;
window.api = api;
window.cempleados = cempleados;


//Check database connection
//cdatabase.checkDB();


// Cargar la vista inicial
window.renderView('app', 'view/home');