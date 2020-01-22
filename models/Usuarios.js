const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const usuarioSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        trim: true,
        required: 'Agrega tu nombre'
    },
    password: {
        type: String,
        required: true
    }
});

const Usuario = mongoose.model('Usuarios', usuarioSchema);

module.exports = Usuario;