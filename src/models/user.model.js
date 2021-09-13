const moongose = require('mongoose')
var Schema = moongose.Schema

var UserSchema = Schema({
    carne: String,
    user: String,
    email: String,
    nombre: String,
    apellido: String,
    rol: String,
    pass: String,
    historial: [{
        _id: false,
        libro: {type: Schema.Types.ObjectId, ref: 'books'},
        tipo: String
    }],
    prestados: [{
        _id: false,
        libro: {type: Schema.Types.ObjectId, ref: 'books'},
        tipo: String
    }]
})

module.exports = moongose.model("users", UserSchema)