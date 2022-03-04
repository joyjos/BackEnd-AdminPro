const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const { response } = require('express');

const getMedicos = async(req, res) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    });
}

const getMedicoById = async(req, res) => {

    //Obtengo el id
    const id = req.params.id;

    try {

        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }


}

const crearMedico = async(req, res) => {

    const { nombre, hospital } = req.body;

    try {

        /* //Me aseguro que es un id de hospital
        const exitId = await Hospital.exists({ _id: hospital._id });
        console.log(exitId);

        if (!exitId) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        } */

        //Compruebo que el nombre del médico no esté ya registrado (nombre único)
        const existeNombre = await Medico.findOne({ nombre });

        if (existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre ya está registrado'
            });
        }

        const uid = req.uid;
        const medico = new Medico({
            usuario: uid,
            ...req.body
        });

        //Guardo el médico
        await medico.save();

        res.json({
            ok: true,
            medico: medico
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }

}

const actualizarMedico = async(req, res) => {

    //Obtengo el id
    const id = req.params.id;

    //Obtengo el hospital
    const hospital = req.body.hospital;

    //Obtengo el uid del token
    const uid = req.uid;

    try {

        //Compruebo que existe el médico (si no existe no puedo actualizarlo)
        const existeMedico = await Medico.findById(id);

        if (!existeMedico) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un médico por ese id'
            });
        }

        //Compruebo que existe el hospital
        const existeHospital = await Hospital.findById(hospital);

        if (!existeHospital) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        //Actualizo el médico
        //const {...campos } = req.body;

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }

}

const borrarMedico = async(req, res) => {

    //Obtengo el id
    const id = req.params.id;

    try {

        //Me aseguro que existe el médico (no puedo borrar algo que no existe)
        const existeMedico = await Medico.findById(id);

        if (!existeMedico) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un médico por ese id'
            });
        }

        //Borro médico
        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico borrado'
        });

    } catch (error) {

    }

}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}