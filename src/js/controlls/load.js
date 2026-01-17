const checkRegister =  async () => {
    //valida la base de datos}
    console.log("Inia validacion");
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
        window.renderView('modalCuerpo', 'view/login');
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

export default {
    checkRegister
}