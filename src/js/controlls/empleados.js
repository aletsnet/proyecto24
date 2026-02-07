import trebeca from "../trebeca";

let data = [
    { id: "001", name: "Manuel Ramirez", email: "manuel@empresa.com", role: "Administrador", active: true },
    { id: "002", name: "Abel", email: "abel@empresa.com", role: "Repartidor", active: true },
    { id: "003", name: "Alejandro", email: "alejandro@empresa.com", role: "Cajero", active: false },
    { id: "004", name: "Leonel Ramirez", email: "leonel@empresa.com", role: "Bodeguero", active: true }
];

   let config = {
    search: {
        value: '',
        fields: ["name", "email"],
        buttons: [
            {
                label: '<i class="fas fa-search"></i> Buscar',
                class: 'btn btn-primary btn-sm me-1',
                function: () => console.log('Buscar')
            }
        ]
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
    buttons: [
        { name: "edit", label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning btn-sm me-1', modo: "row" },
        { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
        { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" }
    ],
    tableClass: 'tablaEmpleados'
};

    // 1. Datos iniciales
    const empleadosGuardados = JSON.parse(localStorage.getItem('data'));
if (empleadosGuardados) {
    data.splice(0, data.length, ...empleadosGuardados);
}


            const puestosDisponibles = ["Administrador", "Repartidor", "Cajero", "Bodeguero"];
    

    // 2. Función para renderizar la tabla
  function cargarTabla() {
    trebeca(config, data);
}

function guardarCambios() {
    localStorage.setItem('empleados', JSON.stringify(data));
    console.table(data);
}





    // 3. Función para actualizar el array en memoria
   function actualizarDato(index, propiedad, valor) {
    if (propiedad === 'active') {
        data[index][propiedad] = (valor === true || valor === 'true');
    } else {
        data[index][propiedad] = valor;
    }

    console.log(`Actualizado: ${data[index].name} → ${propiedad}: ${valor}`);
    cargarTabla();
}



    // Inicializar tabla al cargar la página
   const loadView = () => {
    cargarTabla();
};

export default {
    loadView,
    guardarCambios,
    cargarTabla,
    actualizarDato,


};
