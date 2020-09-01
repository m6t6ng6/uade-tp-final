const path = require('path');
const config_db  = require('./config_db');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const cors = require('cors');
const { join } = require('path');
const { config } = require('process');
const { inherits } = require('util');

const app = express();
const host = process.env.APP_URL;    // URL de la APP
const port = process.env.APP_PORT;   // PUERTO de la APP
app.use(bodyParser.json());
app.options('*', cors());
app.use(cors());

const fecha_version = "AGO-2020";
const version = "Whales - TP UADE - Grupo 4 - " + fecha_version;

/// hace publico el acceso desde el front a la carpeta publico del back
const publicDirectory = path.join(__dirname, '../publico/');
app.use('/', express.static(publicDirectory));
app.use('/uploads', express.static('uploads'));

app.get('/version', (req, res) => {
    console.log("version: " + version);
    res.status(200).json({
        version: version
    });
});

// inicializacion de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');    // ATENCION: SIEMPRE CREAR LA CARPETA ANTES MANUALMENTE EN EL SERVIDOR !!! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !!!
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // acepto un archivo
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);
    // rechazo un archivo
    else cb(null, false);
}
const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5    // limite de 5 megas
    },
    fileFilter: fileFilter
    });   // carpeta donde se guarda en el backend las fotos (no es publica, hay que hacerla accesible estaticamente)



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
// ESTADOS
//

// GET /estados
app.get('/estados', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_estado, perfil FROM estados";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
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
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY id_producto;";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

// GET /productos/hits
app.get('/productos/hits', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY hits_usuario DESC LIMIT 1000";
    console.log("QUERY: [ " + query + " ] ");
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
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
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
// no permite modificar los hits_usuario para mantener integridad
app.post('/productos', upload.single('imagen'), (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    console.log(req.file);
    var post_usuario = [ req.body.nombre, req.body.id_categoria, req.body.id_marca, req.body.precio, req.body.descripcion, req.file.path ];
    var query = "INSERT INTO productos (nombre, id_categoria, id_marca, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?);";
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
    var put_usuario = [ req.body.descripcion, req.body.id_categoria, req.body.id_marca, req.body.nombre, req.body.precio, req.body.imagen, req.params.id_producto ];
    var query = 
"UPDATE productos SET descripcion = ?, id_categoria = ?, id_marca = ?, nombre = ?, precio = ?, imagen = ? WHERE id_producto = ?;";
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

// PUT /productos/:id_producto/hits
app.put('/productos/:id_producto/hits', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var i = 0;
    var put_usuario = [ req.body.hits_usuario, req.params.id_producto ];
    var query = 
"UPDATE productos SET hits_usuario = ? WHERE id_producto = ?;";
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
pass, telefono, imagen FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia ORDER BY id_usuario;";
    console.log("QUERY: [ " + query + " ]");
    config_db.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /usuarios/:email
// devuelve los usuarios con el correo :email
app.get('/usuarios/:email', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = req.params.email;
    var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE email = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        config_db.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    config_db.desconectar_db();
});

// GET /usuarios/:id_usuarios
app.get('/usuarios/:id_usuario', (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_usuario);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
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
app.post('/usuarios', upload.single('imagen'), (req, res) => {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('trabajo_final01');
    console.log(req.file);
    var post_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                         req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                         req.body.pass, req.body.telefono, req.file.path ];
    var query = 
"INSERT INTO usuarios (apellido, ciudad, direccion, dni, email, id_estado, \
id_provincia, nombre, pass, telefono, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
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
    var put_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                         req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                         req.body.pass, req.body.telefono, req.body.imagen, req.params.id_usuario ];
    var query = 
"UPDATE usuarios SET apellido = ?, ciudad = ?, direccion = ?, dni = ?, email = ?, \
id_estado = ?, id_provincia = ?, nombre = ?, pass = ?, telefono = ?, imagen = ? WHERE id_usuario = ?;";
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



