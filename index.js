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

const whitelist = [process.env.FRONTEND_URL,process.env.URL_IMG];
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
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


app.use('/', routes());

//carpeta estatica para servir las imagenes
app.use(express.static('uploads'));

const host = process.env.HOST || '0.0.0.0';

const port = process.env.PORT || 5000;

app.listen(port,host, () => {
    console.log('El servidor esta corriendo en:',port);
})