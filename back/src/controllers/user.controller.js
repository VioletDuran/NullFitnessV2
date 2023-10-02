const pool = require('../config/db.config')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
const fotoOriginal = "../../../assets/img/usuario.png"

const registrarUsuario = async (req, res, next) => {
    try {
        const { nombre, nombreUsuario, edad, correo, contraseña} = req.body;
        let auxContraseña =  bcrypt.hashSync(contraseña, 10, (err, hash) => {
            if (err) throw (err)
            contraseña = hash;
        });
        try {
            await pool
                .query('select idusuario from usuarios where correo = $1',[correo])
                .then(results => {
                    if(results.rows.length > 0){
                        res.status(409).send(false)
                    } else {
                        pool
                            .query('INSERT INTO usuarios (tipousuario, correo, contraseña, nombreusuario, edad, nombre, foto) VALUES ($1, $2, $3, $4, $5, $6, $7)', [1,correo,auxContraseña,nombreUsuario,edad,nombre, fotoOriginal])
                            .then(results => {
                                pool
                                .query('select idusuario from usuarios where correo = $1',[correo])
                                .then(results => {
                                    const idUsuario = results.rows[0]
                                    crearRutinas(idUsuario);
                                    res.status(200).send(true)
                                })
                                .catch(error => res.status(400).json({error: error.message}))
                            })
                            .catch(error => res.status(400).json({error: error.message}))
                    }
                })
                .catch()
        } catch (error){
            next(error)
        }
    } catch (error) {
        return res.send(false)
    }
}

const loginUsuario = async (req,res,next) => {
    const {correo,contraseña} = req.body;
    try {
        await pool 
        .query('select idusuario,contraseña,tipousuario from usuarios where correo = $1',[correo])
        .then(results => {
            if (results.rows.length > 0){
                const user = results.rows[0]
                if(bcrypt.compareSync(contraseña, user.contraseña)){
                    delete user.contraseña
                    const token =  jwt.sign({
                        data: user
                    }, 'secret', { expiresIn: 60 * 60 * 24}) // Expira en 1 día
                    res.status(202).json({ token, valor: true})
                } else {
                    res.status(406).send({error:'Email o contraseña incorrecta'})
                } 
            } else {
                res.status(404).send({error:'Correo no registrado'})
            }
        })
        .catch (error => res.status(404).send({error:'Hubo un error no esperado'}))
    } catch (error){
        next(error)
    }
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

const guardarFoto = async (req, res) => {
  let file = req.file.filename;
  let id = file.split(".");
  file = "http://localhost:3000/" + file;
  await pool.query('UPDATE usuarios SET foto = $1 where idusuario = $2', [file,id[0]]);
  pool.end;
  res.send(true);
}

module.exports = {registrarUsuario,loginUsuario,guardarFoto}