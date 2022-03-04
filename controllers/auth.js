const { response } = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {

    //Obtengo el password y el email del body
    const { password, email } = req.body;

    try {

        //Verifico email (Busco el usuario por el email)
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //Verifico contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }

        //Genero el JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }
}

const renewToken = async(req, res) => {

    const uid = req.uid;

    //Genero el JWT
    const token = await generarJWT(uid);

    //Obtengo el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });
}

module.exports = {
    login,
    renewToken
}