let categorias = [];
let data = [];
const config = {
        search: {
            value: '',
            fields: ['nombre', 'descripcion','categoria'],
            buttons: [
                { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                { label: '<i class="fas fa-eraser"></i> Limpiar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Limpiar búsqueda'); } },
                { label: '<i class="fas fa-file-xls"></i> Exportar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Exportar'); } }
            ]
        },
        table: {
            cols: [
                {label: 'Producto', field: 'nombre', type : 'text', valuedefault: ''},
                {label: 'Descripción', field: 'descripcion', type : 'text', valuedefault: ''}, 
                {label: 'Categoría', field: 'categoria', type: 'select',  options: categorias, valuedefault: ''},
                {label: 'Foto', field: 'foto', type: 'image', valuedefault: 'img/ghost.png', function: (event) => { upfile(event); }, typefunc: 'change'},  
                {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save", "btn_extra"]}
            ],
            footer: {
                label: 'Total de registros:',
                field: 'count',
                type: 'text'    
            }
        },
        buttons: [
            { name: "add", label: '<i class="fas fa-plus"></i> Add', class: 'btn btn-success btn-sm me-1', modo: "new"  },
            { name: "edit", label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning btn-sm me-1', modo: "row" },
            { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
            { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" },
            { name: "btn_extra", label: '<i class="fas fa-info-circle"></i>', class: 'btn btn-info btn-sm m-1', modo: "row_extra", function: (
                event) => { other_function(event); } },
        ],
        tableClass: 'tproductos',
        // Usando referencias a funciones (más seguro que eval)
        add: (event) => {btn_add(event)},
        edit: (event) => {btn_edit(event)},
        delete: (event) => {btn_delete(event)},   
        save: (event) => {btn_save(event)},
    };  
        
    const btn_delete = (event) => {
        const id = event.target.id;
        console.log("Eliminar registro id:", id);
    }
    const btn_save = (event) => {
        const id = event.target.id;
        console.log("Guardar registro id:", id);
    }
        
    const loadView = async () => {
        data = await sqlite.query("SELECT *FROM productos");
        window.trebeca(config, data);
    
    }
export default {
    loadView
};