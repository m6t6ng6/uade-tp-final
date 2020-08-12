const config_db  = require('./config_db');
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const { join } = require('path');
const { config } = require('process');

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

//
// PROVINCIAS
//

// GET /provincias
app.get('/provincias', (req, res) => {
    var query = "SELECT id_provincia, nombre FROM provincias;";
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /provincias/:id_provincia
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

//
// MARCAS
//

// GET /marcas
app.get('/marcas', (req, res) => {
    var query = "SELECT id_marca, nombre FROM marcas;";
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /marcas/:id_marca
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

//
// PRODUCTOS
//

// GET /productos
app.get('/productos', (req, res) => {
    var query = "SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
                precio, c.nombre AS 'categoria', descripcion \
                FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
                JOIN categorias c ON p.id_categoria = c.id_categoria;";
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /productos/:id_producto
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

// POST /productos
app.post('/productos', (req, res) => {
    var i = 0;
    console.log(req.body);
    // chequeo si existe la marca en la tabla marcas y busco su id_marca (si no existe, tira error)
    var query1 = "SELECT id_marca, nombre FROM marcas WHERE nombre = '" + req.body.marca + "'";
    var query2 = "SELECT id_categoria, nombre FROM categorias WHERE nombre = '" + req.body.categoria + "'";
    config_db.select_a_base_de_datos(query1)
        .then(resultado => {
            if (resultado[0].nombre === req.body.marca) { id_marca = resultado[0].id_marca; i++; };
        }, err => console.log(err))
        .then(resultado => config_db.select_a_base_de_datos(query2), err => console.log(err))
            .then(resultado => {
                if (resultado[0].nombre === req.body.categoria) { id_categoria = resultado[0].id_categoria; i++; };
            }, err => console.log(err))
            .then(resultado => {
                if (i === 0) {
                    var msg = "ERROR: [ msg: la marca no existe, debe añadirla primero ]";
                    console.log(msg);
                    res.send(msg);
                } else if (i === 1) {
                    var msg = "ERROR: [ msg: la categoria no existe, debe añadirla primero ]";
                    console.log(msg);
                    res.send(msg);
                } else if (i === 2) {
                    var query = "INSERT INTO productos (nombre, id_categoria, id_marca, precio, descripcion) VALUES ('" + req.body.nombre + "','" + id_categoria + "','" + id_marca + "','" + req.body.precio + "','" + req.body.descripcion + "');"
                    console.log(query);
                    config_db.select_a_base_de_datos(query).then(resultado => {
                        var msg = "OK: [ msg: producto ingresado correctamente, affectedRows: " + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
                        console.log(msg);
                        res.send(msg);
                    }, err => console.log(err))
                }
            }, err => console.log(err));
});

//
// USUARIOS
//

// GET /usuarios
app.get('/usuarios', (req, res) => {
    var query = "SELECT id_usuario, u.nombre, apellido, email, dni, \
                ciudad, direccion, estado AS permiso, p.nombre AS 'provincia', \
                pass, telefono FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
                JOIN provincias p ON u.id_provincia = p.id_provincia;";
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /usuarios/:id_usuarios
app.get('/usuarios/:id_usuario', (req, res) => {
    var get_usuario = parseInt(req.params.id_usuario);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_usuario, u.nombre, apellido, email, dni, \
                    ciudad, direccion, estado AS permiso, p.nombre AS 'provincia', pass, telefono \
                    FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
                    JOIN provincias p ON u.id_provincia = p.id_provincia WHERE id_usuario = ?";
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_usuario tiene que ser un entero.");
        res.send("ERROR: id_usuario tiene que ser un entero.");
    }
});

// POST /usuarios
app.post('/usuarios', (req, res) => {
    var i = 0;
    console.log(req.body);
    // chequeo si existe la marca en la tabla marcas y busco su id_marca (si no existe, tira error)
    var query1 = "SELECT id_estado, estado FROM estados WHERE estado = '" + req.body.estado + "'";
    var query2 = "SELECT id_provincia, nombre FROM provincias WHERE nombre = '" + req.body.provincia + "'";
    config_db.select_a_base_de_datos(query1)
        .then(resultado => {
            if (resultado[0].estado === req.body.estado) { id_estado = resultado[0].id_estado; i++; };
        }, err => console.log(err))
        .then(resultado => config_db.select_a_base_de_datos(query2), err => console.log(err))
            .then(resultado => {
                if (resultado[0].nombre === req.body.provincia) { id_provincia = resultado[0].id_provincia; i++; };
            }, err => console.log(err))
            .then(resultado => {
                if (i === 0) {
                    var msg = "ERROR: [ msg: el estado del usuario no existe ]";
                    console.log(msg);
                    res.send(msg);
                } else if (i === 1) {
                    var msg = "ERROR: [ msg: la provincia no existe, verifique el nombre ]";
                    console.log(msg);
                    res.send(msg);
                } else if (i === 2) {
                    var query = "INSERT INTO usuarios (apellido, ciudad, direccion, dni, email, id_estado, id_provincia, nombre, pass, telefono) VALUES ('" + req.body.apellido + "','" + req.body.ciudad + "','" + req.body.direccion + "','" + req.body.dni + "','" + req.body.email + "','" + id_estado + "','" + id_provincia + "','" + req.body.nombre + "','" + req.body.pass + "','" + req.body.telefono + "');";
                    console.log(query);
                    config_db.select_a_base_de_datos(query).then(resultado => {
                        var msg = "OK: [ msg: usuario ingresado correctamente, affectedRows: " + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
                        console.log(msg);
                        res.send(msg);
                    }, err => console.log(err));
                }
            }, err => console.log(err));
});

// ESCUCHA DE IP Y PUERTO
app.listen(port, (err, result) => {
    if (err) throw err;
    console.log('App escuchando en http://' + host + ':' + port);
});

inicio();

// CONEXION A BASE DE DATOS
function inicio() {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var fecha = config_db.format_date();
    console.log('Inicio de aplicación. - ' + fecha);
}



