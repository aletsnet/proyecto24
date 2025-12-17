import mysql from 'mysql2';
//let mysql = require('mysql2');
const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'proyecto24',
    user: 'root',
    //me pidio crear una password obligatoriamente
    password: 'password'
});

conexion.connect(function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log("Conexion exitosa");
    }

});
conexion.end();