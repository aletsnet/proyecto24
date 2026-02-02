let productos = [];
let categorias = [];
let data = [];

        const btn_delete = (event) => {
            const id = event.target.id;
            console.log("Eliminar registro id:", id);
        }
        const btn_save = (event) => {
            const id = event.target.id;
            console.log("Guardar registro id:", id);
        }

        const search_code = (event) => {
            const t = event.key || '';
            switch(t){
                case 'Enter':
                    const input = event.target || null;
                    const tr = event.target.closest('tr') || null;
                    const inputs = tr.querySelectorAll('input') || [];
                    const row = productos.find( item => item[input.dataset.field] === input.value );
                    if(row){
                        for(const element of inputs){
                            const field = element.dataset.field || '';
                            if(field !== '' && typeof row[field] !== "undefined" && typeof element.value !== "undefined"){
                                try{
                                    element.value = row[field];
                                }catch(e){
                                    console.log(e);
                                }
                            }
                        }
                    }
                break;
            }
        }

        const loadView = async () => {
            const config = {
                search: {
                    value: '',
                    fields: ['code','nombre', 'descripcion','categoria'],
                    buttons: [
                        { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                        { label: '<i class="fas fa-eraser"></i> Limpiar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Limpiar búsqueda'); } },
                        { label: '<i class="fas fa-file-xls"></i> Exportar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Exportar'); } }
                    ]
                },
                table: {
                    cols: [
                        {label: 'Codigo de Barras', field: 'code', type: 'text', function: (event) => { search_code(event); }, typefunc: 'keyup'},
                        {label: 'Producto', field: 'nombre', type : 'text', valuedefault: ''},
                        {label: 'Precio U.', field: 'precio', type: 'money'},
                        {label: 'Precio M.', field: 'precio_mayoreo', type: 'money'},
                        {label: 'Cantidad', field: 'cantidad', type: 'number', edit: false},
                        {label: 'Categoría', field: 'categoria', type: 'select', options: categorias},
                        {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save"]}
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
                ],
                tableClass: 'tinventarios',
                // Usando referencias a funciones (más seguro que eval)
                
                delete: (event) => {btn_delete(event)},   
                save: (event) => {btn_save(event)},
            };

            productos = await sqlite.query("SELECT * FROM productos WHERE deleted_at IS NULL");
            categorias = await sqlite.query("SELECT DISTINCT categoria FROM productos WHERE deleted_at IS NULL");

            data = await sqlite.query("select b.codigo_barras, b.nombre, a.* from inventarios a inner join productos b on b.id = a.producto where a.deleted_at IS NULL order by b.nombre ");
            window.trebeca(config, data);            
        }

export default {loadView};