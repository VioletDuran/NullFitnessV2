const { Router } = require('express');
const router = Router();
const {revisarCorreo,registrarUsuario,loginUsuario,modificarDatos,devolverDatos,guardarFoto,upload,devolverRutinas, obtenerEjerciciosPrivados,obtenerEjerciciosTotales, devolverRutinasEspecifica,eliminarEjercicioDeRutina,anadirEjercicio,editarInfoRutinaPriv,guardarFotoRutina,devolverCoincidencias,eliminarEjercicioPublico,obtenerMusculosTotales,editarEjercicioPublico,guardarFotoEjercicio,guardarNuevoEjercicio,devolverRutinasPublicas,modificarRutinas,guardarFotoRutinaPub,eliminarRutinasPub,guardarNuevaRutinaPub} = require('../controllers/index.controller');

//Gets
router.get('/users/:correo', revisarCorreo);
router.get('/users/devolverDatos/:id', devolverDatos);
router.get('/users/devolverRutinas/:id', devolverRutinas);
router.get('/users/devolverRutinasEspecifica/:id', devolverRutinasEspecifica);
router.get('/users/obtenerEjerciciosPrivados/:id',obtenerEjerciciosPrivados);
router.get('/users/obtenerEjerciciosTotales/:id',obtenerEjerciciosTotales);
router.get('/users/devolverCoincidencias/:coincidencia',devolverCoincidencias);
router.get('/users/obtenerMusculosTotales/:id',obtenerMusculosTotales);
router.get('/users/devolverRutinasPublicas/:id',devolverRutinasPublicas);

//Posts
router.post('/users/registro', registrarUsuario);
router.post('/users/login',loginUsuario);
router.post('/users/guardarFoto',upload.single("myFile"),guardarFoto);
router.post('/users/anadirEjercicio',anadirEjercicio);
router.post('/users/guardarFotoRutina',upload.single("myFile"),guardarFotoRutina);
router.post('/users/guardarFotoEjercicio',upload.single("myFile"),guardarFotoEjercicio);
router.post('/users/guardarFotoRutinaPub',upload.single("myFile"),guardarFotoRutinaPub);
router.post('/users/guardarNuevoEjercicio',guardarNuevoEjercicio);
router.post('/users/guardarNuevaRutinaPub',guardarNuevaRutinaPub);


//Puts
router.put('/users/modificarDatos',modificarDatos);
router.put('/users/editarInfoRutinaPriv',editarInfoRutinaPriv);
router.put('/users/modificarEjercicioPublico',editarEjercicioPublico);
router.put('/users/modificarRutinas',modificarRutinas);

//Delete
router.delete('/users/dataEliminarEjercicioRutina',eliminarEjercicioDeRutina);
router.delete('/users/EliminarEjercicioPublico',eliminarEjercicioPublico);
router.delete('/users/EliminarRutinasPub',eliminarRutinasPub);
module.exports = router;