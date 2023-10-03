const { Router } = require('express');
const user = Router();
const {registrarUsuario,loginUsuario,guardarFoto,devolverDatos,revisarCorreo} = require('../controllers/user.controller')
const userExtractor = require('../middlewares/userExtractor')
const upload = require('../middlewares/upload')

//Gets
user.get('/devolverDatos',userExtractor,devolverDatos);
user.get('/:correo',revisarCorreo);


//Post
user.post('/registro', registrarUsuario);
user.post('/login',loginUsuario);
user.post('/guardarFoto',userExtractor,upload.single("myFile"),guardarFoto);

module.exports = user