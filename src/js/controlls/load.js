import Swal from "sweetalert2";

const checkRegister =  async () => {
    //valida si en el storage local hay un usuario registrado
    let name = localStorage.getItem("name");
    if(name){
        checkSeccion();
        return;
    }else{
        //valida la base de datos}
        console.log("Inicia validacion");
        await sqlite.checkModel();
        await sqlite.checkDate();
        // Verificar si el usuario ya está registrado en la base de datos
        console.log("Inicia validacion usuarios");
        const data = await window.sqlite.query("SELECT * FROM users", []);

        if (data.length === 0) {
            // Si no hay usuarios registrados, cargar la vista de registro
            window.renderView('modalCuerpo', 'view/users/register', () => { cusers.viewLoad(); });
            
        } else {
            // Si hay usuarios registrados, cargar la vista de login
            window.renderView('modalCuerpo', 'view/users/login', () => { cusers.viewLoad(); });
        }

        // Abrir el modal
        const modal = document.createElement('button');
        modal.setAttribute('type', 'button');
        modal.setAttribute('data-bs-toggle', 'modal');
        modal.setAttribute('data-bs-target', '#standardModal');
        document.body.appendChild(modal);
        modal.click();

        console.log("validacion Completada");
    }
}

const checkSeccion = async () => {
    let user_id = localStorage.getItem("user_id");
    if(!user_id){
        // Si no hay usuario en el storage, cargar la vista de login
        window.renderView('modalCuerpo', 'view/users/login', () => { clogin.viewLoad(); });
        // Abrir el modal
        const modal = document.createElement('button');
        modal.setAttribute('type', 'button');
        modal.setAttribute('data-bs-toggle', 'modal');
        modal.setAttribute('data-bs-target', '#standardModal');
        document.body.appendChild(modal);
        modal.click();
    }else{
        // Si hay usuario en el storage, cargar la vista principal
        try{
            let user = await sqlite.query("SELECT * FROM users WHERE id = ?", [user_id]);
            if(user.length == 0){
                //limpiar storage
                localStorage.removeItem('user_id');
                localStorage.removeItem('name');
                //volver a checar registro
                await checkRegister();
                
            }else{
                await cload.abrirCaja();
            }
        }catch(error){
            console.error("Error al verificar el usuario:", error);
            /*localStorage.removeItem('user_id');
            localStorage.removeItem('name');
            await checkRegister();*/
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al verificar el usuario: ' + error
            });
        }
    }
}

async function abrirCaja() {
    const corteActivo = localStorage.getItem("corte_activo");
    if (corteActivo) {
        //Swal.fire('Caja ya abierta', 'Ya hay un corte activo', 'warning');
        return;
    }else{
        //valida que exista un corte activo
        const corteActivo = await sqlite.query("SELECT * FROM cortes WHERE status = 101", []);
        console.log(corteActivo);
        
        if(corteActivo.length == 0){
            // Si no hay corte activo, abrir uno nuevo
            Swal.fire({
                title: 'No hay corte activo',
                text: 'Inicio de caja',
                icon: 'question',
                confirmButtonText: 'Iniciar',
                showCancelButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                input: 'text',
                inputPlaceholder: 'Ingrese el monto inicial de caja',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const montoInicial = parseFloat(result.value);
                    if (isNaN(montoInicial) || montoInicial < 0) {
                        Swal.fire('Monto inválido', 'Por favor ingrese un monto válido', 'error');
                        return;
                    }
                    const res = await sqlite.insert("cortes", {
                        sucursal: 1,
                        user: localStorage.getItem('user_id'),
                        fechainicio: new Date().toISOString(),
                        fechafinal: new Date().toISOString(),
                        status: 101,
                        caja: 0.00,
                        inicio: montoInicial,
                        venta: 0.00,
                        diferencia: 0.00,
                        adepositar: 0.00,
                        mermas: 0.00,
                        gasto: 0.00,
                        efectivo: 0.00,
                        trasferencia: 0.00,
                        tarjeta: 0.00,
                        otros: 0.00
                    });
                    localStorage.setItem("corte_activo", res.lastInsertId);
                    //Swal.fire('Caja abierta', 'Corte iniciado correctamente', 'success');
                    //loadView();
                }
            });

        }
    }
}

export default {
    checkRegister,
    checkSeccion,
    abrirCaja
}