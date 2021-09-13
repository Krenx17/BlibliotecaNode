'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "secret_key";

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(400).send({mesaje:"No tienes los permisas necesarios"});
    }

    var token = req.headers.authorization.replace(/['"]+/g,"")

    try{
        var payload = jwt.decode(token, secret)
        if( payload.exp <= moment().unix() ){
            return res.statu(401).send({mesaje: "El token ha expirado"});
        }
    }catch (error){
        return res.status(404).send({mesaje: "El token no es valido"})
    }
    
    req.user = payload;
    next();
}