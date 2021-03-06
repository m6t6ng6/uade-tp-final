const path = require('path');
const f = require('./funciones_app.js');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secreto = process.env.SECRET;  // SECRETO de BCRYPT

const cors = require('cors');
const { join } = require('path');
const { config, nextTick } = require('process');
const { inherits } = require('util');

const app = express();
const host = process.env.APP_URL;    // URL de la APP
const port = process.env.APP_PORT;   // PUERTO de la APP
app.use(bodyParser.json());
app.options('*', cors());
app.use(cors());

const fecha_version = "OCT-2020";
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
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_categoria, nombre FROM categorias ORDER BY id_categoria;";
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

// GET /categorias/:id_categoria
app.get('/categorias/:id_categoria', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_provincia);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_categoria, nombre FROM categorias WHERE id_categoria = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        f.select_a_base_de_datos(query , get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_provincia tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    f.desconectar_db();
});

//
// PROVINCIAS
//

// GET /provincias
app.get('/provincias', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_provincia, nombre FROM provincias ORDER BY id_provincia;";
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

// GET /provincias/:id_provincia
app.get('/provincias/:id_provincia', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_provincia);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_provincia, nombre FROM provincias WHERE id_provincia = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        f.select_a_base_de_datos(query , get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_provincia tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    f.desconectar_db();
});

// DELETE /provincias/:id_provincia
app.delete('/provincias/:id_provincia', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_provincia);
    var query = "DELETE FROM provincias WHERE id_provincia = ?;"
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

//
// MARCAS
//

// GET /marcas
app.get('/marcas', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_marca, nombre FROM marcas ORDER BY id_marca;";
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

// GET /marcas/:id_marca
app.get('/marcas/:id_marca', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_marca);
    if (Number.isInteger(get_usuario)) {
        var query = "SELECT id_marca, nombre FROM marcas WHERE id_marca = ?";
        console.log("QUERY: [ " + query + " ]");
        f.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_marca tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    f.desconectar_db();
});

// DELETE /marcas/:id_marca
app.delete('/marcas/:id_marca', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_marca);
    var query = "DELETE FROM marcas WHERE id_marca = ?;"
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

//
// ESTADOS
//

// GET /estados
app.get('/estados', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = "SELECT id_estado, perfil FROM estados";
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

//
// PRODUCTOS
//

// GET /productos
app.get('/productos', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY id_producto;";
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

// GET /productos/hits
app.get('/productos/hits', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY hits_usuario DESC LIMIT 1000";
    console.log("QUERY: [ " + query + " ] ");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

// GET /productos/:id_producto
app.get('/productos/:id_producto', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_producto);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_producto, m.nombre AS 'marca', p.nombre AS 'nombre', \
precio, c.nombre AS 'categoria', descripcion, hits_usuario, imagen \
FROM productos p JOIN marcas m ON p.id_marca = m.id_marca \
JOIN categorias c ON p.id_categoria = c.id_categoria WHERE id_producto = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        f.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        console.log("ERROR: id_producto tiene que ser un entero.");
        res.send("ERROR: id_producto tiene que ser un entero.");
    }
    f.desconectar_db();
});

// POST /productos
// no permite modificar los hits_usuario para mantener integridad
app.post('/productos', upload.single('imagen'), (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    console.log(req.file);
    var post_usuario = [ req.body.nombre, req.body.id_categoria, req.body.id_marca, req.body.precio, req.body.descripcion, req.file.path ];
    var query = "INSERT INTO productos (nombre, id_categoria, id_marca, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?);";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + post_usuario + " ]");
    f.select_a_base_de_datos(query, post_usuario)
        .then(resultado => { var msg = 
"OK: [ msg: producto ingresado correctamente, affectedRows: \
" + resultado.affectedRows + ", insertId: " + resultado.insertId + " ]";
        console.log(msg);
        res.send(msg);
        }, err => console.log(err))
    f.desconectar_db();
});

// PUT /productos/:id_producto
app.put('/productos/:id_producto', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var put_usuario = [ req.body.descripcion, req.body.id_categoria, req.body.id_marca, req.body.nombre, req.body.precio, req.body.imagen, req.params.id_producto ];
    var query = 
"UPDATE productos SET descripcion = ?, id_categoria = ?, id_marca = ?, nombre = ?, precio = ?, imagen = ? WHERE id_producto = ?;";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
    f.select_a_base_de_datos(query, put_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: \
" + resultado.affectedRows + ", message: " + resultado.message + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err))
    f.desconectar_db();
});

// PUT /productos/:id_producto/hits
app.put('/productos/:id_producto/hits', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var put_usuario = [ req.body.hits_usuario, req.params.id_producto ];
    var query = 
"UPDATE productos SET hits_usuario = ? WHERE id_producto = ?;";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
    f.select_a_base_de_datos(query, put_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: \
" + resultado.affectedRows + ", message: " + resultado.message + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err))
    f.desconectar_db();
});

// DELETE /productos/:id_producto
app.delete('/productos/:id_producto', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_producto);
    var query = "DELETE FROM productos WHERE id_producto = ?;"
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

//
// USUARIOS
//

// GET /usuarios
app.get('/usuarios', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', \
pass, telefono, imagen FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia ORDER BY id_usuario;";
    console.log("QUERY: [ " + query + " ]");
    f.select_a_base_de_datos(query)
        .then(resultado => res.send(resultado), err => console.log(err));
});

// GET /usuarios/:email
// devuelve los usuarios con el correo :email
app.get('/usuarios/:email', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = req.params.email;
    var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE email = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        f.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});

// GET /usuarios/:id_usuarios
app.get('/usuarios/:id_usuario', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var get_usuario = parseInt(req.params.id_usuario);
    if (Number.isInteger(get_usuario)) {
        var query = 
"SELECT id_usuario, u.nombre, apellido, email, dni, \
ciudad, direccion, estado, p.nombre AS 'provincia', pass, telefono, imagen \
FROM usuarios u JOIN estados e ON u.id_estado = e.id_estado \
JOIN provincias p ON u.id_provincia = p.id_provincia WHERE id_usuario = ?";
        console.log("QUERY: [ " + query + " ], VARIABLES: [ " + get_usuario + " ]");
        f.select_a_base_de_datos(query, get_usuario)
            .then(resultado => res.send(resultado), err => console.log(err));
    } else {
        var msg = "ERROR: [ msg: id_usuario tiene que ser un entero ]";
        console.log(msg);
        res.send(msg);
    }
    f.desconectar_db();
});

// modelo
// POST /usuarios
app.post('/usuarios', upload.single('imagen'), async (req, res, next) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var codigo = Math.random().toString(36).substring(2, 10);    // crea codigo de 8 caracteres aleatorios
    var fechaCreacionCodigo = f.format_date();           // fecha en la que fue creado el codigo
    let passEncriptado = await bcrypt.hash(req.body.pass, 10);
    var post_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                         req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                         passEncriptado, req.body.telefono, req.file.path, codigo, fechaCreacionCodigo ];
    var query = 
"INSERT INTO usuarios (apellido, ciudad, direccion, dni, email, id_estado, \
id_provincia, nombre, pass, telefono, imagen, codigo, codigo_validez) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    console.log({ query: query, variables: post_usuario });
    f.select_a_base_de_datos(query, post_usuario, async function (error, result) {
        if (error) throw error;
        insertID = await result.insertId;
        const token = jwt.sign({id: insertID}, secreto, {
            expiresIn: 60*60*2 //tiempo en segundos
        });
        var msg = { auth: true, token: token, status: "201", msg: "usuario creado correctamente", affectedRows: result.affectedRows, insertId: result.insertId };
        console.log(msg);
        res.status(201).json(msg);
        var texto = "Bienvenido a Whales. Ingresá a http://whales.matanga.net.ar/validacion y pegá este código de validación para habilitar tu cuenta: " + codigo + ". Recordá que el código tiene validez por 12 horas.";
        f.enviar_correo("Whales", req.body.email, "Whales correo de Validación", texto);
        //}, err => { res.status(500).json(err); console.log(err) });
    }).then(resultado => {}, err => { res.status(500).json(err); console.log(err) });
    f.desconectar_db();
});

// POST /usuarios/validacion
app.post('/usuarios/validacion', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var fechaActual = new Date();     // fecha y hora de cuando se coloca el codigo recibido
    var post_usuario = [ req.body.codigo, req.body.email, req.body.pass ];
    query = "SELECT id_usuario, email, pass, imagen, codigo, codigo_validez FROM usuarios WHERE codigo = ? AND email = ? AND pass = ?;";
    console.log({ query: query, variables: post_usuario });
    f.select_a_base_de_datos(query, post_usuario)
        .then(resultado => {
            if ( resultado.length > 0 ) {
                if ( resultado[0].codigo != "validado" && resultado[0].codigo === req.body.codigo && resultado[0].email === req.body.email && resultado[0].pass === req.body.pass ) {
                    var diff = (fechaActual - new Date(resultado[0].codigo_validez)) / (1000 * 60 * 60);    // coeficiente de diferencia entre fechas medido en horas (ej: 1.5 significa que paso 1 hora y media)
                    if ( diff < 12 ) {
                        query = "UPDATE usuarios SET codigo = 'validado' WHERE id_usuario = " + resultado[0].id_usuario + ";";
                        f.select_a_base_de_datos(query)
                            .then(resultado => {
                                var msg = { status: 202, msg: "usuario validado" };
                                var texto = "Tu código fue validado satisfactoriamente. Disfrutá comprar y vender en un sólo lugar rápido, fácil y seguro.";
                                f.enviar_correo("Whales", req.body.email, "Bienvenido a Whales", texto);
                                console.log(msg);
                                res.status(201).json(msg);
                            }, err => { res.status(500).json(err); console.log(err) });
                    } else {   // si es mayor a 12 horas la introduccion del codigo, se crea un codigo nuevo y se envia nuevamente al cliente para que valide
                        var codigo = Math.random().toString(36).substring(2, 10);    // crea codigo de 8 caracteres aleatorios
                        var fechaCreacionCodigo = f.format_date();           // fecha en la que fue creado el codigo
                        query = "UPDATE usuarios SET codigo = '" + codigo + "', codigo_validez = '" + fechaCreacionCodigo + "' WHERE id_usuario = " + resultado[0].id_usuario + ";";
                        f.select_a_base_de_datos(query)
                            .then(resultado => {
                                var msg = { status: 401, msg: "no autorizado" };
                                var texto = "Bienvenido a Whales. Ingresá a http://whales.matanga.net.ar/validacion y pegá este código de validación para habilitar tu cuenta: " + codigo + ". Recordá que el código tiene validez por 12 horas.";
                                f.enviar_correo("Whales", req.body.email, "Bienvenido a Whales", texto);
                                console.log(msg);
                                res.status(201).json(msg);
                            }, err => { res.status(500).json(err); console.log(err) });
                    }
                } else {
                    var msg = { status: 401, msg: "no autorizado" };
                    console.log(msg);
                    res.status(201).json(msg);
                }
            } else if ( resultado.length === 0 ) {
                var msg = { status: 401, msg: "no autorizado" };
                console.log(msg);
                res.status(201).json(msg); 
            }
        }, err => { res.status(500).json(err); console.log(err) });
});

// PUT /usuarios/:id_usuario
app.put('/usuarios/:id_usuario', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var put_usuario = [ req.body.apellido, req.body.ciudad, req.body.direccion, req.body.dni,
                         req.body.email, req.body.id_estado, req.body.id_provincia, req.body.nombre,
                         req.body.pass, req.body.telefono, req.body.imagen, req.params.id_usuario ];
    var query = 
"UPDATE usuarios SET apellido = ?, ciudad = ?, direccion = ?, dni = ?, email = ?, \
id_estado = ?, id_provincia = ?, nombre = ?, pass = ?, telefono = ?, imagen = ? WHERE id_usuario = ?;";
    console.log("QUERY: [ " + query + " ], VARIABLES: [ " + put_usuario + " ]");
    f.select_a_base_de_datos(query, put_usuario)
        .then(resultado => {
            var msg = 
"OK: [ msg: producto modificado correctamente, affectedRows: " + resultado.affectedRows + "\
, message: " + resultado.message + " ]";
            console.log(msg);
            res.send(msg);
            }, err => console.log(err));
    f.desconectar_db();
});

// DELETE /usuarios/:id_usuario
app.delete('/usuarios/:id_usuario', (req, res) => {
    f.conectar_a_mysql();
    f.conectar_a_base_de_datos('trabajo_final01');
    var del_usuario = parseInt(req.params.id_usuario);
    var query = "DELETE FROM usuarios WHERE id_usuario = ?;"
    console.log(query);
    f.select_a_base_de_datos(query, del_usuario)
        .then(resultado => res.send(resultado), err => console.log(err));
    f.desconectar_db();
});



// ESCUCHA DE IP Y PUERTO
app.listen(port, (err, result) => {
    if (err) throw err;
    console.log('App escuchando en http://' + host + ':' + port);
});

inicio();

// CONEXION A BASE DE DATOS
function inicio() {
    var fecha = f.format_date();
    console.log('Inicio de aplicación. - ' + fecha);
}