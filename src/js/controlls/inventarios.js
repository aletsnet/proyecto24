import Swal from "sweetalert2";
import { invoke } from "@tauri-apps/api/core";
import * as XLSX from 'xlsx';

let productos = [];
let categorias = [];
let data = [];

        const btn_delete = async (event) => {
            const tr = event.target.closest('tr');
            let id = tr.dataset.id;
            //confirmacion para eliminar registro
            
            let row_inventario = {};
            row_inventario['deleted_at'] = Date.now();
            await sqlite.update('inventarios', row_inventario, 'id = ?', [id]);
            Swal.fire(
                'Eliminado',
                'El registro ha sido eliminado.',
                'success'
            );
            setTimeout(() => {
                cinventarios.loadView();
                Swal.close();
            }, 800);
        }

        const btn_save = async (event, row) => {
            const tr = event.target.closest('tr');
            let id = tr.dataset.id;
            let row_search = await sqlite.query(`SELECT * FROM inventarios WHERE id = ? AND deleted_at IS NULL`,  [id]);
            let row_inventario = {};
            let row_productio = await sqlite.query(`SELECT * FROM productos WHERE codigo_barras = ? AND deleted_at IS NULL`,  [row.codigo_barras]);
            
            let _item = {};
            _item['nombre'] = row.nombre;
            _item['codigo_barras'] = row.codigo_barras;
            _item['precio_unidad'] = row.precio_unidad;
            _item['precio_mayoreo'] = row.precio_mayoreo;
            _item['categoria'] = row.categoria;
            _item['status'] = 101; //Activo
            _item['user'] = localStorage.getItem('user_id'); //usuario activo
            
            if(row_productio.length > 0) {
                _item['updated_at'] = Date.now();
                await sqlite.update('productos', _item, 'id = ?', [row_productio[0].id]);
                row_inventario['producto'] = row_productio[0].id;
            }else{
                _item['created_at'] = Date.now()
                let r = await sqlite.insert('productos', _item);
                row_inventario['producto'] = r.lastInsertId ?? 0;
            }

            row_inventario['stock'] = row.stock;
            row_inventario['precio_unidad'] = row.precio_unidad;
            row_inventario['precio_mayoreo'] = row.precio_mayoreo;
            row_inventario['sucursal'] = 1;
            row_inventario['status'] = 101; //Activo
            row_inventario['user'] = localStorage.getItem('user_id'); //usuario activo
            

            if(row_search.length > 0) {
                row_inventario['updated_at'] = Date.now();
                await sqlite.update('inventarios', row_inventario, 'id = ?', [id]);
            }else{
                row_inventario['created_at'] = Date.now()
                await sqlite.insert('inventarios', row_inventario);
            }

            Swal.fire({
                title: 'Inventario',
                text: 'El producto ha sido guardado correctamente en el inventario.',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            });
            setTimeout(() => {
                cinventarios.loadView();
                Swal.close();
            }, 800);
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

        const importar = async (event) => {
            const input = event.target || null;
            const file = input.files[0] || null;
            try{
            if(file){
                const reader = new FileReader();
                reader.onload = async (e) => {
                    let lines = [];
                    if (file.name.endsWith('.xlsx') || file.type.includes('spreadsheet')) {
                        // Procesar Excel
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        lines = json.slice(1); // Saltar header si hay
                        
                    } else {
                        // Procesar TXT/CSV
                        const text = e.target.result || '';
                        lines = text.split('\n').map(line => line.split(','));
                    }

                    for(const cols of lines){
                        if(cols.length >= 5){
                            let codigo_barras = (cols[0] || '').trim();
                            let nombre = (cols[1] || '').trim();
                            let categoria = (cols[2] || '').trim();                            
                            let precio_unidad = cols[3] || 0;
                            let stock = cols[4] || 0;
                            
                            if (codigo_barras && nombre) {
                                let row_productio = await sqlite.query(`SELECT * FROM productos WHERE codigo_barras = ? AND deleted_at IS NULL`,  [codigo_barras]);
                                let producto_id = 0;
                                let _item = {};
                                _item['nombre'] = nombre;
                                _item['codigo_barras'] = codigo_barras;
                                _item['categoria'] = categoria;
                                _item['precio_unidad'] = precio_unidad;
                                _item['status'] = 101; //Activo
                                _item['user'] = localStorage.getItem('user_id'); //usuario activo
                                if(row_productio.length > 0) {
                                    _item['updated_at'] = Date.now();
                                    await sqlite.update('productos', _item, 'id = ?', [row_productio[0].id]);
                                    producto_id = row_productio[0].id;
                                }else{
                                    _item['created_at'] = Date.now()
                                    let r = await sqlite.insert('productos', _item);
                                    producto_id = r.lastInsertId ?? 0;
                                }
                                let row_inventario = {};
                                row_inventario['producto'] = producto_id;
                                row_inventario['stock'] = stock;
                                row_inventario['precio_unidad'] = precio_unidad;
                                row_inventario['sucursal'] = 1;
                                row_inventario['status'] = 101; //Activo
                                row_inventario['user'] = localStorage.getItem('user_id'); //usuario activo
                                let row_search = await sqlite.query(`SELECT * FROM inventarios WHERE producto = ? AND sucursal = ? AND deleted_at IS NULL`,  [producto_id, 1]);
                                if(row_search.length > 0) {
                                    row_inventario['updated_at'] = Date.now();
                                    await sqlite.update('inventarios', row_inventario, 'id = ?', [row_search[0].id]);
                                }else{
                                    row_inventario['created_at'] = Date.now()
                                    await sqlite.insert('inventarios', row_inventario);
                                }
                            }
                        }
                    }
                    Swal.fire({
                        title: 'Importación completa',
                        text: 'Los productos han sido importados correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Cerrar'
                    });
                    setTimeout(() => {
                        cinventarios.loadView();
                        Swal.close();
                    }, 800);
                };
                if (file.name.endsWith('.xlsx') || file.type.includes('spreadsheet')) {
                    reader.readAsArrayBuffer(file);
                } else {
                    reader.readAsText(file);
                }
            }
            }catch(e){
                console.error(e);
                Swal.fire("Error", "Hubo un problema al importar el archivo.", "error");
            }
        }

        const selectFile = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv, text/csv, xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';
            input.onchange = importar;
            input.click();
        }

        const loadView = async () => {
            productos = await sqlite.query("SELECT * FROM productos WHERE deleted_at IS NULL");
            categorias = await sqlite.query("SELECT id value, categoria label FROM categorias WHERE deleted_at IS NULL Order BY padre, categoria");

            const config = {
                search: {
                    value: '',
                    fields: ['codigo_barras','nombre', 'descripcion','categoria'],
                    buttons: [
                        { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                        { label: '<i class="fas fa-eraser"></i> Limpiar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Limpiar búsqueda'); } },
                        { label: '<i class="fas fa-file-xls"></i> Exportar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Exportar'); } }
                    ]
                },
                table: {
                    cols: [
                        {label: 'Codigo de Barras', field: 'codigo_barras', type: 'text', function: (event) => { search_code(event); }, typefunc: 'keyup'},
                        {label: 'Producto', field: 'nombre', type : 'text', valuedefault: ''},
                        {label: 'Precio U.', field: 'precio_unidad', type: 'money'},
                        {label: 'Precio M.', field: 'precio_mayoreo', type: 'money'},
                        {label: 'Cantidad', field: 'stock', type: 'number', edit: false},
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
                
                delete: (event, row) => {btn_delete(event, row)},   
                save: (event, row) => {btn_save(event, row)},
            };

            data = await sqlite.query("select b.codigo_barras, b.nombre, b.categoria, a.* from inventarios a inner join productos b on b.id = a.producto where a.deleted_at IS NULL order by b.nombre ");
            window.trebeca(config, data);            
        }

        const abrirFormato = async () => {
            try {
                await invoke("open_formato");
            } catch (error) {
                console.error("Error al abrir el archivo:", error);
                Swal.fire("Error", "No se pudo abrir el archivo.", "error");
            }
        }

export default {loadView, selectFile, abrirFormato };