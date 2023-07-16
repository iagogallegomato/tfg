const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
    name: String,
    dni: String,
    email: String,
    password: String,
    hash: String,
    doctor: {
        type: String,
        default: 'Not Assigned'
    }
})

//crear modelo

const Paciente = mongoose.model('Pacientes', PacienteSchema);


module.exports = Paciente;