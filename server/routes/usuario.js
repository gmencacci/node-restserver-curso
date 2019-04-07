const express = require('express')
const app = express()

const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');


//obtiene una lista de usuario
app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email role estado google img') //le puedo indicar qué campos mostrar en la consulta
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
});


//crea un registro usuario
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


//modifica un registro usuario
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    //pick es una funcion de la libreria underscore que sirve 
    //para indicar qué campos son aceptados en el post
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let opciones = { new: true, runValidators: true };

    Usuario.findByIdAndUpdate(id, body, opciones, (err, usuarioDB) => {
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

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }




        res.json(200, {
            ok: true,
            usuarioBorrado
        })

    })

    //res.json('delete Uusuario')
})


module.exports = app;