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
        alert('Por favor, completa todos los campos');
        return false;
    }

    // Validar nombre de usuario
    if (username.length < 3) {
        alert('El nombre de usuario debe tener al menos 3 caracteres');
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido');
        return false;
    }

    // Validar contraseña
    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return false;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return false;
    }

    // Validar términos y condiciones
    if (!terms) {
        alert('Debes aceptar los términos y condiciones');
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
        // await sqlite.execute("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", 
        //     [data.username, data.email, data.password, data.role]);
        
        alert('Usuario registrado exitosamente');
        form.reset();
    } catch (error) {
        alert('Error al registrar usuario: ' + error.message);
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

const viewLoad = () => {
    const roles = sqlite.query("SELECT * FROM roles", []);
    let roleSelect = document.getElementById("role");
}

export default {
    viewLoad,
    save,
    create,
    validateForm
}