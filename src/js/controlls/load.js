const checkRegister =  async () => {
    // Verificar si el usuario ya está registrado en la base de datos
    const user = window.sqlite.getUser();
    data = await window.sqlite.query("SELECT * FROM users WHERE deleted_at IS NULL", []);
    if (data.length === 0) {
        // Si no hay usuarios registrados, cargar la vista de registro
        window.renderView('modalCuerpo', 'view/users/register');
    } else {
        // Si hay usuarios registrados, cargar la vista de login
        window.renderView('app', 'view/login');
    }
}