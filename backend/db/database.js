const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: 'America/Mexico_City',
    connectionLimit: 10,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    waitForConnections: true,
};

const pool = mysql.createPool(dbConfig);

pool.on('connection', () => {
    console.log('Nueva conexión establecida en el pool.');
});

pool.on('acquire', (connection) => {
    console.log('Conexión adquirida con ID:', connection.threadId);
});

pool.on('release', (connection) => {
    console.log('Conexión liberada con ID:', connection.threadId);
});

// Manejo de errores en el pool
pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Intentando reconectar...');
        pool.getConnection((error, connection) => {
            if (error) {
                console.error('Error al reconectar:', error);
            } else {
                console.log('Reconexión exitosa.');
                connection.release();
            }
        });
    }
});

module.exports = pool;
