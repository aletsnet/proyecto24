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
                    {label: 'Code', field: 'code', type: 'text', function: (event) => { search_code(event); }, typefunc: 'keyup'},
                    {label: 'Producto', field: 'nombre', type : 'text', valuedefault: 'Nuevo Producto'},
                    {label: 'Precio', field: 'precio', type: 'money'},
                    {label: 'Unidad', field: 'unidad', type: 'text'},
                    {label: 'Cantidad', field: 'cantidad', type: 'number', edit: false},
                    {label: 'Total', field: 'total', type: 'money', operator: 'multiply', add: false, edit: false, reference: ["cantidad", "precio"]},
                    {label: 'Categoría', field: 'categoria', type: 'select', 
                        options:["Abarrotes","Panaderia", "Lacteos", "Huevos", "Embutidos", "Verduras", "Frutas", "Carnes", "Cereales", "Aceites", "Dulces",
                         "Condimentos"], valuedefault: 'Abarrotes'},
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
                { name: "add", label: '<i class="fas fa-plus"></i>', class: 'btn btn-success btn-sm me-1', modo: "new"  },
                { name: "edit", label: '<i class="fas fa-edit"></i>', class: 'btn btn-warning btn-sm me-1', modo: "row" },
                { name: "delete", label: '<i class="fas fa-trash"></i>', class: 'btn btn-danger btn-sm me-1', modo: "row" },
                { name: "save", label: '<i class="fas fa-save"></i>', class: 'btn btn-success btn-sm me-1', modo: "row" },
                { name: "btn_extra", label: '<i class="fas fa-info-circle"></i>ok', class: 'btn btn-info btn-sm m-1', 
                modo: "row_extra", function: (event) => { other_function(event); } },
            ],
            tableClass: 'trebeca',
            // Usando referencias a funciones (más seguro que eval)
            add: (event) => {btn_add(event)},
            edit: (event) => {btn_edit(event)},
            delete: (event) => {btn_delete(event)},   
            save: (event) => {btn_save(event)},
        };

        const btn_add = () => {
            console.log("Agregar nuevo registro");
        }
        
        const btn_edit = (event) => {
            //console.log(event);
            const id = event.target.id;
            console.log("Editar registro id:", id);
            
        }

        const btn_delete = (event) => {
            const id = event.target.id;
            console.log("Eliminar registro id:", id);
        }

        const btn_save = (event) => {
            console.log(event);
            /*const id = event.children[0].id;
            console.log("Guardar registro id:", id);*/
        }

        const other_function = (event) => {
            const td_bts = event.target.closest('td');
            let row = data.find(item => item.id == td_bts.dataset.id);
            Swal.fire({
                title: 'Otra función',
                text: 'Esta es otra función de ejemplo.',
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        }

        const upfile = (event) => {
            const input = event.target || null;
            const tr = event.target.closest('tr') || null;
            const a = event.target.closest('td')
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
                    const row = data.find( item => item.code === input.value );

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

    const loadView = () => {
        alert("Cargando inventario...");
        trebeca(config_default, data);
    }

    export default {
        loadView,

    }