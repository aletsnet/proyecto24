    let lcategoria = [];
    let data = [];
        
    const btn_delete = async (event) => {
        const tr = event.target.closest('tr');
        const item_id = tr.dataset.id;
        await sqlite.update('productos', { deleted_at: Date.now() }, 'id = ?', [item_id]);
        Swal.fire({
            title: 'Producto eliminado',
            text: 'El producto ha sido eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        });
        setTimeout(() => {
            cproductos.loadView();
            Swal.close();
        }, 800);
    }

    const btn_save = async (event, item) => {
        const tr = event.target.closest('tr');
        const item_id = tr.dataset.id;
        let row = item;//data.find(item => item.id == tr.dataset.id);
        let row_search = await sqlite.query(`SELECT * FROM productos WHERE id = ?`,  [item_id]);
        let _item = {};
        for(const key in row){
            if(key === 'id') continue;
            _item[key] = row[key];
        }
        _item['status'] = 101; //Activo
        _item['user'] = localStorage.getItem('user_id'); //usuario activo
        
        if(row_search.length > 0) {
            _item['updated_at'] = Date.now();
            await sqlite.update('productos', _item, 'id = ?', [item_id]);
        }else{
            _item['created_at'] = Date.now()
            await sqlite.insert('productos', _item);
        }

        Swal.fire({
            title: 'Producto guardado',
            text: 'El producto ha sido guardado correctamente.',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        });
        setTimeout(() => {
            cproductos.loadView();
            Swal.close();
        }, 800);
    }

    const upfile = (event) => {
            const input = event.target || null;
            const tr = event.target.closest('tr') || null;
            const a = event.target.closest('td') || null;
            //console.log(a, tr);
            
            const img = tr.querySelector('img') || null;
            const file = input.files[0] || null;
            if(file){
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img_src = e.target.result || '';
                    console.log(img_src);
                    img.src = img_src;
                };
                reader.readAsDataURL(file);
            }
        }

    const search_code = (event) => {
            const t = event.key || '';
            switch(t){
                case 'Enter':
                    const input = event.target || null;
                    const tr = event.target.closest('tr') || null;
                    const inputs = tr.querySelectorAll('input') || [];
                    const row = data.find( item => item[input.dataset.field] === input.value );
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
        lcategoria = await sqlite.query("SELECT id value, categoria label FROM categorias where padre IS NULL OR padre = '' order by categoria ");
        data = await sqlite.query("SELECT * FROM productos where deleted_at IS NULL order by nombre ");

        const config = {
            search: {
                value: '',
                fields: ['codigo_barras', 'codigo_sku', 'nombre', 'descripcion'],
                buttons: [
                    { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                    { label: '<i class="fas fa-eraser"></i> Limpiar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Limpiar búsqueda'); } },
                    { label: '<i class="fas fa-file-xls"></i> Exportar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Exportar'); } }
                ]
            },
            table: {
                cols: [
                    {label: 'Código de barras', field: 'codigo_barras', type : 'text', function: (event) => { search_code(event); }, typefunc: 'keyup'},
                    {label: 'Producto', field: 'nombre', type : 'text', valuedefault: ''},
                    {label: 'Descripción', field: 'descripcion', type : 'text', valuedefault: ''}, 
                    {label: 'Precio U.', field: 'precio_unidad', type: 'money'},
                    {label: 'Precio M.', field: 'precio_mayoreo', type: 'money'},
                    {label: 'Categoría', field: 'categoria', type: 'select',  options: lcategoria},
                    {label: '*', field: 'actions', type: 'button', buttons: ["add", "edit", "delete", "save"]}
                ],
                footer: {
                    label: 'Total de registros:',
                    field: 'count',
                    type: 'text'    
                }
            },
            buttons: [
                { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
                { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" },
            ],
            tableClass: 'tproductos',
            // Usando referencias a funciones (más seguro que eval)
            delete: (event) => {btn_delete(event)},   
            save: (event, item) => { btn_save(event, item) },
        }; 

        window.trebeca(config, data);
    
    }
export default {
    loadView
};