import trebeca from "../trebeca";

// =====================
// Datos iniciales
// =====================
let data = [
    { id: "001", name: "Manuel Ramirez", email: "manuel@empresa.com", role: "Administrador", active: true },
    { id: "002", name: "Abel", email: "abel@empresa.com", role: "Cajero", active: true },
    { id: "003", name: "Alejandro", email: "alejandro@empresa.com", role: "Cajero", active: false },
    { id: "004", name: "Leonel Ramirez", email: "leonel@empresa.com", role: "Bodeguero", active: true }
];

// =====================
// Configuración Trebeca
// =====================
let config = {
    search: {
        value: '',
        fields: ["name", "email"]
    },
    table: {
        cols: [
            { label: 'Nombre', field: 'name', type: 'text' },
            { label: 'Email', field: 'email', type: 'text' },
            { label: 'Rol', field: 'role', type: 'text' },
            { label: 'Activo', field: 'active', type: 'boolean' },
            { label: '*', field: 'actions', type: 'button', buttons: ["edit", "delete", "save"] }
        ]
    },
    tableClass: 'tablaEmpleados'
};

// =====================
// Cargar desde localStorage
// =====================
const empleadosGuardados = JSON.parse(localStorage.getItem('empleados'));
if (empleadosGuardados) {
    data.splice(0, data.length, ...empleadosGuardados);
}

// =====================
// Renderizar tabla
// =====================
function cargarTabla() {
    trebeca(config, data);
}

// =====================
// Guardar cambios
// =====================
function guardarCambios() {
    localStorage.setItem('empleados', JSON.stringify(data));
}

// =====================
// Actualizar dato
// =====================
function actualizarDato(index, propiedad, valor) {
    data[index][propiedad] =
        propiedad === 'active'
            ? (valor === true || valor === 'true')
            : valor;

    cargarTabla();
}

// =====================
// Agregar empleado
// =====================
function agregarEmpleado() {
    data.push({
        id: Date.now().toString(),
        name: "Nuevo empleado",
        email: "correo@empresa.com",
        role: "Cajero",
        active: true
    });

    guardarCambios();
    cargarTabla();
}

// =====================
// Inicializar vista
// =====================
const loadView = () => {
    const btnAgregar = document.getElementById('btnAgregar');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', agregarEmpleado);
    } else {
        console.warn('No se encontró el botón #btnAgregar');
    }

    cargarTabla();
};

// =====================
// Export
// =====================
export default {
    loadView,
    guardarCambios,
    cargarTabla,
    actualizarDato,
    agregarEmpleado
};
