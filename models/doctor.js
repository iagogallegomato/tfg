const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
    name: String,
    dni: String,
    email: String,
    password: String,
    hash: String
})

//crear modelo

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;