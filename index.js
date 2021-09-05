'use strict'

const moongose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const app = require('./app')
const User = require('./src/models/user.model')

moongose.Promise = global.Promise
moongose.connect("mongodb://localhost:27017/biblioteca", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    app.listen(3000, function (){
        var userModel = User()
        User.find({$or: [{user: "adminpractica"}]}).exec((err, usernew)=>{
            if (usernew, usernew.length>=1){
                console.log('Ya existe un administrador creado')
            }else{
                userModel.user = "adminpractica"
                userModel.rol = "admin"
                bcrypt.hash("adminpractica", null, null, (err, encryptpass)=>{
                    userModel.pass = encryptpass
                    userModel.save((err, saveUser)=>{
                        if(saveUser){
                            console.log("Se creo el usuario Admin")
                        }
                    })
                })
            }
        })
    })
}).catch(err=>console.log(err));