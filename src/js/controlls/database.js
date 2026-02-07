let config = {
            search: {
                value: '',
                fields: [],
                buttons: [
                    { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                ]
            },
            table: {
                cols: [
                    {label: 'Producto', field: 'nombre', type : 'text', valuedefault: 'Nuevo Producto'},
                ]
            },
            buttons: [],
            tableClass: 'tquery',
        };

const checkDB = async () => {
    try {
        Swal.fire({
            title: 'Comprobando base de datos...',
            text: 'Por favor, espere.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        sqlite.namedb = "mydb";
        await sqlite.checkModel();
        Swal.close();
    } catch(err) {
        console.error(err);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error al verificar la base de datos',
            text: 'Ocurrió un error al comprobar la base de datos.',
        });
    }
}

const exportDB = async () => {
    const database = await sqlite.connectDB();
    const data = await database.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sqlite.namedb + '.db';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const loadView = async () => {
    const lquery = document.getElementById('lquery');
    lquery.value = "SELECT * FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    queryLoad();
}

const queryLoad = async () => {
    try{
        Swal.fire({
            title: 'Ejecutando consulta...',
            text: 'Por favor, espere.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const lquery = document.getElementById('lquery');
        const tables = await sqlite.query(lquery.value);
        if(tables.length > 0) {
            const row = tables[0];
            config.table.cols = [];
            console.log(row);
            for(let col in row) {
                console.log(col);
                config.table.cols.push({ label: col, field: col, type: 'text', valuedefault: '-' });
                config.search.fields.push(col);
            }
            config.table.cols.push({label: '*', field: 'actions', type: 'button', buttons: []})
            console.log("load rebeca");
            trebeca(config, tables);
        }
        Swal.close();
    } catch(err) {
        console.error(err);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error al ejecutar la consulta',
            text: 'Ocurrió un error al ejecutar la consulta.',
        });
    }
}

export default {
    checkDB,
    exportDB,
    loadView,
    queryLoad
};