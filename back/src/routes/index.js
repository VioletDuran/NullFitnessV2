const { Router } = require('express');
const router = Router();
const {revisarCorreo,modificarDatos,devolverDatos,guardarFoto,upload,devolverRutinas, obtenerEjerciciosPrivados,obtenerEjerciciosTotales, devolverRutinasEspecifica,eliminarEjercicioDeRutina,anadirEjercicio,editarInfoRutinaPriv,guardarFotoRutina,devolverCoincidencias,eliminarEjercicioPublico,obtenerMusculosTotales,editarEjercicioPublico,guardarFotoEjercicio,guardarNuevoEjercicio,devolverRutinasPublicas,modificarRutinas,guardarFotoRutinaPub,eliminarRutinasPub,guardarNuevaRutinaPub,middleware,revisarEjercicioRutina,obtenerEjerciciosPrivadoUsuario,esCardio,anadirEjercicioCardio,modificarTiempo,modificarCarga} = require('../controllers/index.controller');

//Gets
router.get('/users/devolverDatos',middleware,devolverDatos);
router.get('/users/devolverRutinas',middleware, devolverRutinas);
router.get('/users/devolverRutinasEspecifica/:id',devolverRutinasEspecifica);
router.get('/users/obtenerEjerciciosPrivados/:id',obtenerEjerciciosPrivados);
router.get('/users/:correo',revisarCorreo);
router.get('/users/obtenerEjerciciosTotales/:id',obtenerEjerciciosTotales);
router.get('/users/devolverCoincidencias/:coincidencia',devolverCoincidencias);
router.get('/users/obtenerMusculosTotales/:id',obtenerMusculosTotales);
router.get('/users/devolverRutinasPublicas/:id',devolverRutinasPublicas);
router.get('/users/obtenerEjerciciosPrivadoUsuario/:id',obtenerEjerciciosPrivadoUsuario);
router.get('/users/esCardio/:id',middleware,esCardio)

//Posts
router.use('/users/', require('./user'));



router.post('/users/guardarFoto',middleware,upload.single("myFile"),guardarFoto);
router.post('/users/anadirEjercicio',middleware,anadirEjercicio);
router.post('/users/guardarFotoRutina',middleware,upload.single("myFile"),guardarFotoRutina);
router.post('/users/guardarFotoEjercicio',middleware,upload.single("myFile"),guardarFotoEjercicio);
router.post('/users/guardarFotoRutinaPub',middleware,upload.single("myFile"),guardarFotoRutinaPub);
router.post('/users/guardarNuevoEjercicio',middleware,guardarNuevoEjercicio);
router.post('/users/guardarNuevaRutinaPub',middleware,guardarNuevaRutinaPub);
router.post('/users/revisarEjercicioRutina',middleware,revisarEjercicioRutina);
router.post('/users/anadirEjercicioCardio',middleware,anadirEjercicioCardio);


//Puts
router.put('/users/modificarDatos',middleware,modificarDatos);
router.put('/users/editarInfoRutinaPriv',middleware,editarInfoRutinaPriv);
router.put('/users/modificarEjercicioPublico',middleware,editarEjercicioPublico);
router.put('/users/modificarRutinas',middleware,modificarRutinas);
router.put('/users/modificarTiempo',middleware,modificarTiempo);
router.put('/users/modificarCarga',middleware,modificarCarga);

//Delete
router.delete('/users/dataEliminarEjercicioRutina',middleware,eliminarEjercicioDeRutina);
router.delete('/users/EliminarEjercicioPublico',middleware,eliminarEjercicioPublico);
router.delete('/users/EliminarRutinasPub',middleware,eliminarRutinasPub);
module.exports = router;