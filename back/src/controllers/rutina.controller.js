const pool = require('../config/db.config')

const devolverRutinas = async (req, res) =>{
    try {
        let id = req.idusuario.idusuario;
        const response = await pool.query('select * from rutinas where idusuario = $1 ORDER BY idrutinas ASC',[id]);
        let resultado = response.rows;
        return res.status(200).json(resultado);
    } catch (error) {
        console.log(error);
        return res.status(500).json(false);
    }
}

const devolverRutinasEspecifica = async (req, res) =>{
    try {
        const id = req.params.id;
        const response = await pool.query('select * from rutinas where idrutinas = $1',[id]);
        let resultado = response.rows;
        return res.status(200).json(resultado);
    } catch (error) {
        console.log(error);
        return res.status(500).json(false);
    }
}

const obtenerEjerciciosPrivados = async(req,res) =>{
    try {
        const id = req.params.id;
        const response = await pool.query('select idejercicios from rutinas_ejercicios where idrutinas = $1',[id]);
        return res.status(200).send(response.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json(false);
    }
}

const devolverRutinasPublicas = async(req,res) =>{
    try {
        let response = await pool.query('select idrutinas,titulorutina,foto,descripcion from rutinas where idusuario ISNULL ORDER BY idrutinas ASC');
        return res.status(200).json(response.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json(false);
    }
}

const obtenerEjerciciosPrivadoUsuario = async (req,res) => {
    try {
        const id = req.params.id;
        const response = await pool.query('select idejercicios,series,repeticiones,tiempo from rutinas_ejercicios where idrutinas = $1 order by idejercicios',[id]);
        return res.send(response.rows);
    } catch (error) {
        console.log(error);
        return res.status(500).json(false);
    }
}

const anadirEjercicioARutina = async(req,res) =>{
    try {
        const {idrutinas,idejercicios,series,repeticiones} = req.body;
        const response = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios, series, repeticiones) VALUES ($1,$2,$3,$4)',[idrutinas,idejercicios,series,repeticiones]);
        if(response){
            return res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(false);
    }
}

const guardarFotoRutina = async (req,res) =>{
    let file = req.file.filename;
    let id = file.split("_");
    file = "http://localhost:3000/rutinasPrivadas/" + file;
    await pool.query('UPDATE rutinas SET foto = $1 where idrutinas = $2', [file,id[0]]);
    res.status(200).send(true);
}

const guardarFotoRutinaPub = async(req,res) =>{
    let file = req.file.filename;
    let id = file.split("_");
    file = "http://localhost:3000/rutinasPublicas/" + file;
    await pool.query('UPDATE rutinas SET foto = $1 where idrutinas = $2', [file,id[0]]);
    pool.end;
    res.status(200).send(true);
}

const guardarNuevaRutinaPub = async (req, res) => {
    try {
        const { titulorutina, descripcion, ejercicios } = req.body;
        const response = await pool.query(
            'INSERT INTO rutinas(titulorutina,descripcion,foto) VALUES($1,$2,$3) RETURNING idrutinas',
            [titulorutina, descripcion, '']
        );
        const idrutinas = response.rows[0].idrutinas;
        const queries = ejercicios.map(ejercicio => {
            return pool.query('INSERT INTO rutinas_ejercicios(idrutinas,idejercicios) VALUES ($1,$2)', [idrutinas, ejercicio]);
        });
        await Promise.all(queries);
        res.status(200).json({ id: idrutinas, message: "Rutina creada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error al guardar la rutina." });
    }
}

const anadirEjercicioCardio = async(req,res) =>{
    try {
        const {idrutinas,idejercicios,tiempo} = req.body;
        const response = await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios, tiempo) VALUES ($1,$2,$3)',[idrutinas,idejercicios,tiempo]);
        if(response){
            return res.status(200).send(true);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    devolverRutinas,
    devolverRutinasEspecifica,
    obtenerEjerciciosPrivados,
    devolverRutinasPublicas,
    obtenerEjerciciosPrivadoUsuario,
    anadirEjercicioARutina,
    guardarFotoRutina,
    guardarFotoRutinaPub,
    guardarNuevaRutinaPub,
    anadirEjercicioCardio
}