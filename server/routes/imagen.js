const express = require('express');
const path = require('path');
const fs = require('fs');
const { verificaTokenImg } = require('../middlewares/autentication');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noPathImage = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noPathImage);
    }

});

module.exports = app;