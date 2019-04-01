
const express = require('express')
const app = express()

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');



app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({},'nombre email role estado google img') //le puedo indicar qué campos mostrar en la consulta
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({}, (err, conteo) => { 
                res.json({
                    ok: true,
                    usuarios: usuariosDB,
                    cuantos: conteo
                })                
            })
        })

    //res.json({ nombre: 'german mencacci2', edad: 42, email: 'mencacci_german@hotmasil.com' })
});

app.post('/usuario', (req, res) => {

    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    //pick es una funcion de la libreria underscore que sirve 
    //para indicar qué campos quiero son aceptados en el post
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

app.delete('/usuario', (req, res) => {
    res.json('delete Uusuario')
})


module.exports = app;