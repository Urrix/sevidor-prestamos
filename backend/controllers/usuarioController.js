const db = require('../db/database');
const bcrypt = require('bcryptjs');

exports.registerUser = (req, res) => {
    const { nombre, direccion, telefono, correo, tipo_usuario, nombre_usuario, contrasena } = req.body;
    const hashedPassword = bcrypt.hashSync(contrasena, 8);

    const sql = 'INSERT INTO Usuario (nombre, direccion, telefono, correo, tipo_usuario, nombre_usuario, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [nombre, direccion, telefono, correo, tipo_usuario, nombre_usuario, hashedPassword];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario en la base de datos:', err);
            return res.status(500).json({ message: 'Error en el registro del usuario.', error: err });
        }

        if (result.affectedRows > 0) {
            return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
        } else {
            return res.status(500).json({ message: 'No se pudo registrar el usuario.' });
        }
    });
};

exports.loginUser = (req, res) => {
    const { nombre_usuario, contrasena } = req.body;
    const sql = 'SELECT * FROM Usuario WHERE nombre_usuario = ?';

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return res.status(500).json({ message: 'Error en el servidor.' });
        }

        connection.query(sql, [nombre_usuario], (error, results) => {
            connection.release(); // Libera la conexión después de la consulta

            if (error) {
                console.error('Error en la consulta de inicio de sesión:', error);
                return res.status(500).json({ message: 'Error en la consulta de inicio de sesión.' });
            }

            if (results.length === 0) {
                console.warn(`Usuario ${nombre_usuario} no encontrado.`);
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            const user = results[0];

            try {
                const passwordIsValid = bcrypt.compareSync(contrasena, user.contrasena);
                if (!passwordIsValid) {
                    console.warn(`Contraseña incorrecta para el usuario: ${nombre_usuario}`);
                    return res.status(401).json({ message: 'Contraseña incorrecta.' });
                }

                console.log(`Inicio de sesión exitoso para usuario: ${nombre_usuario}`);
                return res.status(200).json({
                    message: 'Inicio de sesión exitoso.',
                    userId: user.id_usuario,
                    name: user.nombre,
                    role: user.tipo_usuario
                });
            } catch (bcryptError) {
                console.error('Error en bcrypt.compareSync:', bcryptError);
                return res.status(500).json({ message: 'Error en el proceso de verificación de la contraseña.' });
            }
        });
    });
};
