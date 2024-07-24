const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    //res.send("hello World");
    res.send('<h1>HOLA MUNDO</h1>');
})

app.listen(port, () => {
    console.log("Example app listening on port " + port)
})