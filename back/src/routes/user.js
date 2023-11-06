const { Router } = require('express');
const user = Router();
const {registrarUsuario,loginUsuario,guardarFoto,devolverDatos,revisarCorreo,modificarDatos,consultarCantidad,solicitarRecuperacion,guardarRecuperacion} = require('../controllers/user.controller')
const userExtractor = require('../middlewares/userExtractor')
const upload = require('../middlewares/upload')

//Gets
user.get('/devolverDatos',userExtractor,devolverDatos);
user.get('/:correo',revisarCorreo);





//Posts
user.post('/solicitar-recuperacion',solicitarRecuperacion);
user.post('/registro', registrarUsuario);
user.post('/login',loginUsuario);
user.post('/guardarFoto',userExtractor,upload.single("myFile"),guardarFoto);
user.post('/consultarCantidad',userExtractor,consultarCantidad);
user.post('/guardarRecuperacion',guardarRecuperacion);

//Puts
user.put('/modificarDatos',userExtractor,modificarDatos);

module.exports = user