const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    //Paginación
    const desde = Number(req.query.desde) || 0;

    /* const usuarios = await Usuario.find({}, 'nombre email role google')
        .skip(desde)
        .limit(5);

    const total = await Usuario.count(); */

    //Ejecuto las dos promesas de manera simultánea
    const [usuarios, total] = await Promise.all([
        Usuario
        .find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5),

        Usuario.count()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async(req, res) => {

    const { nombre, email, password } = req.body;

    try {

        //Compruebo que el email no esté ya registrado (email único)
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(); //Data generada de manera aleatoria
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardo usuario
        await usuario.save();

        //Genero el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    //Obtengo el uid
    const uid = req.params.id;

    try {

        //Compruebo que existe el usuario (si no existe no puedo actualizarlo)
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        //Validar token y comprobar si es el usuario correcto

        //Actualizo el usuario (quito los que no quiero actualizar (no se deben actualizar nunca))
        const { password, google, email, ...campos } = req.body;

        if (existeUsuario.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarUsuario = async(req, res = response) => {

    //Obtengo el uid
    const uid = req.params.id;

    try {

        //Me aseguro que existe el usuario (no puedo borrar algo que no existe)
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        //Borro usuario
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}