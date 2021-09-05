'use strict'

//varibales globales
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

//middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//cabeceras
app.use(cors())

//importación de rutas

//carga de rutas

//exportación de rutas
module.exports = app