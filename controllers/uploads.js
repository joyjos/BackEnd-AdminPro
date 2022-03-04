const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const path = require('path');
const fs = require('fs');

const fileUpload = (req, res) => {

    //Recojo los valores que paso en la url
    const tipo = req.params.tipo;
    const id = req.params.id;

    //Valido tipo (me aseguro que los tipos van a ser usuarios, hospitales o médicos)
    const tiposValidos = ['usuarios', 'hospitales', 'medicos'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un usuario, hospital o médico (tipo)'
        });
    }

    //Valido que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    //Proceso la imagen

    //Recojo el archivo
    const file = req.files.imagen;

    //Extraigo la extensión del archivo
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1].toLowerCase();

    //Valido la extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    //Genero el nombre del archivo
    const nombreArchivo = uuidv4() + '.' + extensionArchivo;

    //Path para guardar el archivo
    const path = './uploads/' + tipo + '/' + nombreArchivo;
    //const path = `./uploads/${tipo}/${nombreArchivo}`;

    //Muevo la imagen
    file.mv(path, (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen',
                nombreArchivo
            });
        }

        //Actualizo la base de datos
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });

}

const retornaImagen = (req, res) => {

    //Recojo los valores que paso en la url
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    //Path para recuperar el archivo
    const pathImg = path.join(__dirname, '../uploads/' + tipo + '/' + foto);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        //Imagen por defecto
        const pathImg = path.join(__dirname, '../uploads/user.png');
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}