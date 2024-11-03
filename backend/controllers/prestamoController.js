const db = require('../db/database');
const moment = require('moment-timezone');

// Crea un nuevo préstamo para un cliente
exports.createPrestamo = (req, res) => {
    const { id_cliente, monto, plazo_meses, tasa_interes } = req.body;
    const fechaSolicitud = moment().tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:ss");

    // Verificar que el id_cliente sea de tipo 'cliente'
    const checkUserSql = 'SELECT tipo_usuario FROM Usuario WHERE id_usuario = ?';
    db.query(checkUserSql, [id_cliente], (err, results) => {
        if (err) {
            console.error('Error al verificar el tipo de usuario:', err);
            return res.status(500).json({ message: 'Error al verificar el tipo de usuario.' });
        }

        // Verificar si el usuario es de tipo 'cliente'
        if (results.length === 0 || results[0].tipo_usuario !== 'cliente') {
            return res.status(403).json({ message: 'El usuario no tiene permisos para solicitar un préstamo.' });
        }

        // Si es cliente, proceder a crear el préstamo
        const insertSql = 'INSERT INTO Prestamo (id_cliente, monto, plazo_meses, tasa_interes, fecha_solicitud) VALUES (?, ?, ?, ?, ?)';
        db.query(insertSql, [id_cliente, monto, plazo_meses, tasa_interes, fechaSolicitud], (err, result) => {
            if (err) {
                console.error('Error al crear el préstamo:', err);
                return res.status(500).json({ message: 'Error al crear el préstamo.' });
            }
            res.status(201).json({ message: 'Préstamo creado exitosamente.' });
        });
    });
};

// Obtiene un préstamo específico de un cliente por su ID
exports.getPrestamoById = (req, res) => {
    const { id_cliente, id_prestamo } = req.params;

    const sql = `
        SELECT id_prestamo, monto, plazo_meses, tasa_interes, fecha_solicitud, estado
        FROM Prestamo
        WHERE id_prestamo = ? AND id_cliente = ?;
    `;

    db.query(sql, [id_prestamo, id_cliente], (err, result) => {
        if (err) {
            console.error('Error al obtener el préstamo:', err);
            return res.status(500).json({ message: 'Error al obtener el préstamo.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado o no pertenece al cliente especificado.' });
        }
        res.status(200).json({
            message: 'Préstamo obtenido exitosamente.',
            data: result[0]
        });
    });
};

// Obtiene todos los préstamos asociados a un cliente
exports.getPrestamosByCliente = (req, res) => {
    const { id_cliente } = req.params;

    console.log("ID Cliente recibido:", id_cliente);

    const sql = 'SELECT * FROM Prestamo WHERE id_cliente = ?';

    db.query(sql, [id_cliente], (err, results) => {
        if (err) {
            console.error('Error al obtener los préstamos del cliente:', err);
            return res.status(500).json({ message: 'Error al obtener los préstamos del cliente.' });
        }

        if (results.length === 0) {
            console.warn('No se encontraron préstamos para el cliente:', id_cliente);
            return res.status(404).json({ message: 'No se encontraron préstamos para este cliente.' });
        }

        res.status(200).json(results);
    });
};


// Actualiza el estado de un préstamo específico de un cliente
exports.updatePrestamoStatus = (req, res) => {
    const { id_cliente, id_prestamo } = req.params;
    const { estado } = req.body;

    console.log("Ejecutando updatePrestamoStatus, ID Cliente:", id_cliente, "ID Prestamo:", id_prestamo);

    const estadosPermitidos = ['activo', 'pagado', 'cancelado'];

    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ message: 'Estado no válido. Los estados permitidos son: activo, pagado, cancelado.' });
    }

    const sql = 'UPDATE Prestamo SET estado = ? WHERE id_prestamo = ? AND id_cliente = ?';

    db.query(sql, [estado, id_prestamo, id_cliente], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado del préstamo:', err);
            return res.status(500).json({ message: 'Error al actualizar el estado del préstamo.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Préstamo no encontrado o no pertenece al cliente especificado.' });
        }
        res.status(200).json({ message: `Estado del préstamo actualizado exitosamente a "${estado}".` });
    });
}; 