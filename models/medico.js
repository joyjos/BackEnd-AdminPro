const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
});

//Configuración para sacar la _id como uid y extraer el __v y el password
MedicoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();

    return object;
});

module.exports = model('Medico', MedicoSchema);