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
const User_Routes = require('./src/routes/user.routes')
const Book_Routes = require('./src/routes/book.routes')

//carga de rutas
app.use('/api', User_Routes)
app.use('/api', Book_Routes)

//exportación de rutas
module.exports = app