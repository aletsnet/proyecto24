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

const abrirCorte = async () => {
    const corteActivo = localStorage.getItem("corte_activo");
    if (corteActivo) {
        Swal.fire('Caja ya abierta', 'Ya hay un corte activo', 'warning');
        return;
    }

    const result = await sqlite.insert("cortes", {
        sucursal: 1,
        user: localStorage.getItem('user_id'),
        fecha_inicio: new Date().toISOString(),
        total_inicial: 0.00,
        total_ventas: 0.00,
        status: 101
    });

    localStorage.setItem("corte_activo", result.lastInsertId);
    Swal.fire('Caja abierta', 'Corte iniciado correctamente', 'success');
    loadView();
}

const cerrarCorte = async () => {
    const corteId = localStorage.getItem("corte_activo");
    if (!corteId) {
        Swal.fire('Caja cerrada', 'No hay corte activo', 'warning');
        return;
    }

    // Calcular totales
    const totales = await sqlite.query(`
        SELECT 
            SUM(CASE WHEN v.tipo = 201 THEN v.total ELSE 0 END) as efectivo,
            SUM(CASE WHEN v.tipo = 202 THEN v.total ELSE 0 END) as tarjeta,
            SUM(CASE WHEN v.tipo = 203 THEN v.total ELSE 0 END) as trasferencia,
            SUM(v.total) as total
        FROM ventas v WHERE v.corte = ?
    `, [corteId]);

    await sqlite.update("cortes", {
        fecha_cierre: new Date().toISOString(),
        total_ventas: totales[0].total || 0,
        status: 102
    }, "id = ?", [corteId]);

    localStorage.removeItem("corte_activo");
    Swal.fire('Caja cerrada', 'Corte finalizado correctamente', 'success');
    loadView();
}

const loadView = async () => {
    const data = await sqlite.query("SELECT * FROM cortes ORDER BY id DESC");

    const config = {
        search: {
            value: '',
            fields: ['fechainicio', 'fechafinal', 'total_ventas'],
            buttons: [
                { label: '<i class="fas fa-search"></i> Buscar', class: 'btn btn-primary btn-sm me-1', function: (event) => { console.log('Buscar'); } },
                { label: '<i class="fas fa-eraser"></i> Limpiar', class: 'btn btn-secondary btn-sm me-1', function: (event) => { console.log('Limpiar búsqueda'); } }
            ]
        },
        table: {
            cols: [
                {label: 'Fecha Apertura', field: 'fechainicio ', type: 'date'},
                {label: 'Fecha Cierre', field: 'fechafinal', type: 'date'},
                {label: 'Ventas', field: 'ventas', type: 'money'},
                {label: 'Apertura', field: 'inicio', type: 'money'},
                {label: 'En Caja', field: 'caja', type: 'money'},
                {label: 'Diferencia', field: 'diferencia', type: 'money'},
                
            ],
            footer: {
                label: 'Total de registros:',
                field: 'count',
                type: 'text'
            }
        },
            buttons: [],
        tableClass: 'tcortes'
    };

    window.trebeca(config, data);
}

export default {
    cargarCorte,
    cerrarCaja,
    abrirCorte,
    cerrarCorte,
    loadView
};