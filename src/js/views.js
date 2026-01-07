//funcion que renderiza las vistas
const renderView = async (dom, page) => {
    const app = document.getElementById(dom);
    app.innerHTML = '<b>Loading...</b>'; // Limpiar el contenido previo
    let viewContent = '';
    
    await fetch('/src/' + page + '.html')
        .then(
            response => {
                let data = {};
                data = response.text();
                
                return data;
            })
        .then(html => {
            console.log('/src/' + page + '.html');
            
            //console.log(html);
            
            app.innerHTML = html;
        })      
        .catch(error => {
            console.error('Error al cargar la vista:', error);
            app.innerHTML = '<h1>Vista no está disponible</h1>';
        });
}

export default renderView;