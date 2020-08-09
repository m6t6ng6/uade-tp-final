const config_db  = require('./config_db');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const host = "localhost";   // URL de la APP
const port = 5000;          // PUERTO de la APP
app.use(bodyParser.json());
app.options('*', cors());
app.use(cors());

const fecha_version = "AGO-2020";
const version = "Whales - TP UADE - Grupo 4 - " + fecha_version;

app.get('/version', (req, res) => {
    console.log("version requested: " + version);
    res.send(version);
});

app.get('/provincias', (req, res) => {
    arrayDeCampos = ['id_provincia', 'nombre'];
    //filtro = 'fecha_cotizacion LIKE "%" ORDER BY id_registro DESC LIMIT 1;';
    config_db.select_a_base_de_datos(arrayDeCampos, 'provincias')
        .then(resultado => res.send(resultado), err => console.log(err));
});

app.listen(port, (err, result) => {
    if (err) throw err;
    console.log('App escuchando en http://' + host + ':' + port);
});

inicio();

function inicio() {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var fecha = config_db.format_date();
    console.log('Inicio de aplicación. - ' + fecha);
}



