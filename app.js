const express = require('express');
const bodyParser = require('body-parser')

const app = express();

require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const port = 3000;

const mongoose = require('mongoose');

const user = process.env.USER;
const password = process.env.PASSWORD;
const dbname = process.env.DBNAME;

const uri = `mongodb+srv://${user}:${password}@tfg.bedrx56.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri).then(() => console.log('Base de datos conectada')).catch(e => console.log(e));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + "/public"))

app.use('/', require('./router/RutasWeb'));
app.use('/paciente', require('./router/Pacientes'))
app.use('/doctor', require('./router/Doctores'))
app.use('/points', require('./router/Points'))

app.use((req, res, next) => {
    res.status(404).render("404", {
        titulo404: "Error 404",
        descripcion404: "Página no encontrada"
    })
})

app.listen(port, () => {
    console.log('servidor a su servicio en el puerto ', port)
})
