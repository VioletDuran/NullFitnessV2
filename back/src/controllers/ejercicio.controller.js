const pool = require('../config/db.config')

const obtenerEjerciciosTotales = async (req, res) => {
    try {
        // Obteniendo todos los ejercicios
        let ejercicios = await pool.query('select * from ejercicios ORDER BY idejercicio ASC');

        // Obteniendo todas las relaciones entre ejercicios y músculos
        let relaciones = await pool.query('SELECT ejercicios_musculos.idejercicio, musculos.musculo FROM ejercicios_musculos JOIN musculos ON ejercicios_musculos.idmusculo = musculos.idmusculo');

        // Organizamos las relaciones en un objeto para fácil acceso
        let mapRelaciones = {};
        for (let row of relaciones.rows) {
            if (!mapRelaciones[row.idejercicio]) {
                mapRelaciones[row.idejercicio] = [];
            }
            mapRelaciones[row.idejercicio].push(row.musculo);
        }

        // Agregando músculos a los ejercicios
        for (let ejercicio of ejercicios.rows) {
            ejercicio["musculos"] = mapRelaciones[ejercicio.idejercicio] || [];
        }
        res.status(200).json(ejercicios.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send(false);
    }
}

const devolverCoincidencias = async (req, res) => {
    try {
        const coincidencia = `%${req.params.coincidencia.toLowerCase()}%`;

        const response = await pool.query(
            `select distinct ejercicios.tituloejercicio, ejercicios.idejercicio 
             from ejercicios 
             left join ejercicios_musculos on ejercicios_musculos.idejercicio = ejercicios.idejercicio 
             left join musculos on ejercicios_musculos.idmusculo = musculos.idmusculo 
             where LOWER(ejercicios.tituloejercicio) like $1 
             or LOWER(ejercicios.descripcion) like $1 
             or LOWER(musculos.musculo) like $1;`, 
            [coincidencia]
        );
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send(false);
    }
}

const obtenerMusculosTotales = async(req,res) =>{
    try {
        let musculos = await pool.query('select * from musculos');
        return res.status(200).send(musculos.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send(false);
    }
}

const obtenerMusculosEjercicios = async(req,res) =>{
    try {
        const id = req.params.id;
        const response = await pool.query('select idmusculo from ejercicios_musculos where idejercicio = $1;',[id]);
        return res.status(200).send(response.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send(false);
    }
}

const guardarFotoEjercicio = async(req,res) =>{
    let file = req.file.filename;
    let id = file.split("_");
    file = "http://localhost:3000/ejerciciosPublico/" + file;
    await pool.query('UPDATE ejercicios SET foto = $1 where idejercicio = $2', [file,id[0]]);
    pool.end;
    res.status(200).send(true);
}

const guardarNuevoEjercicio = async (req, res) => {
    try {
        const { tituloejercicio, descripcion, video, musculos } = req.body;
        const validVideo = video && video.includes('youtube') ? video : "https://www.youtube.com/embed/gc2iRcz9IPs";
        await pool.query('BEGIN');
        const ejercicioResult = await pool.query(
            'INSERT INTO ejercicios(tituloejercicio, titulofoto, descripcion, video, foto) VALUES($1, $1, $2, $3, $4) RETURNING idejercicio',
            [tituloejercicio, descripcion, validVideo, ""]
        );
        const idejercicio = ejercicioResult.rows[0].idejercicio;
        for (let idmusculo of musculos) {
            await pool.query(
                'INSERT INTO ejercicios_musculos(idejercicio, idmusculo) VALUES ($1, $2)',
                [idejercicio, idmusculo]
            );
        }
        await pool.query('COMMIT');
        res.status(200).json(idejercicio);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).send("Error al guardar ejercicio");
    }
}

const revisarEjercicioRutina = async(req, res) => {
    try {
        const {idrutinas, idejercicios} = req.body;
        const response1 = await pool.query(
            'SELECT idejercicios FROM rutinas_ejercicios WHERE idrutinas = $1 AND idejercicios = $2',
            [idrutinas, idejercicios]
        );
        const isNotAssociated = response1.rows.length === 0;
        return res.status(200).send(isNotAssociated);
    } catch (error) {
        console.error("Error en revisarEjercicioRutina:", error);
        return res.status(500).send({message: "Error interno del servidor"});
    }
}


module.exports = {
    obtenerEjerciciosTotales,
    devolverCoincidencias,
    obtenerMusculosTotales,
    obtenerMusculosEjercicios,
    guardarFotoEjercicio,
    guardarNuevoEjercicio,
    revisarEjercicioRutina
}