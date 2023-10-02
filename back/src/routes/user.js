const { Router } = require('express');
const user = Router();
const {registrarUsuario,loginUsuario,guardarFoto} = require('../controllers/user.controller')
const userExtractor = require('../middlewares/userExtractor')


user.post('/registro', registrarUsuario);
user.post('/login',loginUsuario);
user.post('/guardarFoto',userExtractor,upload.single("myFile"),guardarFoto);

module.exports = user