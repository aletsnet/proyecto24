import trebeca from "../trebeca";

    let data = [
                { id: "001", nombre: "Manuel Ramirez", puesto: "Administrador", activo: true },
                { id: "002", nombre: "Abel", puesto: "Repartidor", activo: true },
                { id: "003", nombre: "Alejandro", puesto: "Cajero", activo: false },
                { id: "004", nombre: "Leonel Ramirez", puesto: "Bodeguero", activo: true }
            ];
    let config = {
            search: {
                value: '',
                fields: ["name", "email"],
                buttons: [
                    { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                ]
            },
            table: {
                cols: [
                    {label: 'Nombre', field: 'name', type : 'text'},
                    {label: 'Email', field: 'email', type : 'text'},
                    {label: 'Rol', field: 'role', type : 'text'},
                    {label: 'Activo', field: 'active', type : 'boolean'},
                    {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save"]}
                ]
            },
            buttons: [
                { name: "add", label: '<i class="fas fa-plus"></i>', class: 'btn btn-success btn-sm me-1', modo: "new"  },
                { name: "edit", label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning btn-sm me-1', modo: "row" },
                { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
                { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" },
            ],
            tableClass: 'tablaEmpleados',
        };
    // 1. Datos iniciales
    const empleadosGuardados = JSON.parse(localStorage.getItem('empleados'));
        if (empleadosGuardados) {
            empleados.splice(0, empleados.length, ...empleadosGuardados);
        }  [
                { id: "001", nombre: "Manuel Ramirez", puesto: "Administrador", activo: true },
                { id: "002", nombre: "Abel", puesto: "Repartidor", activo: true },
                { id: "003", nombre: "Alejandro", puesto: "Cajero", activo: false },
                { id: "004", nombre: "Leonel Ramirez", puesto: "Bodeguero", activo: true }
            ];

            const puestosDisponibles = ["Administrador", "Repartidor", "Cajero", "Bodeguero"];
    

    // 2. Función para renderizar la tabla
    function cargarTabla() {
        trebeca(config, data);
        /*const tbody = document.getElementById('cuerpoTabla');
        tbody.innerHTML = '';

        empleados.forEach((emp, index) => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.nombre}</td>
                <td>
                    <select onchange="actualizarDato(${index}, 'puesto', this.value)">
                        ${puestosDisponibles.map(p => `<option value="${p}" ${p === emp.puesto ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </td>
                <td>
                    <select onchange="actualizarDato(${index}, 'activo', this.value)" class="${emp.activo ? 'status-active' : 'status-inactive'}">
                        <option value="true" ${emp.activo ? 'selected' : ''}>Activo</option>
                        <option value="false" ${!emp.activo ? 'selected' : ''}>Inactivo</option>
                    </select>
                </td>
            `;
            tbody.appendChild(fila);
        });*/
    }

    // 3. Función para actualizar el array en memoria
    function actualizarDato(index, propiedad, valor) {
        if (propiedad === 'activo') {
            empleados[index][propiedad] = (valor === 'true');
        } else {
            empleados[index][propiedad] = valor;
        }
        console.log(`Actualizado: ${empleados[index].nombre} ahora es ${propiedad}: ${valor}`);
        // Recargamos para actualizar colores de estado
        cargarTabla();
    }

    function guardarCambios() {
        
        localStorage.setItem('empleados', JSON.stringify(empleados));
        document.getElementById('mensajeGuardado').textContent = "✅ Cambios guardados con exito";
        console.table(empleados);
        
    }

    // Inicializar tabla al cargar la página
    const loadView = () => {
        cargarTabla();
    }

    export default {
        loadView,
        guardarCambios,
        actualizarDato,
        cargarTabla,
    }