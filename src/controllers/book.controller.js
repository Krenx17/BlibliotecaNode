'use strict'

const Book = require('../models/book.model')
const User = require('../models/user.model')

function create(req, res){
    var params = req.body;
    var bookModel = Book()

    if(req.res.rol = 'admin'){
        bookModel.tipo = params.tipo
        if (params.tipo === 'revista') {
            bookModel.frecuencia = params.frecuencia
        }
        bookModel.autor = params.autor
        bookModel.titulo = params.titulo
        bookModel.edicion = params.edicion
        bookModel.palabrasclave = params.palabrasclave
        bookModel.descripcion = params.descripcion
        bookModel.temas = params.temas
        bookModel.copias = params.copias
        bookModel.disponibles = params.copias
        bookModel.prestado = 0
        bookModel.prestados = 0
        bookModel.buscado = 0

        if(params.titulo && params.palabrasclave && params.temas && params.copias){
            if(params.copias>=1){
                bookModel.save((err, bookN)=>{
                    if(err) return res.status(500).send({mesaje:"Error en la petición"});
                    return res.status(200).send({bookN})
                })
            }else{
                return res.status(500).send({mesaje: 'No puedes poner 0 copias'})
            }
        }else{
            return res.status(500).send({mesaje: 'Hacen falta datos'})
        }
    }else{
        return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
    }
}

function edit(req, res){
    var params = req.body;
    var idBook = req.params.idBook

    delete params.prestado, params.prestados, params.buscado
    if(req.user.rol = 'admin'){
        Book.findById(idBook, (err, lib)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"});
            if(lib){
                if (lib.tipo === 'libro') {
                    delete params.frecuencia
                }
                params.disponibles = parseInt(params.copias)-lib.prestados
                Book.findByIdAndUpdate(idBook, params, {new:true}, (err, bookF)=>{
                    if(err) return res.status(500).send({mesaje:"Error en la petición"});
                    return res.status(200).send({bookF})
                })
            }else{
                return res.status(500).send({mesaje: 'No existe ese libro'})
            }
        })
    }else{
        return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
    }
}

function delet(req, res){
    var idBook = req.params.idBook

    if(req.user.rol = 'admin'){
        Book.findById(idBook, (err, libro)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"});
            if(libro){
                Book.findByIdAndDelete(idBook, (err, bookD)=>{
                    if(err) return res.status(500).send({mesaje:"Error en la petición"});
                    return res.status(200).send({mesaje: 'Se a eliminado el libro con exito'})
                })
            }else{
                return res.status(500).send({mesaje: 'No existe ese libro'})
            }
        })
    }else{
        return res.status(200).send({mesaje: 'No posees los permisos necesarios'})
    }
}

function all(req, res){
    Book.find((err, libros)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición"});
        return res.status(200).send({libros})
    })
}

function Id(req, res){
    var idBook = req.params.idBook

    Book.findById(idBook, (err, libro)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición"});
        return res.status(200).send({libro})
    })
}

function busqueda(req, res){
    var idBook = req.params.idBook
    var params = req.body

    Book.findById(idBook, (err, libro)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición"});
        params.buscado = libro.buscado + 1
        Book.findByIdAndUpdate(idBook, params, {new: true}, (err, lib)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"});
            if (lib) {
                return res.status(200).send({lib})
            }
        })
    })
}

function copias(req, res){
    Book.find((err, libros)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición"});
        return res.status(200).send({libros})
    }).sort({copias: -1})
}

function disponibles(req, res){
    Book.find((err, libros)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición"});
        return res.status(200).send({libros})
    }).sort({disponibles: -1})
}

function prestado(req, res){
    var idBook = req.params.idBook
    var params = req.body;

    User.findById(req.user.sub, (err, userF)=>{
        if (userF.prestados.length<10) {
            Book.findById(idBook, (err, lib)=>{
                if(err) return res.status(500).send({mesaje:"Error en la petición"});
                if (lib) {
                    params.prestado = lib.prestado + 1
                    params.prestados = lib.prestados + 1
                    params.disponibles = lib.disponibles - 1
                    if (lib.disponibles === 0) {
                        return res.status(500).send({mesaje: 'Este libro no esta disponible'})
                    }else{
                        User.findByIdAndUpdate(req.user.sub, {$push: {historial: {libro: idBook, tipo: 'libro'}, prestados: {libro: idBook, tipo: 'libro'}}}, (err, userE)=>{
                            if(err) return res.status(500).send({mesaje:"Error en la petición"});
                            if (userE) {
                                Book.findByIdAndUpdate(idBook, params, {new: true}, (err, bookU)=>{
                                    if(err) return res.status(500).send({mesaje:"Error en la petición"})
                                    if (bookU) {
                                        return res.status(200).send({userE})
                                    }
                                })
                            }
                        })
                    }
                }else{
                    return res.status(200).send({mesaje: 'No existe este libro'})
                }
            })
        }else{
            return res.status(500).send({mesaje: 'Ya prestaste 10 libros o revistas'})
        }
    })
}

function devolver(req, res){
    var idBook = req.params.idBook
    var params = req.body;

    User.findById(req.user.sub, (err, userF)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición"})
        if (userF.prestados.length>0) {
            Book.findById(idBook, (err, bookF)=>{
                if(err) return res.status(500).send({mesaje:"Error en la petición"})
                params.prestado = bookF.prestado - 1
                params.disponibles = bookF.disponibles + 1
                User.findByIdAndUpdate(req.user.sub, {$pull: {prestados: {libro: idBook}}}, (err, userU)=>{
                    if(err) return res.status(500).send({mesaje:"Error en la petición"})
                    Book.findByIdAndUpdate(idBook, params, {new: true}, (err, bookU)=>{
                        if(err) return res.status(500).send({mesaje:"Error en la petición"})
                        if (bookU) {
                            return res.status(200).send({userU})
                        }
                    })
                })
            })
        }else{
            return res.status(500).send({mesaje: 'No has prestado ningún libro'})
        }
    })
}

function palabras(req, res){}

function temas(req, res){}

module.exports = {
    create,
    edit,
    delet,
    all,
    Id,
    busqueda,
    copias,
    disponibles,
    prestado,
    devolver,
    palabras,
    temas
}