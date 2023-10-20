const { Router } = require('express');
const rutina = Router();
const userExtractor = require('../middlewares/userExtractor')
const upload = require('../middlewares/upload')
const {devolverRutinas,devolverRutinasEspecifica,obtenerEjerciciosPrivados,devolverRutinasPublicas,obtenerEjerciciosPrivadoUsuario,anadirEjercicioARutina,guardarFotoRutina,guardarFotoRutinaPub,guardarNuevaRutinaPub,anadirEjercicioCardio,editarInfoRutinaPriv,modificarRutinas,eliminarEjercicioDeRutina,eliminarRutinasPub} = require('../controllers/rutina.controller')

//GETS
rutina.get('/devolverRutinas',userExtractor, devolverRutinas); //Devolver rutina privada de usuario 
rutina.get('/devolverRutinasEspecifica/:id',devolverRutinasEspecifica); //Devolver rutina en especifico - RUTA: rutina
rutina.get('/obtenerEjerciciosPrivados/:id',obtenerEjerciciosPrivados); //Devolver ejercicios espeficificos de una rutina - RUTA: rutina
rutina.get('/devolverRutinasPublicas',devolverRutinasPublicas); //Devolver todas las rutinas publcas - RUTA: rutina
rutina.get('/obtenerEjerciciosPrivadoUsuario/:id',obtenerEjerciciosPrivadoUsuario); //Devoler ejercicios de una rutina en especifico - RUTA: rutina 

//POST
rutina.post('/anadirEjercicio',userExtractor,anadirEjercicioARutina); //Agregar un ejercicio a una rutina - RUTA: rutina 
rutina.post('/guardarFotoRutina',userExtractor,upload.single("myFile"),guardarFotoRutina); //Agregar foto de rutina - RUTA: rutina
rutina.post('/guardarFotoRutinaPub',userExtractor,upload.single("myFile"),guardarFotoRutinaPub); //Agregar foto de rutina publica - RUTA: rutina
rutina.post('/guardarNuevaRutinaPub',userExtractor,guardarNuevaRutinaPub);
rutina.post('/anadirEjercicioCardio',userExtractor,anadirEjercicioCardio); // Agregar un ejercicio de cardio a una rutina - RUTA: rutina 

//PUTS
rutina.put('/editarInfoRutinaPriv',userExtractor,editarInfoRutinaPriv); //Editar informacion de rutina privada - RUTA: rutina 
rutina.put('/modificarRutinas',userExtractor,modificarRutinas); //Editar informacion de rutina - RUTA: rutina

//DELETE
rutina.delete('/dataEliminarEjercicioRutina',userExtractor,eliminarEjercicioDeRutina);//Eliminar un ejercicio de una rutina - RUTA:rutina 
rutina.delete('/EliminarRutinasPub',userExtractor,eliminarRutinasPub);//Eliminar una rutina publica - RUTA: rutina



module.exports = rutina