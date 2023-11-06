const { Router } = require('express');
const gpt = Router();
const {generarRecomendacion,guardarRutina} = require('../controllers/gpt.controller');
const userExtractor = require('../middlewares/userExtractor');


gpt.post('/rutinaGenerada',userExtractor,generarRecomendacion);
gpt.post('/guardarRutinaGenerada',userExtractor,guardarRutina);

module.exports = gpt