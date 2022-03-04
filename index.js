//Llamo a las variables de entorno
require('dotenv').config();

//Importo express
const express = require('express');

//Importo CORS
const cors = require('cors');

//Importo config
const config = require('./database/config');

//Creo el servidor de express
const app = express();

//Configuro CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.json());

//Base de datos
config;

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

//Levanto el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});