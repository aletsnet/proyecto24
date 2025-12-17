let mysql = require('mysql2');
let conexion = mysql.createConnection({
    host: 'localhost',
    database: 'proyecto24',
    user: 'root',
    password: ''
});

conexion.connect(function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log("Conexion exitosa");
    }

});