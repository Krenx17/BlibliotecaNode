'use strict'

const User = require('../models/user.model')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../service/jwt')

function login(req, res){
    var params = req.body;

    User.findOne({user: params.usuario}, (err, obtainedUser)=>{
        if (err) return res.status(500).send({mesaje:"Error en la petición"});
        if(obtainedUser){
            bcrypt.compare(params.password, obtainedUser.password,(err,correctPass)=>{
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
    var Modeluser = User()
    var params = req.body;

    if(params.carne && params.nombre && params.apellido){
        User.find({ $or: [
            {carne: params.carne,
            email: params.email}
        ]}).exec((err, userF)=>{
            if(userF && userF>1){
                if (err) return res.status(500).send({mesaje:"Error en la petición"});
                return res.status(500).send({mesaje: "Ya existe un usuario con ese carne o ese correo"})
            }else{
                Modeluser.carne = params.carne
                Modeluser.email = params.email
                Modeluser.nombre = params.nombre
                Modeluser.apellido = params.apellido
                Modeluser.user = (params.nombre).charAt(0)+(params.apellido).indexOf(' ')+params.carne
                if (res.user.rol === 'admin'){
                    Modeluser.rol = params.rol
                }else{
                    Modeluser.rol = 'user'
                }
                Modeluser.historial = []
                Modeluser.prestados = []

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

function edit(req, res){}

function delet(req, res){}

function all(req, res){}

function Id(req, res){}

function prestado(req, res){}

function historial(req, res){}

module.exports = {
    login,
    create,
    edit,
    delet,
    all,
    Id,
    prestado,
    historial
}