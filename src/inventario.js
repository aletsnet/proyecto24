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
  const rows = await db.select(
    "SELECT * FROM productos"
  );
  

  // Carga todo en la tabla
  //const tbody = document.getElementById("productos-body");
  //tbody.innerHTML = "";
  
 /* for (const p of productos) {
    
      retorno+='{id: '+p.id+', name: '+p.Nombre,+', price:'
       
      
    
  }
  console.log("INVENTARIO INICIADO");
  //Imprime los productos que cargo*/
  console.log("PRODUCTOS: ",rows);
  return rows;
}
export async function editElement(aidi,nuevoID,nuevoNombre,nuevoPrecio) {
  //Abre la conexion, la contrasenia es password
  if (!db) {
    db = await Database.load(
      "mysql://root:password@127.0.0.1/proyecto24"
    );
  }

  // Edita
  
   const result = await db.execute(
    "UPDATE productos SET id = ?, Nombre = ?, Precio = ? WHERE id = ?",
    [nuevoID,nuevoNombre,nuevoPrecio,aidi]
  );
  

  // Carga todo en la tabla
  //const tbody = document.getElementById("productos-body");
  //tbody.innerHTML = "";
  
 /* for (const p of productos) {
    
      retorno+='{id: '+p.id+', name: '+p.Nombre,+', price:'
       
      
    
  }
  console.log("INVENTARIO INICIADO");
  //Imprime los productos que cargo*/
  //console.log("Eliminando: ",aidi);
  //console.log("Resultado: ",result);
  //return rows;
}
export async function addElement(nuevoID,nuevoNombre,nuevoPrecio) {
  //Abre la conexion, la contrasenia es password
  if (!db) {
    db = await Database.load(
      "mysql://root:password@127.0.0.1/proyecto24"
    );
  }

  // Edita
  
   const result = await db.execute(
    "INSERT INTO productos (id,Nombre,Precio) VALUES (?,?,? )",
    [nuevoID,nuevoNombre,nuevoPrecio]
  );
  

  // Carga todo en la tabla
  //const tbody = document.getElementById("productos-body");
  //tbody.innerHTML = "";
  
 /* for (const p of productos) {
    
      retorno+='{id: '+p.id+', name: '+p.Nombre,+', price:'
       
      
    
  }
  console.log("INVENTARIO INICIADO");
  //Imprime los productos que cargo*/
  //console.log("Eliminando: ",aidi);
  //console.log("Resultado: ",result);
  //return rows;
}

export async function eraseElement(aidi) {
  //Abre la conexion, la contrasenia es password
  if (!db) {
    db = await Database.load(
      "mysql://root:password@127.0.0.1/proyecto24"
    );
  }

  // Pide los productos de la tabla productos
  
   const result = await db.execute(
    "DELETE FROM productos WHERE id = ?",
    [aidi]
  );
  

  // Carga todo en la tabla
  //const tbody = document.getElementById("productos-body");
  //tbody.innerHTML = "";
  
 /* for (const p of productos) {
    
      retorno+='{id: '+p.id+', name: '+p.Nombre,+', price:'
       
      
    
  }
  console.log("INVENTARIO INICIADO");
  //Imprime los productos que cargo*/
  console.log("Editando: ",aidi);
  console.log("Resultado: ",result);
  //return rows;
}
