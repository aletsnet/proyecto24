import sqlite from "../../db/sqlite";
async function cargarCorte() {
    const corteId = localStorage.getItem("corte_activo");
    if (!corteId) return;

    const corte = await sqlite.query(
        "SELECT fechainicio FROM cortes WHERE id = ?",
        [corteId]
    );

    document.getElementById("horaInicio").textContent =
        new Date(corte[0].fechainicio).toLocaleTimeString();

    const resumen = await sqlite.query(`
        SELECT cd.nombre, SUM(v.total) total
        FROM ventas v
        JOIN catalogos_detalles cd ON cd.id = v.tipo
        WHERE v.corte = ?
        GROUP BY cd.nombre
    `, [corteId]);

    resumen.forEach(r => {
        const id = r.nombre.toLowerCase();
        const el = document.getElementById(id);
        if (el) el.textContent = `$${Number(r.total).toFixed(2)}`;
    });

    const movimientos = await sqlite.query(`
        SELECT v.id, v.total, v.created_at, cd.nombre
        FROM ventas v
        JOIN catalogos_detalles cd ON cd.id = v.tipo
        WHERE v.corte = ?
        ORDER BY v.created_at
    `, [corteId]);

    const tbody = document.getElementById("tablaMovimientos");
    tbody.innerHTML = "";

    movimientos.forEach(v => {
        tbody.innerHTML += `
            <tr>
                <td>${new Date(v.created_at).toLocaleTimeString()}</td>
                <td>#${v.id}</td>
                <td>${v.nombre}</td>
                <td>$${Number(v.total).toFixed(2)}</td>
            </tr>
        `;
    });

}
async function cerrarCaja() {
    const corteId = localStorage.getItem("corte_activo");

    const pagos = await sqlite.query(`
        SELECT tipo, SUM(total) total
        FROM ventas
        WHERE corte = ?
        GROUP BY tipo
    `, [corteId]);

    let totales = {
        efectivo: 0,
        tarjeta: 0,
        trasferencia: 0,
        otros: 0
    };

    pagos.forEach(p => {
        if (p.tipo === 1) totales.efectivo = p.total;
        else if (p.tipo === 2) totales.tarjeta = p.total;
        else if (p.tipo === 3) totales.trasferencia = p.total;
        else totales.otros += p.total;
    });

    const venta = Object.values(totales).reduce((a, b) => a + b, 0);

    await sqlite.update("cortes", {
        fechafinal: new Date().toISOString(),
        venta,
        efectivo: totales.efectivo,
        tarjeta: totales.tarjeta,
        trasferencia: totales.trasferencia,
        otros: totales.otros,
        status: 0
    }, "id = ?", [corteId]);

    localStorage.removeItem("corte_activo");

    Swal.fire('Caja cerrada', 'Corte finalizado correctamente', 'success');
}

export default {
    cargarCorte,
    cerrarCaja,
};