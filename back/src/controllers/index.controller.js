const { json } = require('express');
const pool = require('../config/db.config')

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

const editarInfoRutinaPriv = async(req,res) =>{
    const {idrutinas, titulorutina, descripcion} = req.body;
    response = await pool.query('UPDATE rutinas SET titulorutina = $1, descripcion = $2 where idrutinas = $3',[titulorutina,descripcion,idrutinas]);
    if(response){
        return res.status(200).send(true);
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

const modificarRutinas = async(req,res) =>{
    let{ idrutinas, titulorutina, descripcion,ejercicios} = req.body;
    const response = await pool.query('delete from rutinas_ejercicios where idrutinas = $1',[idrutinas]);
    const response2 = await pool.query('UPDATE rutinas SET titulorutina = $1, descripcion = $2 where idrutinas = $3',[titulorutina,descripcion,idrutinas]);
    for(let i = 0; i < ejercicios.length; i++){
        const response3 = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas,idejercicios) VALUES ($1,$2)',[idrutinas,ejercicios[i]]);
     }
    res.send(true);
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
    eliminarEjercicioDeRutina,
    editarInfoRutinaPriv,
    eliminarEjercicioPublico,
    editarEjercicioPublico,
    modificarRutinas,
    eliminarRutinasPub,
    modificarTiempo,
    modificarCarga
}