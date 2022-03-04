const fs = require('fs');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    switch (tipo) {
        case 'usuarios':

            break;

        case 'hospitales':

            break;

        case 'medicos':

            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No es un médico');
                return false;
            }

            //Valido que sea un id válido de MongoDB
            if (!medico.isMongoId()) {
                console.log('El id debe ser válido');
                return false;
            }

            //Verifico que tiene imagen
            const pathViejo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                //Borro la imagen anterior
                fs.unlinkSync(pathViejo);
            }

            //Asigno la imagen
            medico.img = nombreArchivo;

            //Guardo médico
            await medico.save();
            return true;

            break;

        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}