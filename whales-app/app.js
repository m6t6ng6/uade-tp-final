const cron = require('node-cron');
const config_db  = require('./config_db');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const host = process.env.APP_URL;
const port = process.env.APP_PORT;
app.use(bodyParser.json());
app.options('*', cors());
app.use(cors());

const version = "Dolar Hoy - Version 0.2 beta - Fernando Bustamante - JUL-2020";

app.get('/version', function(req, res) {
    console.log("version requested: " + version);
    res.send(version);
});

app.get('/vivo', function(req, res) {
    arrayDeCampos = ['id_registro', 'cotizacion', 'fecha_cotizacion'];
    filtro = 'fecha_cotizacion LIKE "%" ORDER BY id_registro DESC LIMIT 1;';
    config_db.select_a_base_de_datos(arrayDeCampos, 'historico', filtro)
        .then(resultado => res.send(resultado), err => console.log(err)); 
});

app.get('/anterior', function(req, res) {
    arrayDeCampos = ['id_registro', 'cotizacion', 'fecha_cotizacion'];
    filtro = 'fecha_cotizacion LIKE "%" ORDER BY id_registro DESC LIMIT 1,1;';
    config_db.select_a_base_de_datos(arrayDeCampos, 'historico', filtro)
        .then(resultado => res.send(resultado), err => console.log(err)); 
});

app.get('/inicioDelDia', function(req, res) {
    arrayDeCampos = ['id_registro', 'cotizacion', 'fecha_cotizacion'];
    filtro = 'DATE(fecha_cotizacion) LIKE CURDATE() LIMIT 1;';
    config_db.select_a_base_de_datos(arrayDeCampos, 'historico', filtro)
        .then(resultado => res.send(resultado), err => console.log(err)); 
});

app.get('/maximoDelDia', function(req, res) {
    arrayDeCampos = ['MAX(cotizacion) AS maximo'];
    filtro = 'DATE(fecha_cotizacion) LIKE CURDATE();';
    config_db.select_a_base_de_datos(arrayDeCampos, 'historico', filtro)
        .then(resultado => res.send(resultado), err => console.log(err)); 
});

app.get('/minimoDelDia', function(req, res) {
    arrayDeCampos = ['MIN(cotizacion) AS minimo'];
    filtro = 'DATE(fecha_cotizacion) LIKE CURDATE();';
    config_db.select_a_base_de_datos(arrayDeCampos, 'historico', filtro)
        .then(resultado => res.send(resultado), err => console.log(err)); 
});

app.get('/datosHistoricoChart', function(req, res) {
    arrayDeCampos = ['*'];
    filtro = 'id_registro LIKE "%" ORDER BY id_registro DESC LIMIT 100;';
    config_db.select_a_base_de_datos(arrayDeCampos, 'historico', filtro)
        .then(resultado => res.send(resultado), err => console.log(err)); 
});

app.listen(port, function(err, result) {
    if (err) throw err;
    console.log('App escuchando en http://' + host + ':' + port);
});

inicio();

function inicio() {
    config_db.conectar_a_mysql();
    config_db.conectar_a_base_de_datos('dolar_hoy');
    var fecha = config_db.format_date();
    console.log('Inicio de aplicación. - ' + fecha);
    //valor_del_dolar_insert_en_mysql();
}

//cron.schedule('* * * * *', () => {
// 9.30am, 11.30am, 12.30pm, 1.30pm, 3.30pm, 5.30pm ART
cron.schedule('30 12,14,15,16,18,20 * * Mon,Tue,Wed,Thu,Fri', () => {
    var fecha = config_db.format_date();
    console.log('Tomando valor del dolar, vuelta periodica (actualización). - ' + fecha);
    valor_del_dolar_insert_en_mysql();
});

function valor_del_dolar_insert_en_mysql () {
    /* 
    * https://currencylayer.com/quickstart
    * plan: gratuita hasta 250 req/mo 
    */
    const http = require('http');
    const options = {
        host: 'api.currencylayer.com',
        path: '/live?access_key=634738f605b4a7bce267a2c5475a4876'
    };

    var req = http.get(options, (res) => {
        console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', (chunk) => {
            bodyChunks.push(chunk);
        }).on('end', () => {
            var body = bodyChunks.join('');
            cotizacion = JSON.parse(body).quotes.USDARS;
            console.log(cotizacion);
            //console.log('BODY: ' + body);
            arrayDeCampos = ['cotizacion', 'fecha_cotizacion'];
            fecha = config_db.format_date();
            arrayDeValores = [cotizacion, fecha];
            config_db.insert_a_base_de_datos('historico', arrayDeCampos, arrayDeValores);
        })
    });

    req.on('error', (e) => {
        console.log('ERROR: ' + e.message);
    });
}


