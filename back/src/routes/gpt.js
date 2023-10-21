const { Router } = require('express');
const gpt = Router();
const {generarRecomendacion,guardarRutina} = require('../controllers/gpt.controller')


gpt.post('/rutinaGenerada',generarRecomendacion);
gpt.post('/guardarRutinaGenerada',guardarRutina);

module.exports = gpt