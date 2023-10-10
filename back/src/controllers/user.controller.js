const pool = require('../config/db.config')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
const fotoOriginal = "../../../assets/img/usuario.png"

const registrarUsuario = async (req, res, next) => {
    try {
        const { nombre, nombreUsuario, edad, correo, contraseña } = req.body;
        const auxContraseña = bcrypt.hashSync(contraseña, 10); 
        const responseCorreo = await pool.query('select idusuario from usuarios where correo = $1', [correo]);
        if (responseCorreo.rows.length > 0) {
            return res.status(409).send({msg:'Error ese correo ya se encuentra registrado'});
        }
        await pool.query('INSERT INTO usuarios (tipousuario, correo, contraseña, nombreusuario, edad, nombre, foto) VALUES ($1, $2, $3, $4, $5, $6, $7)', [1, correo, auxContraseña, nombreUsuario, edad, nombre, fotoOriginal]);
        const responseId = await pool.query('select idusuario from usuarios where correo = $1', [correo]);
        const idUsuario = responseId.rows[0];
        crearRutinas(idUsuario);
        return res.status(200).send({msg:'Se creado su cuenta con exito!'});
    } catch (error) {
        console.error(error); 
        return res.status(500).send(false); 
    }
}

const loginUsuario = async (req, res) => {
    const { correo, contraseña } = req.body;
    try {
        const results = await pool.query('select idusuario,contraseña,tipousuario from usuarios where correo = $1', [correo]);
        if (results.rows.length > 0) {
            const user = results.rows[0];
            if (bcrypt.compareSync(contraseña, user.contraseña)) {
                delete user.contraseña;
                const token = jwt.sign({
                    data: user
                }, 'secret', { expiresIn: 60 * 60 * 24 }); // Expira en 1 día
                return res.status(202).json({token, msg: 'Inicio de sesion exitoso!'});
            } else {
                return res.status(406).send({msg: 'Email o contraseña incorrecta'});
            }
        } else {
            return res.status(404).send({msg: 'Correo no registrado'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({msg: 'Hubo un error no esperado'});
    }
}

const crearRutinas = async (idUsuario) =>{
    for(let i = 1; i <= 6; i++){
        let nombreRutina = "MiRutina " + i;
        let fotoNormal = "../../../assets/img/mirutina1.jpg";
        let descripcion = "Rutina preestablecida"
        await pool.query('INSERT INTO rutinas (titulorutina, foto, descripcion,idusuario) VALUES ($1, $2, $3, $4)',[nombreRutina, fotoNormal, descripcion, idUsuario["idusuario"]]);
    }
    generarEjerciciosBasicos(idUsuario);
    return;
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
    return;
}

const guardarFoto = async (req, res) => {
  let file = req.file.filename;
  let id = file.split(".");
  file = "http://localhost:3000/" + file;
  await pool.query('UPDATE usuarios SET foto = $1 where idusuario = $2', [file,id[0]]);
  pool.end;
  res.status(200).send(true);
}

const devolverDatos =  async (req, res) => {
    try {
        let id = req.idusuario.idusuario;
        const response = await pool.query('select idusuario, nombreusuario, edad, nombre, foto, peso, experiencia, altura, genero, objetivo from usuarios where idusuario = $1',[id]);
        let resultado = response.rows[0];
        return res.json(resultado);
    } catch (error) {
        console.log(error)
        return res.status(404);
    }
}

const revisarCorreo =  async (req, res) => {
    try {
        const correo = req.params.correo;
        const response = await pool.query('select correo from usuarios where correo = $1',[correo]);
        if(response.rows.length == 1){
            return res.status(409).send({msg:'El correo ya se encuentra registrado.'});
        }else{
           return  res.status(200).send({msg:'La cuenta se creo de manera correcta.'}); 
        }
    } catch (error) {
        console.log(error)
        return res.status(500)
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

module.exports = {registrarUsuario,loginUsuario,guardarFoto,devolverDatos,revisarCorreo,modificarDatos}