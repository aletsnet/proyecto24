import sqlite from "../sqlite";

const validateForm = (formId) => {
    const form = document.getElementById(formId);
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const role = form.role.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const terms = form.terms.checked;

    // Validar campos vacíos
    if (!username || !email || !role || !password || !confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos del formulario.'
        });
        return false;
    }

    // Validar nombre de usuario
    if (username.length < 3) {
        Swal.fire({
            icon: 'warning',
            title: 'Nombre de usuario inválido',
            text: 'El nombre de usuario debe tener al menos 3 caracteres'
        });
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'warning',
            title: 'Correo electrónico inválido',
            text: 'Por favor, ingresa un correo electrónico válido'
        });
        return false;
    }

    // Validar contraseña
    if (password.length < 8) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña inválida',
            text: 'La contraseña debe tener al menos 8 caracteres'
        });
        return false;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseñas no coinciden',
            text: 'La contraseña y la confirmación de la contraseña no coinciden'
        });
        return false;
    }

    // Validar términos y condiciones
    if (!terms) {
        Swal.fire({
            icon: 'warning',
            title: 'Términos y condiciones',
            text: 'Debes aceptar los términos y condiciones'
        });
        return false;
    }

    return true;
};

const create = async (formId) => {
    // Validar formulario antes de guardar
    if (!validateForm(formId)) {
        return;
    }

    const form = document.getElementById(formId);
    const data = {
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value,
        role: form.role.value.trim()
    };

    try {
        // Aquí implementas la lógica para guardar en la base de datos
        // Por ejemplo:
        await sqlite.execute("INSERT INTO users (name, email, password, rol) VALUES (?, ?, ?, ?)", 
            [data.username, data.email, data.password, data.role]);
        
        //crear en el storage local datos del usuario
        let user = await sqlite.query("SELECT id FROM users WHERE email = ?", [data.email]);
        id_user = user[0].id;
        localStorage.removeItem('user_id');
        localStorage.removeItem('name');
        localStorage.setItem("id_user", id_user);
        localStorage.setItem("name", data.username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);

        Swal.fire({
            icon: 'success',
            title: 'Usuario registrado',
            text: 'Usuario registrado exitosamente'
        });
        form.reset();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al registrar usuario: ' + error
        });
    }
};

const save = async (formId) => {
    // Implementar la lógica para guardar un nuevo usuario
    const form = document.getElementById(formId);
    const data = {
        username: form.username.value,
        password: form.password.value,
        role: form.role.value
    };  
}

const viewLoad = async () => {
    const roles = await sqlite.query("SELECT * FROM roles", []);
    let roleSelect = document.getElementById("role");
    for(let role of roles) {
        let option = document.createElement("option");
        option.value = role.id;
        option.text = role.rol;
        roleSelect.add(option);
    }
}

export default {
    viewLoad,
    save,
    create,
    validateForm
}