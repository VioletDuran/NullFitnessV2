const multer = require('multer');
const { json } = require('express');
const pool = require('../config/db.config')

function middleware(req,res,next){
    try {
        const token = req.headers['token'];
        const dotenv = require('dotenv').config({ path: 'pass.env' });
        const secretKey = process.env.secretkey;
        const jwt = require('jsonwebtoken');
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).send(false);
            } else {
              req.idusuario = decoded.data;
              next();
            }
        });
    } catch (error) {
        res.send(false)
    }
}

const storage = multer.diskStorage({
    filename: function (res, file, cb) {
      const fileName = file.originalname;
      cb(null, `${fileName}`);
    },
    destination: function (res, file, cb) {
      const carpeta = res.query['carpeta'];
      if(carpeta == undefined){
        cb(null, './public');
      }else{
        cb(null, './public/' + carpeta);
      }
      
    },
  });

const upload = multer({ storage });

const guardarFoto = async (req, res) => {
  let file = req.file.filename;
  let id = file.split(".");
  file = "http://localhost:3000/" + file;
  await pool.query('UPDATE usuarios SET foto = $1 where idusuario = $2', [file,id[0]]);
  pool.end;
  res.send(true);
}

const guardarFotoRutina = async (req,res) =>{
    let file = req.file.filename;
    let id = file.split("_");
    file = "http://localhost:3000/rutinasPrivadas/" + file;
    await pool.query('UPDATE rutinas SET foto = $1 where idrutinas = $2', [file,id[0]]);
    pool.end;
    res.send(true);
}

const guardarFotoRutinaPub = async(req,res) =>{
    let file = req.file.filename;
    let id = file.split("_");
    file = "http://localhost:3000/rutinasPublicas/" + file;
    await pool.query('UPDATE rutinas SET foto = $1 where idrutinas = $2', [file,id[0]]);
    pool.end;
    res.send(true);
}

const guardarFotoEjercicio = async(req,res) =>{
    let file = req.file.filename;
    let id = file.split("_");
    file = "http://localhost:3000/ejerciciosPublico/" + file;
    await pool.query('UPDATE ejercicios SET foto = $1 where idejercicio = $2', [file,id[0]]);
    pool.end;
    res.send(true);
}

const revisarCorreo =  async (req, res) => {
    try {
        const correo = req.params.correo;
        const response = await pool.query('select correo from usuarios where correo = $1',[correo]);
        if(response.rows.length == 1){
            pool.end;
            res.send(true);
        }else{
            pool.end;
            res.status(200).send(false); 
        }
    } catch (error) {
        return res.send(false)
    }
}

const obtenerEjerciciosPrivados = async(req,res) =>{
    try {
        const id = req.params.id;
        const response = await pool.query('select idejercicios from rutinas_ejercicios where idrutinas = $1',[id]);
        pool.end;
        return res.send(response.rows);
    } catch (error) {
        return res.send(false);
    }
}

const devolverRutinas = async (req, res) =>{
    try {
        let id = req.idusuario.idusuario;
        const response = await pool.query('select * from rutinas where idusuario = $1 ORDER BY idrutinas ASC',[id]);
        pool.end;
        let resultado = response.rows;
        return res.json(resultado);
    } catch (error) {
        return res.json(false);
    }
}



const devolverRutinasEspecifica = async (req, res) =>{
    try {
        const id = req.params.id;
        const response = await pool.query('select * from rutinas where idrutinas = $1',[id]);
        pool.end;
        let resultado = response.rows;
        return res.json(resultado);
    } catch (error) {
        return res.send(false);
    }
}




const modificarDatos =  async (req, res) => {
    try {
        const {idusuario, edad, peso, objetivo, genero, altura, experiencia} = req.body;
        const response = await pool.query('UPDATE usuarios SET edad = $2,peso = $3, objetivo = $4, genero = $5, altura = $6, experiencia = $7 WHERE idusuario = $1',[idusuario, edad, peso, objetivo, genero, altura, experiencia])
        pool.end;
        console.log(req.body);
        if(response){
            res.status(200).send(true);
        }
    } catch (error) {
        res.status(200).send(false);
    }
}

const devolverDatos =  async (req, res) => {
    try {
        let id = req.idusuario.idusuario;
        const response = await pool.query('select idusuario, nombreusuario, edad, nombre, foto, peso, experiencia, altura, genero, objetivo from usuarios where idusuario = $1',[id]);
        pool.end;
        let resultado = response.rows[0];
        return res.json(resultado);
    } catch (error) {
        return res.send(error);
    }
}

const obtenerEjerciciosTotales = async (req, res) =>{
    try {
        let ejercicios = await pool.query('select * from ejercicios ORDER BY idejercicio ASC');
        for(i = 0; i < ejercicios.rows.length; i++){
            let idMusculos = await pool.query('select idmusculo from ejercicios_musculos where idejercicio = $1',[ejercicios.rows[i]["idejercicio"]]);
            let arregloMusculos = [];
            for(j = 0; j < idMusculos.rows.length; j++){
                let musculo = await pool.query('select musculo from musculos where idmusculo = $1',[idMusculos.rows[j]["idmusculo"]]);
                arregloMusculos.push(musculo.rows[0]["musculo"]);
            }
            ejercicios.rows[i]["musculos"] = arregloMusculos;
        }
        pool.end;
        res.json(ejercicios.rows);
    } catch (error) {
        return res.send(false)
    }
}

const eliminarEjercicioDeRutina = async(req,res) =>{
    const{
        idrutinas,
        idejericio,
    } = req.body;
    const response = await pool.query('delete from rutinas_ejercicios where idejercicios = $1 and idrutinas = $2',[idejericio,idrutinas]);
    pool.end;
    if(response){
        res.status(200).send(true);
    }else{
        res.status(500).send(false)
    }
}


const revisarEjercicioRutina = async(req,res) =>{
        console.log(req.body);
        try {
            const {idrutinas,idejercicios} = req.body;
            const response1 = await pool.query('select idejercicios from rutinas_ejercicios where idrutinas = $1 and idejercicios = $2',[idrutinas,idejercicios])
            if(response1.rows.length == 1){
                return res.status(200).send(false);
            }else{
                return res.status(200).send(true);
            }
        } catch (error) {
            
        }
}

const anadirEjercicio = async(req,res) =>{
    try {
        const {idrutinas,idejercicios,series,repeticiones} = req.body;
        const response = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios, series, repeticiones) VALUES ($1,$2,$3,$4)',[idrutinas,idejercicios,series,repeticiones]);
        if(response){
            return res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
    }
}

const editarInfoRutinaPriv = async(req,res) =>{
    const {idrutinas, titulorutina, descripcion} = req.body;
    response = await pool.query('UPDATE rutinas SET titulorutina = $1, descripcion = $2 where idrutinas = $3',[titulorutina,descripcion,idrutinas]);
    if(response){
        return res.status(200).send(true);
    }
}

const devolverCoincidencias = async(req,res) => {
    try {
        let coincidencia = req.params.coincidencia;
        coincidencia = coincidencia.toLowerCase();
        let coincidendia = "%" + coincidencia + "%"
        const response = await pool.query('select distinct ejercicios.tituloejercicio, ejercicios.idejercicio from ejercicios left join ejercicios_musculos on ejercicios_musculos.idejercicio = ejercicios.idejercicio left join musculos on ejercicios_musculos.idmusculo = musculos.idmusculo where LOWER(ejercicios.tituloejercicio) like $1 or LOWER(ejercicios.descripcion) like $1 or LOWER(musculos.musculo) like $1;',[coincidendia]);
        return res.json(response.rows);
    } catch (error) {
        return res.send(false)
    }
}

const eliminarEjercicioPublico = async(req,res) =>{
    let {idejercicio} = req.body;
    const response = await pool.query('DELETE FROM ejercicios where idejercicio = $1',[idejercicio]);
    if(response){
        return res.status(200).send;
    }
}

const eliminarRutinasPub = async(req,res) =>{
    let {idrutinas} = req.body;
    const response = await pool.query('DELETE FROM rutinas where idrutinas = $1',[idrutinas]);
    if(response){
        return res.status(200).send;
    }
}

const obtenerMusculosTotales = async(req,res) =>{
    try {
        let musculos = await pool.query('select * from musculos');
        return res.status(200).send(musculos.rows);
    } catch (error) {
        return res.send(false);
    }
}

const editarEjercicioPublico = async(req,res) =>{
    let {idejercicio,tituloejercicio, descripcion, video, musculos} = req.body;
     const response = await pool.query('delete from ejercicios_musculos where idejercicio = $1',[idejercicio]);
     if(descripcion == "" && video == ""){
        const response2 = await pool.query('UPDATE ejercicios SET tituloejercicio = $1, titulofoto = $1 where idejercicio = $2',[tituloejercicio,idejercicio]);
     }
     else if(video == "" || video.includes('youtube') == false){
        const response2 = await pool.query('UPDATE ejercicios SET tituloejercicio = $1, titulofoto = $1, descripcion = $3 where idejercicio = $2',[tituloejercicio,idejercicio,descripcion]);
     }else if(descripcion == ""){
        const response2 = await pool.query('UPDATE ejercicios SET tituloejercicio = $1, titulofoto = $1, video = $3 where idejercicio = $2',[tituloejercicio,idejercicio,video]);
     }else{
        const response2 = await pool.query('UPDATE ejercicios SET tituloejercicio = $1, titulofoto = $1, descripcion = $3, video = $4 where idejercicio = $2',[tituloejercicio,idejercicio,descripcion,video]);
     }
     for(let i = 0; i < musculos.length; i++){
        const response3 = await pool.query('INSERT INTO ejercicios_musculos(idejercicio,idmusculo) VALUES ($1,$2)',[idejercicio,musculos[i]]);
     }
     res.send(true);
}

const guardarNuevoEjercicio = async(req,res) =>{
    let{tituloejercicio,descripcion,video,musculos} = req.body;
    if(video == "" || video.includes('youtube') == false){
        video = "https://www.youtube.com/embed/gc2iRcz9IPs"
    }
    const response = await pool.query('INSERT INTO ejercicios(tituloejercicio, titulofoto, descripcion, video,foto) VALUES($1,$1,$2,$3,$4) RETURNING idejercicio',[tituloejercicio,descripcion,video,""]);
    let idejercicio = response.rows[0].idejercicio;
    for(let i = 0; i < musculos.length; i++){
        const response2 = await pool.query('INSERT INTO ejercicios_musculos(idejercicio,idmusculo) VALUES ($1,$2)',[idejercicio,musculos[i]]);
     }
     res.json(response.rows[0].idejercicio);
}

const guardarNuevaRutinaPub = async(req,res) =>{
    let{titulorutina, descripcion,ejercicios} = req.body;
    const response = await pool.query('INSERT INTO rutinas(titulorutina,descripcion,foto) VALUES($1,$2,$3) RETURNING idrutinas',[titulorutina,descripcion,'']);
    let idrutinas = response.rows[0].idrutinas;
    for(let i = 0; i < ejercicios.length; i++){
        const response3 = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas,idejercicios) VALUES ($1,$2)',[idrutinas,ejercicios[i]]);
     }
     res.json(response.rows[0].idrutinas);
}

const devolverRutinasPublicas = async(req,res) =>{
    try {
        let response = await pool.query('select idrutinas,titulorutina,foto,descripcion from rutinas where idusuario ISNULL ORDER BY idrutinas ASC');
        return res.status(200).json(response.rows);
    } catch (error) {
        return res.send(false);
    }
}

const modificarRutinas = async(req,res) =>{
    let{ idrutinas, titulorutina, descripcion,ejercicios} = req.body;
    const response = await pool.query('delete from rutinas_ejercicios where idrutinas = $1',[idrutinas]);
    const response2 = await pool.query('UPDATE rutinas SET titulorutina = $1, descripcion = $2 where idrutinas = $3',[titulorutina,descripcion,idrutinas]);
    for(let i = 0; i < ejercicios.length; i++){
        const response3 = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas,idejercicios) VALUES ($1,$2)',[idrutinas,ejercicios[i]]);
     }
    res.send(true);
}

const obtenerEjerciciosPrivadoUsuario = async (req,res) => {
    try {
        const id = req.params.id;
        const response = await pool.query('select idejercicios,series,repeticiones,tiempo from rutinas_ejercicios where idrutinas = $1 order by idejercicios',[id]);
        pool.end;
        return res.send(response.rows);
    } catch (error) {
        return res.send(false);
    }
}

const esCardio = async(req,res) =>{
    try {
        const id = req.params.id;
        const response = await pool.query('select idmusculo from ejercicios_musculos where idejercicio = $1;',[id]);
        pool.end;
        return res.send(response.rows);
    } catch (error) {
        return res.send(false);
    }
}

const anadirEjercicioCardio = async(req,res) =>{
    try {
        const {idrutinas,idejercicios,tiempo} = req.body;
        const response = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios, tiempo) VALUES ($1,$2,$3)',[idrutinas,idejercicios,tiempo]);
        if(response){
            return res.status(200).send(true);
        }
        console.log("HOLA");
    } catch (error) {
        console.log(error);
    }
}

const modificarTiempo = async(req,res) =>{
    try {
        const {idrutinas,idejercicios,tiempo} = req.body;
        const response = await pool.query('UPDATE rutinas_ejercicios SET tiempo = $3 where idrutinas = $1 and idejercicios = $2',[idrutinas,idejercicios,tiempo]);
        if(response){
            return res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
    }
}

const modificarCarga = async(req,res) =>{
    try {
        const {idrutinas,idejercicios,series,repeticiones} = req.body;
        const response = await pool.query('UPDATE rutinas_ejercicios SET series = $3, repeticiones = $4 where idrutinas = $1 and idejercicios = $2',[idrutinas,idejercicios,series,repeticiones]);
        if(response){
            return res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    revisarCorreo,
    modificarDatos,
    devolverDatos,
    guardarFoto,
    upload,
    devolverRutinas,
    obtenerEjerciciosPrivados,
    obtenerEjerciciosTotales,
    devolverRutinasEspecifica,
    eliminarEjercicioDeRutina,
    anadirEjercicio,
    editarInfoRutinaPriv,
    guardarFotoRutina,
    devolverCoincidencias,
    eliminarEjercicioPublico,
    obtenerMusculosTotales,
    editarEjercicioPublico,
    guardarFotoEjercicio,
    guardarNuevoEjercicio,
    devolverRutinasPublicas,
    modificarRutinas,
    guardarFotoRutinaPub,
    eliminarRutinasPub,
    guardarNuevaRutinaPub,
    middleware,
    revisarEjercicioRutina,
    obtenerEjerciciosPrivadoUsuario,
    esCardio,
    anadirEjercicioCardio,
    modificarTiempo,
    modificarCarga
}