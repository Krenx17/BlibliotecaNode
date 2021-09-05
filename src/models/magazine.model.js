const moongose = require('mongoose')
var Schema = moongose.Schema

var MagazineSchema = Schema({
    autor: String,
    frecuencia: String,
    titulo: String,
    edicion: String,
    palabrasclave: String,
    descripcion: String,
    temas: String,
    copias: Number,
    disponibles: Number,
    prestado: Number,
    buscado: Number
})

module.exports = moongose.model("magazines", MagazineSchema)