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

const editarInfoRutinaPriv = async (req, res) => {
    const { idrutinas, titulorutina, descripcion } = req.body;

    try {
        const response = await pool.query(
            'UPDATE rutinas SET titulorutina = $1, descripcion = $2 WHERE idrutinas = $3 RETURNING *',
            [titulorutina, descripcion, idrutinas]
        );

        // Verificar si la consulta realmente afectó alguna fila
        if (response.rowCount > 0) {
            return res.status(200).json({
                success: true,
                message: "Rutina actualizada con éxito",
                data: response.rows[0] // Retornar los datos actualizados (si deseas hacerlo)
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No se encontró la rutina para actualizar"
            });
        }
    } catch (error) {
        console.error("Error al actualizar la rutina:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
}

const modificarRutinas = async (req, res) => {
    const { idrutinas, titulorutina, descripcion, ejercicios } = req.body;

    try {
        // Comenzar una transacción
        await pool.query('BEGIN');

        // Eliminar las relaciones previas con ejercicios
        await pool.query('DELETE FROM rutinas_ejercicios WHERE idrutinas = $1', [idrutinas]);

        // Actualizar la rutina
        await pool.query('UPDATE rutinas SET titulorutina = $1, descripcion = $2 WHERE idrutinas = $3', [titulorutina, descripcion, idrutinas]);

        // Insertar las relaciones con los ejercicios
        for (let ejercicio of ejercicios) {
            await pool.query('INSERT INTO rutinas_ejercicios(idrutinas, idejercicios) VALUES ($1, $2)', [idrutinas, ejercicio]);
        }

        // Finalizar la transacción
        await pool.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Rutina modificada con éxito'
        });
    } catch (error) {
        // En caso de error, deshacer todas las operaciones
        await pool.query('ROLLBACK');
        console.error("Error al modificar la rutina:", error.message || error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}

const eliminarEjercicioDeRutina = async (req, res) => {
    const { idrutinas, idejericio } = req.body;

    try {
        const response = await pool.query(
            'DELETE FROM rutinas_ejercicios WHERE idejercicios = $1 AND idrutinas = $2',
            [idejericio, idrutinas]
        );

        // Verificando cuántas filas fueron afectadas por la consulta
        if (response.rowCount > 0) {
            res.status(200).json({
                success: true,
                message: 'Ejercicio eliminado de la rutina con éxito'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No se encontró el ejercicio en la rutina especificada'
            });
        }
    } catch (error) {
        console.error("Error al eliminar el ejercicio de la rutina:", error.message || error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}

const eliminarRutinasPub = async (req, res) => {
    const { idrutinas } = req.body;

    try {
        const response = await pool.query('DELETE FROM rutinas WHERE idrutinas = $1', [idrutinas]);

        // Verificando cuántas filas fueron afectadas por la consulta
        if (response.rowCount > 0) {
            res.status(200).json({
                success: true,
                message: 'Rutina eliminada con éxito'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No se encontró la rutina especificada'
            });
        }
    } catch (error) {
        console.error("Error al eliminar la rutina:", error.message || error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
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
    anadirEjercicioCardio,
    editarInfoRutinaPriv,
    modificarRutinas,
    eliminarEjercicioDeRutina,
    eliminarRutinasPub
}