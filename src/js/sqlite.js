// Módulo para manejar operaciones de SQLite con Tauri
import Database from "@tauri-apps/plugin-sql";
import schema from "./base.schema.json" assert { type: "json" };
import dataDefault from "./base.data.json" assert { type: "json" };

let db = null;
export let model = [];
export let namedb = "";

// Conectar a la base de datos
export const connectDB = async () => {
    if (!db) {
        if(namedb === "") {
            //busca el nombre en el storage
            namedb = localStorage.getItem("namedb");
            if(namedb === null || namedb === ""){
                namedb = Math.random().toString(36).substring(2, 10);
                localStorage.setItem("namedb", namedb);
            }
        }
        db = await Database.load("sqlite:" + namedb + ".db");
    }
    return db;
};

// SELECT - Consultar datos
export const query = async (sql, params = []) => {
    try{
        const database = await connectDB();
        let data = await database.select(sql, params);
        await closeDB();
        return data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al ejecutar la consulta',
            text: sql + " <br/>" + error.message,
        });
        //console.error("Error executing query:", error);
        throw error;
    }
};

// INSERT, UPDATE, DELETE - Ejecutar comandos
export const execute = async (sql, params = []) => {
    try {
        const database = await connectDB();
        let result = await database.execute(sql, params);
        await closeDB();
        return result;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al ejecutar la consulta',
            text: sql + '<br/>' + error,
        });
        //console.error("Error executing command:", error);
        throw error;
    }
};

// INSERT específico para una tabla
// nametable: {col1: val1, col2: val2, ...}
export const insert = async (table, data) => {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    return await execute(sql, values);
};

// UPDATE específico para una tabla
export const update = async (table, data, where, whereParams = []) => {
    const setClause = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');
    const values = [...Object.values(data), ...whereParams];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    return await execute(sql, values);
};

// Cerrar conexión
export const closeDB = async () => {
    if (db) {
        await db.close();
        db = null;
    }
};

export const checkModel = async () => {
    model = await query("SELECT name FROM sqlite_master WHERE type='table'");
    model = model.map(item => item.name);
    const list = schema.schema.tables;
    console.log("Modelo actual:", model);
    for (let table of list) {
        if(typeof table.name === "undefined") continue;
        if (!model.includes(table.name)) {
            console.log(`Creando tabla: ${table.name}`);
            console.log(table);
            let ddl = `CREATE TABLE ${table.name} (`;
            for (let columns of table.columns) {
                let columna = "";
                for (let key in columns) {
                    switch(key) {
                        case "name":
                            columna += `${columns[key]}`;
                            break;
                        case "type":
                            columna += ` ${columns[key]}`;
                            break;
                        case "primaryKey":
                            if(columns[key] === true) {
                                columna += ` PRIMARY KEY`;
                            }
                            break;
                        case "autoIncrement":
                            if(columns[key] === true) {
                                columna += ` AUTOINCREMENT`;
                            }
                            break;
                        case "nullable":
                            if(columns[key] === false) {
                                columna += ` NOT NULL`;
                            } else {
                                columna += ` NULL`;
                            }
                            break;
                        default:
                            if(columns[key] === true) {
                                columna += ` ${key.toUpperCase()}`;
                            }
                            else if(columns[key] !== false) {
                                columna += ` ${key.toUpperCase()} ${columns[key]}`;
                            }
                            break;
                    }
                }
                ddl += `${columna}, `;
            }
            ddl = ddl.slice(0, -2); // Eliminar la última coma y espacio
            for(let foreign of table.foreignKeys || []) {
                ddl += `, FOREIGN KEY(${foreign.column}) REFERENCES ${foreign.references.table}(${foreign.references.column}) ON DELETE CASCADE`;
            }

            for(let index of table.indexes || []) {
                ddl += `, INDEX ${index.name} (${index.columns.join(', ')})`;
            }
            ddl += `);`;
            //console.log(ddl);
            await execute(ddl);
            //model.push(table.name);
            //await execute(table.create);
        }
    }
};

const checkDate = async () => {
    console.log("Valia los datos por defecto");
    
    const data = dataDefault;
    for (let tableData of data) {
        const tableName = tableData.table;  
        for (let row of tableData.data) {
            // Verificar si el registro ya existe
            let whereClause = [];
            let whereParams = [];
            for (let key in row) {
                whereClause.push(`${key} = ?`);
                whereParams.push(row[key]);
            }
            const existingRecords = await query("SELECT * FROM " + tableName + " WHERE " + whereClause.join(' AND '), whereParams);
            if (existingRecords.length === 0) {
                // Insertar el registro si no existe
                await insert(tableName, row);
            }
        }
    }
}

export default {
    connectDB,
    query,
    execute,
    insert,
    update,
    closeDB,
    checkModel,
    checkDate
}