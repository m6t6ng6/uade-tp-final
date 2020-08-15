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
// CATEGORIAS
//

// GET /categorias
app.get('/categorias', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_categoria, nombre FROM categorias ORDER BY id_categoria;";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

// GET /categorias/:id_categoria
app.get('/categorias/:id_categoria', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_provincia);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_categoria, nombre FROM categorias WHERE id_categoria = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        config_db.select_a_base_de_datos(query , get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_provincia tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    config_db.desconectar_db();
});

//
// PROVINCIAS
//

// GET /provincias
app.get('/provincias', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_provincia, nombre FROM provincias ORDER BY id_provincia;";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

// GET /provincias/:id_provincia
app.get('/provincias/:id_provincia', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_provincia);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_provincia, nombre FROM provincias WHERE id_provincia = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        config_db.select_a_base_de_datos(query , get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_provincia tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    config_db.desconectar_db();
});

// DELETE /provincias/:id_provincia
app.delete('/provincias/:id_provincia', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_provincia);
    var query = "DELETE FROM provincias WHERE id_provincia = ?;"
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

//
// MARCAS
//

// GET /marcas
app.get('/marcas', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_marca, nombre FROM marcas ORDER BY id_marca;";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

// GET /marcas/:id_marca
app.get('/marcas/:id_marca', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_marca);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_marca, nombre FROM marcas WHERE id_marca = ?";
        console.log("QUERY: [ " + query + " ]");
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_marca tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    config_db.desconectar_db();
});

// DELETE /marcas/:id_marca
app.delete('/marcas/:id_marca', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_marca);
    var query = "DELETE FROM marcas WHERE id_marca = ?;"
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

//
// PRODUCTOS
//

// GET /productos
app.get('/productos', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY id_producto;";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

// GET /productos/:id_producto
app.get('/productos/:id_producto', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_producto);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria WHERE id_producto = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_producto tiene que ser un entero.");
        res.send("ERROR: id_producto tiene que ser un entero.");
    }
    config_db.desconectar_db();
});

// POST /productos
app.post('/productos', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var i = 0;
    console.log("BODY: [ " + req.body + " ]");
    var post_usuario = [ req.body.nombre, req.body.id_categoria, req.body.id_marca, req.body.precio, req.body.descripcion ];
    var query = "INSERT INTO productos (nombre, id_categoria, id_marca, precio, descripcion) VALUES (?, ?, ?, ?, ?);";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + post_usuario + " ]");
    config_db.select_a_base_de_datos(query, post_usuario)
        .then(resultado => { var msg = 
"OK: [ msg: producto ingresado correctamente, affectedRows: \
" + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
        console.log(msg);
        res.send(msg);
        }, err => console.log(err))
    config_db.desconectar_db();
});

// PUT /productos/:id_producto
app.put('/productos/:id_producto', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var i = 0;
    var put_usuario = [ req.body.descripcion, req.body.id_categoria, req.body.id_marca, req.body.nombre, req.body.precio, req.params.id_producto ];
    var query = 
"UPDATE productos SET descripcion = ?, id_categoria = ?, id_marca = ?, nombre = ?, precio = ? WHERE id_producto = ?;";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
    config_db.select_a_base_de_datos(query, put_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: \
" + resultado.affectedRows + ", message: " + resultado.message + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err))
    config_db.desconectar_db();
});


// DELETE /productos/:id_producto
app.delete('/productos/:id_producto', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_producto);
    var query = "DELETE FROM productos WHERE id_producto = ?;"
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

//
// USUARIOS
//

// GET /usuarios
app.get('/usuarios', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', \
pass, telefono FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia ORDER BY id_usuario;";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /usuarios/:id_usuarios
app.get('/usuarios/:id_usuario', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_usuario);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE id_usuario = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_usuario tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    config_db.desconectar_db();
});

// POST /usuarios
app.post('/usuarios', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var i = 0;
    var post_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                         req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                         req.body.pass, req.body.telefono ];
    var query = 
"INSERT INTO usuarios (apellido, ciudad, direccion, dni, email, id_estado, \
id_provincia, nombre, pass, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + post_usuario + " ]");
    config_db.select_a_base_de_datos(query, post_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: usuario ingresado correctamente, affectedRows: " + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err));
    config_db.desconectar_db();
});

// PUT /usuarios/:id_usuario
app.put('/usuarios/:id_usuario', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var i = 0;
    var put_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                         req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                         req.body.pass, req.body.telefono, req.params.id_usuario ];
    var query = 
"UPDATE usuarios SET apellido = ?, ciudad = ?, direccion = ?, dni = ?, email = ?, \
id_estado = ?, id_provincia = ?, nombre = ?, pass = ?, telefono = ? WHERE id_usuario = ?;";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
    config_db.select_a_base_de_datos(query, put_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: " + resultado.affectedRows + "\
, message: " + resultado.message + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err));
    config_db.desconectar_db();
});

// DELETE /usuarios/:id_usuario
app.delete('/usuarios/:id_usuario', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_usuario);
    var query = "DELETE FROM usuarios WHERE id_usuario = ?;"
    console.log(query);
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

// ESCUCHA DE IP Y PUERTO
app.listen(port, (err, result) => {
    if (err) throw err;
    console.log('App escuchando en http://' + host + ':' + port);
});

inicio();

// CONEXION A BASE DE DATOS
function inicio() {
    var fecha = config_db.format_date();
    console.log('Inicio de aplicación. - ' + fecha);
}



