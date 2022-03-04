//Configuración de Mongoose
const mongoose = require('mongoose');

//Establezco la conexión
const config = mongoose.connect(process.env.DB_CNN)
    .then(() => {
        console.log("Conexión realizada con éxito");
    })
    .catch(err => {
        console.log(err);
        console.log("No se pudo realizar la conexión");
    });

module.exports = config;