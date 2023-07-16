const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Paciente = require('../models/paciente');
const Doctor = require('../models/doctor');
const Results = require('../models/points')

const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/signup', async(req, res) => {
  res.render("signup_pacient", {tituloServices : "mi titulo dinamico de servicios"})
})

router.post('/', async(req, res) => {
  const body = req.body
  console.log(body)

  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(body));
  const hashPaciente = hash.digest('hex');
  body.hash = hashPaciente;
  console.log(body)

  try {
    await Paciente.create(body)
    console.log(body)
    res.redirect(`paciente/${body.hash}/checkResults`)
  } catch (error) {
      console.log(error)
  }
})

router.post('/:hash/initResult', async(req, res) => {
  const body = req.body;

  console.log(body);

  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(body));
  const hashResult = hash.digest('hex');
  body.hash = hashResult;
  console.log(body)

  try {
    await Results.create(body)
    console.log(body)
    res.redirect(`./${body.hash}/test/4`)
  } catch (error) {
      console.log(error)
  }

})

router.get('/:hash/instrucciones', async(req, res) => {
  const hash = req.params.hash;
  
  try {
    const pacient = await Paciente.findOne({ hash });
    res.render("instrucciones", {
      name: pacient.name,
      hash: hash
    })
  }
  catch (error) {
  console.log(error)
  }
})

router.get('/:hash/test_instrucciones', async(req, res) => {
  res.render("test_instrucciones", {tituloServices : "mi titulo dinamico de servicios"})
})

router.post('/:hash/test_prueba', async(req, res) => {
  const number = req.body.number;
  const hash = req.params.hash;

  console.log(number);

  res.render("test_prueba", {
    n: number,
    hashPaciente: hash
  })

})

router.get('/:hash/checkResults', async(req, res) => {
  const hashPaciente = req.params.hash;

  console.log(hashPaciente);

  var paciente = await Paciente.findOne({hash: hashPaciente});

  try {
    if(await Paciente.find({ hash: hashPaciente })){
      var arrayResults = await Results.find({ user: hashPaciente });

      res.render("resultsPacient", {
        arrayResults: arrayResults
      })

    }
  } catch(error){
    console.log(error);
  }
})

router.get('/:hashPacient/:hashResult/test/:number', async(req, res) => {
  const hashPaciente = req.params.hashPacient;
  const hashResult = req.params.hashResult;
  const n = req.params.number;

  var resultObject = await Results.findOne({ hash: hashResult });

  res.render("test2", {
    hashPaciente: hashPaciente,
    timeDuration: resultObject.timeDuration,
    guesses: resultObject.guesses,
    failures: resultObject.failures,
    omissions: resultObject.omissions,
    points: resultObject.points,
    n : n
  })
})

router.get('/:hash/goodbye', async(req, res) => {
  res.render("goodbye");
})

router.post('/:hash/uploadResults', async(req, res) => {
  console.log("Hola");
  const body = req.body;

  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(body));
  const hashPuntos = hash.digest('hex');
  body.hash = hashPuntos;
  const finalHash = body.hash;

  try {
    const result = await Results.create(body);
    console.log(body);
    console.log('After update');
    const documentAfter = await Results.findOne({ hash: finalHash});
    console.log(documentAfter);
  } catch (error) {
      console.log(error)
  }
})

router.post('/:hashPacient/:hashResult/test/put', async(req, res) => {
  const filter = {hash: req.params.hashResult};
  const {number, timeDuration, guesses, failures, omissions, points} = req.body;

  try {
    // Update the MongoDB document with the new value
    const result = await Results.updateOne(filter, { $set: { timeDuration, guesses, failures, omissions, points } });

    if(number <=54){
      res.redirect(`./${number}`)
    } else {
      res.redirect('../../goodbye')
    }
  } catch (error) {
    console.log(error);
  }

})


router.post('/checkIfExists', async(req, res) => {
  const { email, password } = req.body;
  var espaciente=false;

  await Paciente.findOne({email, password})
    .then((paciente) => {
      if(paciente == null){
        console.log("Not a pacient");
      }
      else if(paciente != null){
        console.log("Its a pacient");
        espaciente=true;
        res.redirect(`/paciente/${paciente.hash}/checkResults`);
        return;
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error trying to login");
    });
  if(!espaciente){
    await Doctor.findOne({email, password})
      .then((doctor) => {
        if(doctor == null){
          console.log("Not a doctor either");
          //res.status(404).send("Acceso inválido. Por favor, inténtelo otra vez");
          res.redirect('/login?error=Acceso%20invalido.%20Por%20favor%20,%20intentelo%20otra%20vez.')
        }
        else if(doctor != null){
          console.log("Its a doctor");
          res.redirect(`/doctor/${doctor.hash}/home`);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error trying to login");
      });
  }

})

module.exports = router;