'use strict'

const express = require('express')
const UserController = require('../controllers/user.controller')
var authentication  = require('../middlewares/authenticated')

var api = express.Router()
api.post('/login', UserController.login)
api.post('/register', UserController.create)
api.post('/create_user', authentication.ensureAuth, UserController.createuser)
api.put('/edit_user/:idUser', authentication.ensureAuth, UserController.edit)
api.delete('/delete_user/:idUser', authentication.ensureAuth, UserController.delet)
api.get('/all_users', authentication.ensureAuth, UserController.all)
api.get('/idUser/:idUser', authentication.ensureAuth, UserController.Id)

module.exports = api