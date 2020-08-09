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
    config_db.select_a_base_de_datos(arrayDeCampos, 'provincias')
        .then(resultado => res.send(resultado), err => console.log(err));
});

app.get('/provincias/:id_provincia', (req, res) => {
    var get_usuario = parseInt(req.params.id_provincia);
    if (Number.isInteger(get_usuario)) {
        arrayDeCampos = ['id_provincia', 'nombre'];
        filtro = 'id_provincia = ?';
        config_db.select_a_base_de_datos(arrayDeCampos, 'provincias', filtro, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_provincia tiene que ser un entero.");
        res.send("ERROR: id_provincia tiene que ser un entero.");
    }
});

app.get('/marcas', (req, res) => {
    arrayDeCampos = ['id_marca', 'nombre'];
    config_db.select_a_base_de_datos(arrayDeCampos, 'marcas')
        .then(resultado => res.send(resultado), err => console.log(err));
});

app.get('/marcas/:id_marca', (req, res) => {
    var get_usuario = parseInt(req.params.id_marca);
    if (Number.isInteger(get_usuario)) {
        arrayDeCampos = ['id_marca', 'nombre'];
        filtro = 'id_marca = ?';
        config_db.select_a_base_de_datos(arrayDeCampos, 'marcas', filtro, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_marca tiene que ser un entero.");
        res.send("ERROR: id_marca tiene que ser un entero.");
    }
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



