const express = require('express');
const router = express.Router();
const crypto = require('crypto');


const Results = require('../models/points')

router.post('/', async(req, res) => {
    console.log("Hola")
    const body = req.body

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(body));
    const hashPuntos = hash.digest('hex');
    body.hash = hashPuntos;
    const finalHash = body.hash;

    try {
      await Results.create(body)
      console.log(body)
      res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;