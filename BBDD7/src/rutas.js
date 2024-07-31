const express = require('express');
const rutas = express.Router();
const bcriptjs = require('bcryptjs');
const connectionbd = require('../database/db.js');

rutas.get('/login', (req, res)=>{
    //res.send("<h1>pagina de login</h1>");
    res.render('login');
});

rutas.get('/register', (req, res)=>{
    //res.send("<h1>Pagina de registro</h1>");
    res.render('register');
});

rutas.post('/register', async(req, res)=>{
    //variables para guardar la info de los campos
    const email = req.body.email;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;

    // variable donde guardamos el password pasado por hash
    let passwordHash = await bcriptjs.hash(pass, 8);
    connectionbd.query('SELECT * FROM users WHERE email = ?', [email], async(error, result) => {
        console.log(error);
        if(result.length == 0){
            //insertamos los datos en nuestra bbdd
            connectionbd.query('INSERT INTO users SET ?', {
                email: email,
                name: name,
                rol: rol,
                pass: passwordHash }, 
                async (error, result) => {
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
            
});

//11. Metodo para autenticar el post definido como /auth
rutas.post('/auth', async(req, res)=> {
    const email = req.body.email;
    const pass = req.body.pass;
    let passwordHash = await bcriptjs.hash(pass, 8);
    
    //comprobamos si existe usuario y contraseña
    if(email && pass){
        connectionbd.query('SELECT * FROM users WHERE email = ?', [email], async (error, result, fields)=>{
            console.log(error);
            //comprobamos que exista el usuario
            if((result.length == 0) || !(await bcriptjs.compare(pass, result[0].pass)) ){
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
                req.session.name = result[0].name;

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
rutas.get('/', (req, res)=> {
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

module.exports = rutas;