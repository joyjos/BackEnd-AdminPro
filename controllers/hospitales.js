const Hospital = require("../models/hospital");

const getHospitales = async(req, res) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    });
}

const crearHospital = async(req, res) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        /* const exitId = await Hospital.exists({ _id: body.hospital._id });

        if (!exitId) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        } */

        //Guardo el hospital
        await hospital.save();

        res.json({
            ok: true,
            hospital: hospital
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }

}

const actualizarHospital = async(req, res) => {

    //Obtengo el id
    const id = req.params.id;

    //Obtengo el uid del token
    const uid = req.uid;

    try {

        //Compruebo que existe el hospital (si no existe no puedo actualizarlo)
        const existeHospital = await Hospital.findById(id);

        if (!existeHospital) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        //Actualizo el hospital
        //const {...campos } = req.body;

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }

}

const borrarHospital = async(req, res) => {

    //Obtengo el uid
    const id = req.params.id;

    try {

        //Me aseguro que existe el hospital (no puedo borrar algo que no existe)
        const existeHospital = await Hospital.findById(id);

        if (!existeHospital) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        //Borro hospital
        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Hospital borrado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}