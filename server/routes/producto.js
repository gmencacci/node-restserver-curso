const express = require('express');

const Producto = require('../models/producto');

const Categoria = require('../models/categoria');

const { verificaToken } = require('../middlewares/autentication');

const app = express();



app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde;
    desde = Number(desde);

    Producto.find({})
        .skip(desde)
        .limit(5)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            res.json({
                ok: true,
                productos
            });

        });
});

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!productoDB || productoDB.disponible === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    termino = new RegExp(termino, 'i');

    Producto.find({ nombre: termino })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            res.status(201).json({
                ok: true,
                productos
            });
        });
})

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })
    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });

});


app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.descripcion = body.descripcion;
        productoBD.disponible = body.disponible;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        })
    });
});


app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;


    Producto.findById({ _id: id, disponible: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        productoBD.disponible = false;

        productoBD.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(201).json({
                ok: true,
                producto: productoBorrado
            })
        });

        res.json({
            ok: true,
            producto: productoBD
        })

    });
});

/*
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let categoriaID = body.categoriaId;


    Categoria.findById(categoriaID, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de categoría no existe'
                }
            })
        }

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: Number(body.precio),
            descripcion: body.descripcion,
            categoria: categoriaBD._id,
            usuario: req.usuario._id
        })

        producto.save((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoBD
            })
        });
    });
});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findById(body.categoriaId, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de categoría no existe'
                }
            })
        }

        let producto = {
            nombre: body.nombre,
            precioUni: body.precio,
            descripcion: body.descripcion,
            categoria: body.categoriaId
        };


        Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoBD
            });
        });
    });
});



app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let producto = {
        disponible: false
    };

    Producto.findByIdAndUpdate({ _id: id, disponible: true }, producto, { new: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })

    });
});

*/
module.exports = app;