const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Doctor = require('../models/doctor')
const Paciente = require('../models/paciente')
const Results = require('../models/points')

router.get('/signup', (req, res) => {
  res.render("signup_doctor", {tituloServices : "mi titulo dinamico de servicios"})
})

router.get('/:hash/home', async (req, res) => {

    const hashDoctor = req.params.hash;

    try {

        const arrayPacientesDB = await Paciente.find({ ['doctor']: hashDoctor })

        res.render("doctor", {
            arrayPacientes: arrayPacientesDB
        })

    } catch(error) {
        console.log(error)
    }

})

router.get('/:hash/assign', async(req, res) => {
  console.log("WE GOT IN")
  const hashDoctor = req.params.hash;
  try {

    const arrayPacientesNA = await Paciente.find({ doctor: "Not Assigned" });

    res.render("assign", {
      arrayPacientes: arrayPacientesNA,
      hashDoctor: hashDoctor
    })

  } catch(error) {
    console.log(error)
  }

})

router.post('/:hash/checkResults', async(req, res) => {
  const hashPaciente = req.body.hash;
  const hashDoctor = req.params.hash;

  const paciente = await Paciente.findOne({hash: hashPaciente});

  try {
    if(await Paciente.find({ doctor: hashDoctor, hash: hashPaciente})){
      const arrayResults = await Results.find({ user: hashPaciente });

      res.render("results", {
        arrayResults: arrayResults,
        namePaciente:  paciente.name
      })

    }
  } catch(error){
    console.log(error);
  }
})

router.post('/:hash/assignToMe', async (req, res) => {
  const key = "doctor"; // Key you want to update
  const value = req.params.hash; // New value for the key
  const filter = {hash: req.body.hashPaciente};

  try {
    // Update the MongoDB document with the new value
    const result = await Paciente.updateOne(filter, { $set: { doctor: value } });

    res.redirect(`/doctor/${req.params.hash}/assign`)
  } catch (error) {
    res.status(500).json({ error: 'Error updating the key' });
  }
});

router.post('/', async(req, res) => {
    const body = req.body;
    console.log(body);

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(body));
    const hashPaciente = hash.digest('hex');
    body.hash = hashPaciente;
    const finalHash = body.hash;

    try {
      const result = await Doctor.create(body);
      const insertedId = result.insertedID;
      res.redirect(`/doctor/${finalHash}/home`)
    } catch (error) {
        console.log('error', error)
    }
})

module.exports = router;