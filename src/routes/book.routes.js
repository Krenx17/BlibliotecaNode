'use strict'

const express = require('express')
const controller = require('../controllers/book.controller')
var autenticated = require('../middlewares/authenticated')

var api = express.Router()
api.post('/create_book', autenticated.ensureAuth, controller.create)
api.put('/edit_book/:idBook', autenticated.ensureAuth, controller.edit)
api.delete('/delete_book/:idBook', autenticated.ensureAuth, controller.delet)
api.get('/all_book', controller.all)
api.get('/id_book/:idBook', controller.Id)
api.put('/buscado_book/:idBook', controller.busqueda)
api.get('/copias_book', controller.copias)
api.get('/disponibles_book', controller.disponibles)
api.post('/prestar_book/:idBook', autenticated.ensureAuth, controller.prestado)
api.post('/devolver_book/:idBook', autenticated.ensureAuth, controller.devolver)

module.exports = api