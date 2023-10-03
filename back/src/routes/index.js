const { Router } = require('express');
const router = Router();
const userExtractor = require('../middlewares/userExtractor')
const upload = require('../middlewares/upload')
const {revisarCorreo,modificarDatos,devolverDatos,devolverRutinas, obtenerEjerciciosPrivados,obtenerEjerciciosTotales, devolverRutinasEspecifica,eliminarEjercicioDeRutina,anadirEjercicio,editarInfoRutinaPriv,guardarFotoRutina,devolverCoincidencias,eliminarEjercicioPublico,obtenerMusculosTotales,editarEjercicioPublico,guardarFotoEjercicio,guardarNuevoEjercicio,devolverRutinasPublicas,modificarRutinas,guardarFotoRutinaPub,eliminarRutinasPub,guardarNuevaRutinaPub,revisarEjercicioRutina,obtenerEjerciciosPrivadoUsuario,esCardio,anadirEjercicioCardio,modificarTiempo,modificarCarga} = require('../controllers/index.controller');

//Gets
router.get('/users/devolverDatos',userExtractor,devolverDatos);
router.get('/users/devolverRutinas',userExtractor, devolverRutinas);
router.get('/users/devolverRutinasEspecifica/:id',devolverRutinasEspecifica);
router.get('/users/obtenerEjerciciosPrivados/:id',obtenerEjerciciosPrivados);
router.get('/users/:correo',revisarCorreo);
router.get('/users/obtenerEjerciciosTotales/:id',obtenerEjerciciosTotales);
router.get('/users/devolverCoincidencias/:coincidencia',devolverCoincidencias);
router.get('/users/obtenerMusculosTotales/:id',obtenerMusculosTotales);
router.get('/users/devolverRutinasPublicas/:id',devolverRutinasPublicas);
router.get('/users/obtenerEjerciciosPrivadoUsuario/:id',obtenerEjerciciosPrivadoUsuario);
router.get('/users/esCardio/:id',userExtractor,esCardio)

router.use('/gpt/',require('./gpt'));

//Posts
router.use('/users/', require('./user'));




router.post('/users/anadirEjercicio',userExtractor,anadirEjercicio);
router.post('/users/guardarFotoRutina',userExtractor,upload.single("myFile"),guardarFotoRutina);
router.post('/users/guardarFotoEjercicio',userExtractor,upload.single("myFile"),guardarFotoEjercicio);
router.post('/users/guardarFotoRutinaPub',userExtractor,upload.single("myFile"),guardarFotoRutinaPub);
router.post('/users/guardarNuevoEjercicio',userExtractor,guardarNuevoEjercicio);
router.post('/users/guardarNuevaRutinaPub',userExtractor,guardarNuevaRutinaPub);
router.post('/users/revisarEjercicioRutina',userExtractor,revisarEjercicioRutina);
router.post('/users/anadirEjercicioCardio',userExtractor,anadirEjercicioCardio);


//Puts
router.put('/users/modificarDatos',userExtractor,modificarDatos);
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