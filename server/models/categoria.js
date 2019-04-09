const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        require: [true, 'La descripción es necesaria'],
        unique: true
    },
    usuarioCreo: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    usuarioModifico: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('Categoria', categoriaSchema);