'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
const { use } = require("../routes/user.routes");
var secret="secret_key";

exports.createToken = function (user){
    var payload = {
        sub: user._id,
        user: user.user,
        name: user.name,
        rol: user.rol,
        iat: moment().unix(),
        exp: moment().day(10, "days").unix()
    }
    
    return jwt.encode(payload, secret);
}