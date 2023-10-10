const { Router } = require('express');
const ejercicio = Router();
const userExtractor = require('../middlewares/userExtractor')
const {obtenerEjerciciosTotales,devolverCoincidencias,obtenerMusculosTotales,obtenerMusculosEjercicios,guardarFotoEjercicio,guardarNuevoEjercicio,revisarEjercicioRutina} = require('../controllers/ejercicio.controller')
const upload = require('../middlewares/upload')

//Gets
ejercicio.get('/obtenerEjerciciosTotales',obtenerEjerciciosTotales); //Devolver todos los ejercicios junto a sus musculos - RUTINA: ejercicios
ejercicio.get('/devolverCoincidencias/:coincidencia',devolverCoincidencias);
ejercicio.get('/obtenerMusculosTotales',obtenerMusculosTotales); //Devolver todos los musculos de un ejercicio - RUTA: ejercicio
ejercicio.get('/obtenerMusculosEjercicios/:id',userExtractor,obtenerMusculosEjercicios) //Devolver los musculos de un ejercicio en espeficico (ANTES SE LLAMABA ES CARDIO) - RUTA: ejercicio

//POST
ejercicio.post('/guardarFotoEjercicio',userExtractor,upload.single("myFile"),guardarFotoEjercicio); //Agregar foto de ejercicio - RUTA: ejercicio 
ejercicio.post('/guardarNuevoEjercicio',userExtractor,guardarNuevoEjercicio); //Agregar un ejercicio nuevo - RUTA: ejercicio 
ejercicio.post('/revisarEjercicioRutina',userExtractor,revisarEjercicioRutina); //Verificar si un ejercicio esta presente en una rutina - RUTA:  ejercicio


module.exports = ejercicio