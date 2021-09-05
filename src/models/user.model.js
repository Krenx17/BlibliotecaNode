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
        libro: String
    }],
    prestados: [{
        libro: String
    }]
})

module.exports = moongose.model("users", UserSchema)