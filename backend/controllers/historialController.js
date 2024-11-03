const db = require('../db/database');

exports.registrarConsultaHistorial = (req, res) => {
    const { id_cliente, id_prestamo } = req.body;
    const sql = 'INSERT INTO Historial_Prestamos (id_cliente, id_prestamo, fecha_consulta) VALUES (?, ?, NOW())';
    db.query(sql, [id_cliente, id_prestamo], (err, result) => {
        if (err) {
            console.error('Error al registrar consulta en el historial:', err);
            return res.status(500).send('Error al registrar consulta en el historial.');
        }
        res.status(201).send('Consulta de historial registrada exitosamente.');
    });
};

exports.obtenerHistorialPorCliente = (req, res) => {
    const { id_cliente } = req.params;
    const sql = `
        SELECT h.id_historial, h.fecha_consulta, p.id_prestamo, p.monto, p.plazo_meses, p.tasa_interes, p.estado
        FROM Historial_Prestamos h
        JOIN Prestamo p ON h.id_prestamo = p.id_prestamo
        WHERE h.id_cliente = ?
        ORDER BY h.fecha_consulta DESC
    `;
    db.query(sql, [id_cliente], (err, results) => {
        if (err) {
            console.error('Error al obtener el historial de préstamos:', err);
            return res.status(500).send('Error al obtener el historial de préstamos.');
        }
        res.status(200).json(results);
    });
};

exports.calcularAmortizacion = (req, res) => {
    const { monto, plazo_meses, tasa_interes } = req.body;

    const amortizacion = [];
    const pagoCapital = monto / plazo_meses;
    const tasaMensual = tasa_interes / 100 / 12;
    let saldoRestante = monto;

    for (let mes = 1; mes <= plazo_meses; mes++) {
        const pagoInteres = saldoRestante * tasaMensual;
        const cuota = pagoCapital + pagoInteres;
        saldoRestante -= pagoCapital;

        amortizacion.push({
            mes,
            cuota: cuota.toFixed(2),
            interes: pagoInteres.toFixed(2),
            capital: pagoCapital.toFixed(2),
            saldoRestante: saldoRestante.toFixed(2)
        });
    }

    res.status(200).json(amortizacion);
};
