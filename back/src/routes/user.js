const { Router } = require('express');
const user = Router();
const {registrarUsuario,loginUsuario} = require('../controllers/user.controller')


user.post('/registro', registrarUsuario);
user.post('/login',loginUsuario);

module.exports = user