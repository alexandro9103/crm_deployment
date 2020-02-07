const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config({
    path: 'variables.env'
})


const app = express();



app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));


//carpeta estatica para servir las imagenes
app.use(express.static('uploads'));

const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        console.log("Origen: ", origin);
        console.log(process.env.FRONTEND_URL);
        //Revisar si la peticion viene desde un server en la whitelist
        const existe = whitelist.some(dominio => dominio === origin);
        if (existe) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions));


mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
})

console.log(process.env.DB_URL);


app.use('/', routes());


const host = process.env.HOST || '0.0.0.0';

const port = process.env.PORT || 5000;

app.listen(port, host, () => {
    console.log('El servidor esta corriendo en:', port);
})