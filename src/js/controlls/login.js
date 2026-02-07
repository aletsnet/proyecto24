import sqlite from "../sqlite";

const template = document.createElement('modalCuerpo');

const loadlogin = async () => {
    //valida si en el storage local hay un usuario registrado
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const row = await sqlite.query("SELECT * FROM users WHERE email = ? AND password = ?", [emailInput.value.trim(), passwordInput.value])
    
    if(row.length > 0){
        //crear en el storage local datos del usuario
        localStorage.setItem("user_id", row[0].id);
        localStorage.setItem("name", row[0].name);
        localStorage.setItem("email", row[0].email);
        localStorage.setItem("role", row[0].rol);
        //cerrar modal
        const modalCloseBtn = document.querySelector('#standardModal .btn-close');
        if(modalCloseBtn){
            modalCloseBtn.click();
        }
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.'
        });
    }

}

const viewLoad = async () => {
    // Implementar la lógica para cargar la vista de login
    const emailInput = document.getElementById("email");
    let email = localStorage.getItem("email");
    if(email){
        emailInput.value = email;
    }
    console.log("email:", emailInput.value);
    
}

export default {
    loadlogin,
    viewLoad
}