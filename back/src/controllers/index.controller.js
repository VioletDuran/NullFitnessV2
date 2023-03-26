const { Pool } = require('pg');
const multer = require('multer');
const { json } = require('express');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'fugox123',
    database: 'web',
    port: '5432'
})


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
    const correo = req.params.correo;
    const response = await pool.query('select correo from usuarios where correo = $1',[correo]);
    if(response.rows.length == 1){
        pool.end;
        res.send(true);
    }else{
        pool.end;
        res.status(200).send(false); 
    }
}

const obtenerEjerciciosPrivados = async(req,res) =>{
    const id = req.params.id;
    const response = await pool.query('select idejercicios from rutinas_ejercicios where idrutinas = $1',[id]);
    pool.end;
    return res.send(response.rows);
}

const devolverRutinas = async (req, res) =>{
    const id = req.params.id;
    const response = await pool.query('select * from rutinas where idusuario = $1 ORDER BY idrutinas ASC',[id]);
    pool.end;
    let resultado = response.rows;
    return res.json(resultado);
}

const generarEjerciciosBasicos = async(idUsuario) =>{
    idUsuario = idUsuario["idusuario"];
    let rutinas = await pool.query('select idrutinas from rutinas where idusuario = $1',[idUsuario]);
    for(let i = 0; i <= 5; i++){
        await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1,$2)',[rutinas.rows[i]["idrutinas"],1]);
        await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1,$2)',[rutinas.rows[i]["idrutinas"],2]);
        await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1,$2)',[rutinas.rows[i]["idrutinas"],3]);
        await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1,$2)',[rutinas.rows[i]["idrutinas"],4]);
        await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1,$2)',[rutinas.rows[i]["idrutinas"],5]);
        await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1,$2)',[rutinas.rows[i]["idrutinas"],6]);
    }
    pool.end;
    return;
}

const devolverRutinasEspecifica = async (req, res) =>{
    const id = req.params.id;
    const response = await pool.query('select * from rutinas where idrutinas = $1',[id]);
    pool.end;
    let resultado = response.rows;
    return res.json(resultado);
}

const crearRutinas = async (idUsuario) =>{
    for(let i = 1; i <= 6; i++){
        let nombreRutina = "MiRutina " + i;
        let fotoNormal = "../../../assets/img/mirutina1.jpg";
        let descripcion = "Rutina preestablecida"
        await pool.query('INSERT INTO rutinas (titulorutina, foto, descripcion,idusuario) VALUES ($1, $2, $3, $4)',[nombreRutina, fotoNormal, descripcion, idUsuario["idusuario"]]);
        pool.end;
    }
    generarEjerciciosBasicos(idUsuario);
    return;
}


const registrarUsuario = async (req, res) => {
    const { nombre, nombreUsuario, edad, correo, contraseña} = req.body;
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    let auxContraseña =  bcrypt.hashSync(contraseña, saltRounds, (err, hash) => {
        if (err) throw (err)
        contraseña = hash;
    });
    let fotoOriginal = "../../../assets/img/usuario.png";
    let con = await pool.query('INSERT INTO usuarios (tipousuario, correo, contraseña, nombreusuario, edad, nombre, foto) VALUES ($1, $2, $3, $4, $5, $6, $7)', [1,correo,auxContraseña,nombreUsuario,edad,nombre, fotoOriginal]);
    let obtenerId = await pool.query('select idusuario from usuarios where correo = $1',[correo]);
    crearRutinas(obtenerId.rows[0]);
    if(!con){
        pool.end;
        res.status(200).send(false);
    }else{
        pool.end;
        res.status(200).send(true);
    }
}

const loginUsuario = async (req,res) => {
    let flagAdmin = 0;
    const {correo,contraseña} = req.body;
    const response = await pool.query('select idusuario,contraseña,tipousuario from usuarios where correo = $1',[correo]);
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    if(response.rows[0].tipousuario == '2' && contraseña == response.rows[0].contraseña){
        flagAdmin = 1;
    }
    if((response.rows.length != 0 && bcrypt.compareSync(contraseña, response.rows[0].contraseña)) || flagAdmin == 1){
            let resultado = response.rows[0];
            delete resultado.password;
            let token = jwt.sign({
                data: resultado
            }, 'secret', { expiresIn: 60 * 60 * 24}) // Expira en 1 día
            pool.end;
            return res.json({
                token,
                valor: true
            })
    }else{
        pool.end;
        res.status(400).send(false);
    }
}

const modificarDatos =  async (req, res) => {
    const {idusuario, edad, peso, nacionalidad, contextura, objetivo, cantidad_ejercicio} = req.body;
    
    const response = await pool.query('UPDATE usuarios SET edad = $2,peso = $3, nacionalidad = $4, contextura = $5, objetivo = $6, cantidad_ejercicio = $7 WHERE idusuario = $1',[idusuario, edad, peso, nacionalidad, contextura, objetivo, cantidad_ejercicio])
    pool.end;
    if(response){
        res.status(200).send(true);
    }
}

const devolverDatos =  async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('select idusuario, nombreusuario, nombre, edad, peso, nacionalidad, contextura, objetivo, cantidad_ejercicio, foto from usuarios where idusuario = $1',[id]);
    pool.end;
    let resultado = response.rows[0];
    return res.json(resultado);
}

const obtenerEjerciciosTotales = async (req, res) =>{
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

const anadirEjercicio = async(req,res) =>{
    const {idrutinas,idejercicios} = req.body;
    const response1 = await pool.query('select idejercicios from rutinas_ejercicios where idrutinas = $1 and idejercicios = $2',[idrutinas,idejercicios])
    if(response1.rows.length == 1){
        return res.status(200).send(false);
    }
    const response = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1,$2)',[idrutinas,idejercicios]);
    if(response){
        return res.status(200).send(true);
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
    let coincidencia = req.params.coincidencia;
    coincidencia = coincidencia.toLowerCase();
    let coincidendia = "%" + coincidencia + "%"
    const response = await pool.query('select distinct ejercicios.tituloejercicio, ejercicios.idejercicio from ejercicios left join ejercicios_musculos on ejercicios_musculos.idejercicio = ejercicios.idejercicio left join musculos on ejercicios_musculos.idmusculo = musculos.idmusculo where LOWER(ejercicios.tituloejercicio) like $1 or LOWER(ejercicios.descripcion) like $1 or LOWER(musculos.musculo) like $1;',[coincidendia]);
    return res.json(response.rows);
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
    let musculos = await pool.query('select * from musculos');
    return res.status(200).send(musculos.rows);
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
    let response = await pool.query('select idrutinas,titulorutina,foto,descripcion from rutinas where idusuario ISNULL ORDER BY idrutinas ASC');
    return res.status(200).json(response.rows);
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

module.exports = {
    revisarCorreo,
    registrarUsuario,
    loginUsuario,
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
    guardarNuevaRutinaPub
}