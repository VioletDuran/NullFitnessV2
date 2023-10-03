const { Router } = require('express');
const gpt = Router();
const {generarRecomendacion} = require('../controllers/gpt.controller')


gpt.get('/rutinaGenerada',generarRecomendacion);

module.exports = gpt