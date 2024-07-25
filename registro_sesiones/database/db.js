//cargamos el modulo mysql
const mysql = require('mysql');

//creamos conexión a base de datos
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'login_node_curso',
});
con.connect((error) => {
    if(error){
        console.log('hay un error de tipo ' + error);
        return;
    } else {
        console.log('conexión a la base de datos exitosa');
    }
})

//exportamos el módulo de conección.
module.exports = con;