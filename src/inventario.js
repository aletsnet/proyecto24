import Database from "@tauri-apps/plugin-sql";

let db = null;

export async function initInventario() {
  //Abre la conexion, la contrasenia es password
  if (!db) {
    db = await Database.load(
      "mysql://root:password@127.0.0.1/proyecto24"
    );
  }

  // Pide los productos de la tabla productos
  const productos = await db.select(
    "SELECT * FROM productos"
  );

  // Carga todo en la tabla
  const tbody = document.getElementById("productos-body");
  tbody.innerHTML = "";
  
  for (const p of productos) {
    tbody.innerHTML += `
      <tr>
        <th>${p.id}</th>
        <td>${p.Nombre}</td>
      </tr>
    `;
  }
  console.log("INVENTARIO INICIADO");
  //Imprime los productos que cargo
  console.log("PRODUCTOS: "+productos);
}
