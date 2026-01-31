import Swal from "sweetalert2";

let opciones = [];
let padres = [];
let data = [];

        const btn_delete = (event) => {
            const id = event.target.id;
            console.log("Eliminar registro id:", id);
        }

        const btn_save = async (event, item) => {
            //usuario se optiene del storage
            const user_id = localStorage.getItem('user_id');
            const tr = event.target.closest('tr');
            const item_id = tr.dataset.id;
            let row = item;//data.find(item => item.id == tr.dataset.id);
            let row_search = await sqlite.query(`SELECT * FROM categorias WHERE id = ?`,  [item_id]);
            let _item = {
                id: item_id,
                categoria: row.categoria, 
                descripcion: row.descripcion,
                status: row.status,
                user: user_id};
            
            if(row.padre && row.padre != ''){
                _item.padre = row.padre;
            }

            if(row_search.length > 0) {
                await sqlite.update('categorias', _item, 'id = ?', [item_id]);
                Swal.fire({
                    title: 'Categoría actualizada',
                    text: 'La categoría ha sido actualizada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Cerrar'
                });
                setTimeout(() => {
                    ccategorias.loadView();
                    Swal.close();
                }, 1500);

            }else{
                await sqlite.insert('categorias', _item);
                Swal.fire({
                    title: 'Categoría guardada',
                    text: 'La categoría ha sido guardada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Cerrar'
                });
                setTimeout(() => {
                    ccategorias.loadView();
                    Swal.close();
                }, 1500);
            }
        }

        const search_code = (event) => {
            const t = event.key || '';
            switch(t){
                case 'Enter':
                    const input = event.target || null;
                    const tr = event.target.closest('tr') || null;
                    const inputs = tr.querySelectorAll('input') || [];
                    const row = data.find( item => item.categoria === input.value );

                    if(row){
                        for(element of inputs){
                            const field = element.dataset.field || '';
                            console.log(field, element);
                            
                            if(field !== '' && typeof row[field] !== "undefined" && typeof element.value !== "undefined"){
                                try{
                                    element.value = row[field];
                                }catch(e){
                                    console.log(e);
                                }
                            }
                        }
                    }else{
                        for(element of inputs){
                            const field = element.dataset.field || '';
                            if(field !== "code"){
                                element.value = "";
                            }
                        }
                    }
                    
                    break;
            }
        }

    const loadView = async () => {
        opciones = await sqlite.query("SELECT id value, nombre label FROM catalogos_detalles where catalogo = 1 ");
        padres = await sqlite.query("SELECT id value, categoria label FROM categorias where padre IS NULL OR padre = '' order by categoria ");

        const config_default = {
            search: {
                value: '',
                fields: ['code','nombre', 'categoria'],
                buttons: [
                    { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                    { label: '<i class="fas fa-eraser"></i> Limpiar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Limpiar búsqueda'); } },
                    { label: '<i class="fas fa-file-xls"></i> Exportar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Exportar'); } }
                ]
            },
            table: {
                cols: [
                    {label: 'Categoria ', field: 'categoria', type: 'text', function: (event) => { search_code(event); }, typefunc: 'keyup'},
                    {label: 'Descripcion ', field: 'descripcion', type : 'text'},
                    {label: 'Padre', field: 'padre', type: 'select', options: padres},
                    {label: 'Status', field: 'status', type: 'select', options: opciones, valuedefault: '101'},
                    {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save"]}
                ],
                footer: {
                    label: 'Total de registros:',
                    field: 'count',
                    type: 'text'
                }
            },
            buttons: [
                { name: "add", label: '<i class="fas fa-plus"></i>', class: 'btn btn-success btn-sm me-1', modo: "new"  },
                { name: "edit", label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning btn-sm me-1', modo: "row" },
                { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
                { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" },
            ],
            tableClass: 'tcategorias',
            // Usando referencias a funciones (más seguro que eval)
            delete: (event) => {btn_delete(event)},   
            save: (event, item) => { btn_save(event, item) },
        };
        data = await sqlite.query("SELECT * FROM categorias");
        trebeca(config_default, data);
    }

    export default {
        loadView,
    }