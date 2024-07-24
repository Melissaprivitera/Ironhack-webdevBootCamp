//1. cargamos express
const express = require('express');
const app = express();
const port = 3000;

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
const bcriptjs = require('bcryptjs');

//7. Variables de sesion
const session = require('express-session');
app.use(session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
}));

//8. cargamos módulo de conexión y establecemos rutas
const connection = require('./database/db');

//9. Establecemos las rutas
//app.get('/', (req, res)=>{
    //res.send("<h1>Index</h1>");
//    res.render('index', {msg: 'Melissa'});
//})

app.get('/login', (req, res)=>{
    //res.send("<h1>pagina de login</h1>");
    res.render('login');
});

app.get('/register', (req, res)=>{
    //res.send("<h1>Pagina de registro</h1>");
    res.render('register');
})
//Cargamos modulo de sweetalert
const swal = require("sweetalert2");

const { fileLoader } = require('ejs');

//10 registro
app.post('/register', async(req, res)=>{
    //variables para guardar la info de los campos
    const email = req.body.email;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;

    // variable donde guardamos el password pasado por hash
    let passwordHash = await bcriptjs.hash(pass, 8);
    connection.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
        if(results.length == 0){
            //insertamos los datos en nuestra bbdd
            connection.query('INSERT INTO users SET ?', {
                email: email,
                name: name,
                rol: rol,
                pass: passwordHash }, 
                async (error, results) => {
                    //console.log(results);
                    if(error){
                        console.log("error al escribir en la base de datos Numero: " + error);
                    }else{
                        //console.log("Alta exitosa");
                        res.render('register', {
                            alert: true,
                            alertTitle: "Registro",
                            alertMessage: "¡Registro exitoso!",
                            alertIcon:'success',
                            showConfirmButton: false,
                            timer: 1500,
                            ruta: ''
                        });
                    }
                }
            )
        } else {
            res.render('register', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "Ese usuario ya existe! Inténtalo otra vez",
                alertIcon: 'warning',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'register'
            });
        }
    })
            
})

//11. Metodo para autenticar el post definido como /auth
app.post('/auth', async(req, res)=> {
    const email = req.body.email;
    const pass = req.body.pass;
    let passwordHash = await bcriptjs.hash(pass, 8);
    
    //comprobamos si existe usuario y contraseña
    if(email && pass){
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=>{
            //comprobamos que exista el usuario
            if(results.length == 0 || !(await bcriptjs.compare(pass, results[0].pass)) ){
                //msj que la autenticación es incorrecta
                //res.send('<h1>Usuario o contraseña incorrecta</h1>');
                //console.log(error);
                res.render('login', {
                    alert: true,
                    alertTitle: "Login",
                    alertMessage: "Usuario o password incorrecto",
                    alertIcon:'error',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login'
                });
            } else {
                //msj que se ha autentificado correctamente
                //res.send('<h1>Logueado correctamente</h1>');
                //console.log(results);
                //creamos variable de sesion y le ponemos verdadero
                req.session.loggedin = true;
                //cargamos el nombre de la bbdd que hemos buscado
                req.session.name = results[0].name;

                res.render('login', {
                    alert: true,
                    alertTitle: "Login",
                    alertMessage: "Esta usted correctamente logueado!",
                    alertIcon:'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: '',
                });
            }
        });
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Ingrese email y contraseña",
            alertIcon:'warning',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'login',
        });
    }
});

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
    console.log('http://localhost:3000/')
})



