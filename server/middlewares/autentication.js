const jwt = require('jsonwebtoken');

//==============================================
// Verifica Token
//==============================================

let verificaToken = (req, res, next) => {

    //obtengo el parametro llamado 'token que viene en el header'
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(501).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    })
}


//==============================================
// Verifica AdminRole
//==============================================
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        //return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}


module.exports = {
    verificaToken,
    verificaAdmin_Role
}