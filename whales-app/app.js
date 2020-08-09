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
    var query = "SELECT id_provincia, nombre FROM provincias;";
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

app.get('/provincias/:id_provincia', (req, res) => {
    var get_usuario = parseInt(req.params.id_provincia);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_provincia, nombre FROM provincias WHERE id_provincia = ?";
        config_db.select_a_base_de_datos(query , get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_provincia tiene que ser un entero.");
        res.send("ERROR: id_provincia tiene que ser un entero.");
    }
});

app.get('/marcas', (req, res) => {
    var query = "SELECT id_marca, nombre FROM marcas;";
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

app.get('/marcas/:id_marca', (req, res) => {
    var get_usuario = parseInt(req.params.id_marca);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_marca, nombre FROM marcas WHERE id_marca = ?";
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_marca tiene que ser un entero.");
        res.send("ERROR: id_marca tiene que ser un entero.");
    }
});

app.get('/productos', (req, res) => {
    var query = "SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
                precio, c.nombre AS 'categoria', descripcion \
                FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
                JOIN categorias c ON p.id_categoria = c.id_categoria;";
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

app.get('/productos/:id_producto', (req, res) => {
    var get_usuario = parseInt(req.params.id_producto);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
        precio, c.nombre AS 'categoria', descripcion \
        FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
        JOIN categorias c ON p.id_categoria = c.id_categoria WHERE id_producto = ?";
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_producto tiene que ser un entero.");
        res.send("ERROR: id_producto tiene que ser un entero.");
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



