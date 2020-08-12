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
    var query = "SELECT id_provincia, nombre FROM provincias ORDER BY id_provincia;";
    console.log(query);
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /provincias/:id_provincia
app.get('/provincias/:id_provincia', (req, res) => {
    var get_usuario = parseInt(req.params.id_provincia);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_provincia, nombre FROM provincias WHERE id_provincia = ?";
        console.log(query);
        config_db.select_a_base_de_datos(query , get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_provincia tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
});

// DELETE /provincias/:id_provincia
app.delete('/provincias/:id_provincia', (req, res) => {
    var del_usuario = parseInt(req.params.id_provincia);
    var query = "DELETE FROM provincias WHERE id_provincia = ?;"
    console.log(query);
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
});

//
// MARCAS
//

// GET /marcas
app.get('/marcas', (req, res) => {
    var query = "SELECT id_marca, nombre FROM marcas ORDER BY id_marca;";
    console.log(query);
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /marcas/:id_marca
app.get('/marcas/:id_marca', (req, res) => {
    var get_usuario = parseInt(req.params.id_marca);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_marca, nombre FROM marcas WHERE id_marca = ?";
        console.log(query);
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_marca tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
});

// DELETE /marcas/:id_marca
app.delete('/marcas/:id_marca', (req, res) => {
    var del_usuario = parseInt(req.params.id_marca);
    var query = "DELETE FROM marcas WHERE id_marca = ?;"
    console.log(query);
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
});

//
// PRODUCTOS
//

// GET /productos
app.get('/productos', (req, res) => {
    var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY id_producto;";
    console.log(query);
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /productos/:id_producto
app.get('/productos/:id_producto', (req, res) => {
    var get_usuario = parseInt(req.params.id_producto);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria WHERE id_producto = ?";
        console.log(query);
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
    console.log("BODY: [ " + req.body + " ]");
    // chequeo si existe la marca en la tabla marcas y busco su id_marca (si no existe, tira error), lo mismo con la categoria
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
                    var query = 
"INSERT INTO productos (nombre, id_categoria, id_marca, precio, descripcion) VALUES ('\
" + req.body.nombre + "','" + id_categoria + "','" + id_marca + "','" + req.body.precio + "','\
" + req.body.descripcion + "');"
                    console.log(query);
                    config_db.select_a_base_de_datos(query).then(resultado => {
                        var msg = 
"OK: [ msg: producto ingresado correctamente, affectedRows: \
" + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
                        console.log(msg);
                        res.send(msg);
                    }, err => console.log(err))
                }
            }, err => console.log(err));
});

// PUT /productos/:id_producto
app.put('/productos/:id_producto', (req, res) => {
    var i = 0;
    // chequeo si existe la marca en la tabla marcas y busco su id_marca (si no existe, tira error), lo mismo con la categoria
    var put_usuario = parseInt(req.params.id_producto);
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
                    var query = 
"UPDATE productos SET descripcion = '" + req.body.descripcion + "', id_categoria = '" + id_categoria + "\
', id_marca = '" + id_marca + "', nombre = '" + req.body.nombre + "', precio = " + req.body.precio + " WHERE id_producto = ?;";
                    console.log(query);
                    config_db.select_a_base_de_datos(query, put_usuario).then(resultado => {
                        var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: \
" + resultado.affectedRows + ", message: " + resultado.message + " ]";
                        console.log(msg);
                        res.send(msg);
                    }, err => console.log(err))
                }
            }, err => console.log(err));
});

// DELETE /productos/:id_producto
app.delete('/productos/:id_producto', (req, res) => {
    var del_usuario = parseInt(req.params.id_producto);
    var query = "DELETE FROM productos WHERE id_producto = ?;"
    console.log(query);
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
});

//
// USUARIOS
//

// GET /usuarios
app.get('/usuarios', (req, res) => {
    var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', \
pass, telefono FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia ORDER BY id_usuario;";
    console.log(query);
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /usuarios/:id_usuarios
app.get('/usuarios/:id_usuario', (req, res) => {
    var get_usuario = parseInt(req.params.id_usuario);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE id_usuario = ?";
        console.log(query);
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_usuario tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
});

// POST /usuarios
app.post('/usuarios', (req, res) => {
    var i = 0;
    // chequeo si existe el estado en la tabla estados y busco su id_estado (si no existe, tira error), lo mismo con la provincia
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
                    var query = 
"INSERT INTO usuarios (apellido, ciudad, direccion, dni, email, id_estado, \
id_provincia, nombre, pass, telefono) VALUES ('" + req.body.apellido + "','" + req.body.ciudad + "','\
" + req.body.direccion + "','" + req.body.dni + "','" + req.body.email + "','" + id_estado + "','\
" + id_provincia + "','" + req.body.nombre + "','" + req.body.pass + "','" + req.body.telefono + "');";
                    console.log(query);
                    config_db.select_a_base_de_datos(query).then(resultado => {
                        var msg = 
"OK: [ msg: usuario ingresado correctamente, affectedRows: " + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
                        console.log(msg);
                        res.send(msg);
                    }, err => console.log(err));
                }
            }, err => console.log(err));
});

// PUT /usuarios/:id_usuario
app.put('/usuarios/:id_usuario', (req, res) => {
    var i = 0;
    // chequeo si existe el estado en la tabla estados y busco su id_estado (si no existe, tira error), lo mismo con la provincia
    var put_usuario = parseInt(req.params.id_usuario);
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
                    var query = 
"UPDATE usuarios SET apellido = '" + req.body.apellido + "', ciudad = '" + req.body.ciudad + "\
', direccion = '" + req.body.direccion + "', dni = '" + req.body.dni + "', email = '\
" + req.body.email + "', id_estado = " + id_estado + ", id_provincia = " + id_provincia + ", nombre = '\
" + req.body.nombre + "', pass = '" + req.body.pass + "', telefono = '" + req.body.telefono + "' WHERE id_usuario = ?;"; 
                    console.log(query);
                    config_db.select_a_base_de_datos(query, put_usuario).then(resultado => {
                        var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: " + resultado.affectedRows + "\
, message: " + resultado.message + " ]";
                        console.log(msg);
                        res.send(msg);
                    }, err => console.log(err));
                }
            }, err => console.log(err));
});

// DELETE /usuarios/:id_usuario
app.delete('/usuarios/:id_usuario', (req, res) => {
    var del_usuario = parseInt(req.params.id_usuario);
    var query = "DELETE FROM usuarios WHERE id_usuario = ?;"
    console.log(query);
    config_db.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
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



