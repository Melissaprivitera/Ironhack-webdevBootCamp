//1. cargamos express
const express = require('express');
const app = express();
const port = 3000;
const connection= require('./database/db.js');

connection.query

//2. Capturar datos del formulario usando formato json
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3. Cargamos dotenv y asignamos variables de entorno.
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

//4. cargamos el directorio public, cada vez que llamamos resources estaremos cargando el dir public.
//al utilizar el __dirname podemos mover el proyecto de carpeta y sin tener que actualizar rutas.
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5. Establecer el motor de plantilla
app.set('view engine', 'ejs');

//6. Cargamos bcriptjs
//const bcriptjs = require('bcryptjs');

//7. Variables de sesion
const session = require('express-session');
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}));

const rutas = require('./src/rutas.js');
//estableciendo el uso de rutas.
app.use('/', rutas);

const { fileLoader } = require('ejs');
const con = require('./database/db.js');

//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
    // si existe la variable que guarda la autenticación
    if (req.session.loggedin) {
    //renderizamos index,asignándole el nombre de usuario y la variable login con valor true
        res.render('index', {
            login: true,
            name: req.session.name
    }); 
    } else {
    //renderizamos index,asignándole el texto a name y la variable login con valor false
        res.render('index', {
            login: false,
            name:'Debe iniciar sesión', 
        }); 
    }
    res.end();
});

//13 - Logout
app.get('/logout', function (req, res) {
    //Destruye la sesión.
    req.session.destroy(() => {
    res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
    });
});

//14 - función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.listen(port, (req, res)=>{
    console.log("we are listening in port " + port);
    console.log('http://localhost:' + port + '/');
});