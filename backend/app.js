const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa cors
const usuarioRoutes = require('./routes/usuarioRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const historialRoutes = require('./routes/historialRoutes');
const db = require('./db/database');

const app = express();

// Configura CORS para permitir solicitudes desde el frontend de Angular
app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/prestamo', prestamoRoutes);
app.use('/historial', historialRoutes);

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
