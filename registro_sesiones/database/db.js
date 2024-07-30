//cargamos el modulo mysql
const mysql = require('mysql');

console.log(process.env.DB_HOST);
console.log("llegamos aqui");

//creamos conexión a base de datos
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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