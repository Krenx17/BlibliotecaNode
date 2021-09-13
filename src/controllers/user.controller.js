'use strict'

const User = require('../models/user.model')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../service/jwt')

function login(req, res){
    var params = req.body;

    User.findOne({user: params.usuario}, (err, obtainedUser)=>{
        if (err) return res.status(500).send({mesaje:"Error en la petición"});
        if(obtainedUser){
            bcrypt.compare(params.password, obtainedUser.pass,(err,correctPass)=>{
                if(correctPass){
                    if(params.getToken === "true"){
                        return res.status(200).send({token: jwt.createToken(obtainedUser)});
                    } else{
                        obtainedUser.password=undefined;
                        return res.status(200).send({ obtainedUser });
                    }
                }else{
                    return res.status(404).send({mesaje: "El usuario no se ha podido identificar"})
                }
            })
        }else{
            return res.status(404).send({mesaje: "El usuario no existe"})
        }
    })
}

function create(req, res){
    var userModel = User()
    var params = req.body;

    if(params.carne && params.email && params.nombre && params.apellido && params.password){
        User.find({ $or: [
            {carne: params.carne}
        ]}).exec((err, userF)=>{
            if(userF && userF.length>1){
                if (err) return res.status(500).send({mesaje:"Error en la petición"});
                return res.status(500).send({mesaje: "Ya existe un usuario con ese carne"})
            }else{
                params.apellido = params.apellido+' '

                userModel.carne = params.carne
                userModel.email = params.email
                userModel.nombre = params.nombre
                userModel.apellido = params.apellido
                userModel.user = (params.nombre).charAt(0)+(params.apellido).substring(0, (params.apellido).indexOf(' '))+'-'+params.carne
                userModel.rol = 'user'
                userModel.historial = []
                userModel.prestados = []

                bcrypt.hash(params.password, null, null, (err, encryptpass)=>{
                    userModel.pass = encryptpass
                    userModel.save((err, saveUser)=>{
                        if(err) return res.status(500).send({mesaje:"Error en la petición"});
                        if(saveUser){
                            return res.status(200).send({saveUser})
                        }
                    })
                })
            }
            
        })
    }else{
        return res.status(500).send({mesaje: 'Hacen falta datos'})
    }
}

function createuser(req, res){
    var userModel = User()
    var params = req.body;

    if(params.carne && params.email && params.nombre && params.apellido && params.password){
        User.find({ $or: [
            {carne: params.carne},
            {email: params.email}
        ]}).exec((err, userF)=>{
            if(userF && userF.length>1){
                if (err) return res.status(500).send({mesaje:"Error en la petición"});
                return res.status(500).send({mesaje: "Ya existe un usuario con ese carne o ese correo"})
            }else{
                params.apellido = params.apellido+' '

                userModel.carne = params.carne
                userModel.email = params.email
                userModel.nombre = params.nombre
                userModel.apellido = params.apellido
                userModel.user = (params.nombre).charAt(0)+(params.apellido).indexOf(' ')+'_'+params.carne
                userModel.rol = params.rol
                userModel.historial = []
                userModel.prestados = []

                bcrypt.hash(params.password, null, null, (err, encryptpass)=>{
                    userModel.pass = encryptpass
                    userModel.save((err, saveUser)=>{
                        if(err) return res.status(500).send({mesaje:"Error en la petición"});
                        if(saveUser){
                            return res.status(200).send({saveUser})
                        }
                    })
                })
            }
            
        })
    }else{
        return res.status(500).send({mesaje: 'Hacen falta datos'})
    }
}

function edit(req, res){
    var params = req.body;
    var idUser = req.params.idUser
    params.apellido = params.apellido+' '

    delete params.pass, params.historial, params.prestados
    if(req.user.rol === 'admin'){
        User.findById(idUser, (err, userF1)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"})
            if(userF1){
                if(userF1.rol === 'admin'){
                    return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
                }else{
                    //Se cambia automaticamente usuario segun los datos que se envien 
                    if(params.carne){
                        params.user = (userF1.nombre).charAt(0)+(userF1.apellido).substring(0, (userF1.apellido).indexOf(' '))+'_'+params.carne

                        if(params.nombre){
                            params.user = (params.nombre).charAt(0)+(userF1.apellido).substring(0, (userF1.apellido).indexOf(' '))+'_'+params.carne
                        }
                        if(params.apellido){
                            params.user = (userF1.nombre).charAt(0)+(params.apellido).substring(0, (params.apellido).indexOf(' '))+'_'+params.carne
                        }
                        if(params.nombre && params.apellido){
                            params.user = (params.nombre).charAt(0)+(params.apellido).substring(0, (params.apellido).indexOf(' '))+'_'+params.carne
                        }
                        User.find({$or: [
                            {carne: params.carne}
                        ]}).exec((err, userF)=>{
                            if(err) return res.status(500).send({mesaje:"Error en la petición"})
                            if(userF && userF.length>=1){
                                userF.forEach(x => {
                                    if (x._id = idUser) {
                                        User.findByIdAndUpdate(idUser, params, {new:true}, (err, userU)=>{
                                            if(err) return res.status(500).send({mesaje:"Error en la petición"});
                                            return res.status(200).send({userU})
                                        })
                                    }else{
                                        return res.status(500).send({mesaje: "Ya existe un usuario con ese carne o ese correo"}) 
                                    }
                                });
                            }else{
                                User.findByIdAndUpdate(idUser, params, {new:true}, (err, userU)=>{
                                    if(err) return res.status(500).send({mesaje:"Error en la petición"});
                                    return res.status(200).send({userU})
                                })
                            }
                        })
                    }else{
                        if(params.nombre){
                            params.user = (params.nombre).charAt(0)+(userF1.apellido).substring(0, (userF1.apellido).indexOf(' '))+'_'+userF1.carne
                        }
                        if(params.apellido){
                            params.user = (userF1.nombre).charAt(0)+(params.apellido).substring(0, (params.apellido).indexOf(' '))+'_'+userF1.carne
                        }
                        User.findByIdAndUpdate(idUser, params, {new:true}, (err, userU)=>{
                            if(err) return res.status(500).send({mesaje:"Error en la petición"});
                            return res.status(200).send({userU})
                        })
                    }
                }
            }else{
                return res.status(500).send({mesaje: 'El usuario no existe'})
            }
        })
    }else{
        return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
    }
}

function delet(req, res){
    var idUser = req.params.idUser

    if(req.user.rol === 'admin'){
        User.findByIdAndDelete(idUser, (err, userD)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"});
            return res.status(200).send({mesaje: 'El usuario se a eliminado con exito'})
        })
    }else{
        return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
    }
}

function all(req, res){
    if(req.user.rol === 'admin'){
        User.find((err, users)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"});
            return res.status(200).send({users})
        })
    }else{
        return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
    }
}

function Id(req, res){
    var idUser = req.params.idUser

    if(req.user.rol === 'admin' || req.user.sub === idUser){
        User.findById(idUser, (err, userF)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"})
            return res.status(200).send({userF})
        })
    }else{
        return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
    }
}

function prestado(req, res){
    if (req.user.sub) {
        User.findById(req.user.sub, (err, userF)=>{
            //**/ */
        })
    }else{
        return res.status(500).send({mesaje: 'Debes ingresar a tu cuenta primero'})
    }
}

function historial(req, res){
    if (req.user.sub) {
        //
    }else{
        return res.status(500).send({mesaje: 'Debes ingresar a tu cuenta primero'})
    }
}

module.exports = {
    login,
    create,
    createuser,
    edit,
    delet,
    all,
    Id,
    prestado,
    historial
}