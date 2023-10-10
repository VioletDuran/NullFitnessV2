const { Router } = require('express');
const router = Router();
const userExtractor = require('../middlewares/userExtractor')
const upload = require('../middlewares/upload')
const {eliminarEjercicioDeRutina,editarInfoRutinaPriv,eliminarEjercicioPublico,editarEjercicioPublico,modificarRutinas,eliminarRutinasPub,modificarTiempo,modificarCarga} = require('../controllers/index.controller');

//Gets
router.use('/users/', require('./user'));

//router.get('/users/devolverRutinas',userExtractor, devolverRutinas); //Devolver rutina privada de usuario - RUTA: rutina
router.use('/rutina',require('./rutina'));
//router.get('/users/devolverRutinasEspecifica/:id',devolverRutinasEspecifica); //Devolver rutina en especifico - RUTA: rutina
//router.get('/users/obtenerEjerciciosPrivados/:id',obtenerEjerciciosPrivados); //Devolver ejercicios espeficificos de una rutina - RUTA: rutina
//router.get('/users/obtenerEjerciciosTotales/:id',obtenerEjerciciosTotales); //Devolver todos los ejercicios junto a sus musculos - RUTA: ejercicio
router.use('/ejercicio',require('./ejercicio'));

//router.get('/users/devolverCoincidencias/:coincidencia',devolverCoincidencias); // Devolver busqueda de ejercicios - RUTA: ejercicio
//router.get('/users/obtenerMusculosTotales/:id',obtenerMusculosTotales); //Devolver todos los musculos de un ejercicio - RUTA: ejercicio
//router.get('/users/devolverRutinasPublicas/:id',devolverRutinasPublicas); //Devolver todas las rutinas publcas - RUTA: rutina
//router.get('/users/obtenerEjerciciosPrivadoUsuario/:id',obtenerEjerciciosPrivadoUsuario); //Devoler ejercicios de una rutina en especifico - RUTA: rutina 
//router.get('/users/esCardio/:id',userExtractor,esCardio) //Devolver los musculos de un ejercicio en espeficico (ANTES SE LLAMABA ES CARDIO) - RUTA: ejercicio

router.use('/gpt/',require('./gpt'));


//router.post('/users/anadirEjercicio',userExtractor,anadirEjercicio); //Agregar un ejercicio a una rutina - RUTA: rutina 
//router.post('/users/guardarFotoRutina',userExtractor,upload.single("myFile"),guardarFotoRutina); //Agregar foto de rutina - RUTA: rutina
//router.post('/users/guardarFotoEjercicio',userExtractor,upload.single("myFile"),guardarFotoEjercicio); //Agregar foto de ejercicio - RUTA: ejercicio 
//router.post('/users/guardarFotoRutinaPub',userExtractor,upload.single("myFile"),guardarFotoRutinaPub); //Agregar foto de rutina publica - RUTA: rutina
//router.post('/users/guardarNuevoEjercicio',userExtractor,guardarNuevoEjercicio); //Agregar un ejercicio nuevo - RUTA: ejercicio 
//router.post('/users/guardarNuevaRutinaPub',userExtractor,guardarNuevaRutinaPub); //Agregar una rutina publica - RUTA: rutina 
//router.post('/users/revisarEjercicioRutina',userExtractor,revisarEjercicioRutina); //Verificar si un ejercicio esta presente en una rutina - RUTA:  ejercicio
//router.post('/users/anadirEjercicioCardio',userExtractor,anadirEjercicioCardio); // Agregar un ejercicio de cardio a una rutina - RUTA: rutina 


//Puts
router.put('/users/editarInfoRutinaPriv',userExtractor,editarInfoRutinaPriv);
router.put('/users/modificarEjercicioPublico',userExtractor,editarEjercicioPublico);
router.put('/users/modificarRutinas',userExtractor,modificarRutinas);
router.put('/users/modificarTiempo',userExtractor,modificarTiempo);
router.put('/users/modificarCarga',userExtractor,modificarCarga);

//Delete
router.delete('/users/dataEliminarEjercicioRutina',userExtractor,eliminarEjercicioDeRutina);
router.delete('/users/EliminarEjercicioPublico',userExtractor,eliminarEjercicioPublico);
router.delete('/users/EliminarRutinasPub',userExtractor,eliminarRutinasPub);
module.exports = router;