const mongoose = require('mongoose')
var Schema = mongoose.Schema

var BookSchema = Schema({
    tipo: String,
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
    prestados: Number,
    buscado: Number
})

module.exports = mongoose.model("books", BookSchema)