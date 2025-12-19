//funcion que renderiza las vistas
const renderView = async (dom, page) => {
    const app = document.getElementById(dom);
    app.innerHTML = ''; // Limpiar el contenido previo
    let viewContent = '';
    
    await fetch('/src/' + page + '.html')
        .then(response => response.text())
        .then(html => {
            app.innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar la vista:', error);
            app.innerHTML = '<h1>Error al cargar la vista</h1>';
        });
            
    app.innerHTML = viewContent;
}

export default renderView;