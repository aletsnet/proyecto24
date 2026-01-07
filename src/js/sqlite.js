// Módulo para manejar operaciones de SQLite con Tauri
import Database from "@tauri-apps/plugin-sql";
import schema from "./base.schema.json" assert { type: "json" };

let db = null;
export let model = [];
export let namedb = "";

// Conectar a la base de datos
export const connectDB = async () => {
    if (!db) {
        db = await Database.load("sqlite:" + namedb + ".db");
    }
    return db;
};

// SELECT - Consultar datos
export const query = async (sql, params = []) => {
    const database = await connectDB();
    let data = await database.select(sql, params);
    await closeDB();
    return data;
};

// INSERT, UPDATE, DELETE - Ejecutar comandos
export const execute = async (sql, params = []) => {
    const database = await connectDB();
    let result = await database.execute(sql, params);
    await closeDB();
    return result;
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

export default {
    connectDB,
    query,
    execute,
    insert,
    update,
    closeDB,
    checkModel
}