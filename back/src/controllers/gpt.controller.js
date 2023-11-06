const OpenAI = require("openai");
const pool = require('../config/db.config')
require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function generarPrompt(datosUsuario){
    var ejercicios = '';
    var prompt = `Tengo un usuario el cual tiene las siguientes caracteristicas: \n`
    prompt = prompt + "Edad:" + datosUsuario.edad + ",";
    if(datosUsuario.peso != null){
        prompt = prompt + "Peso:" + datosUsuario.peso + ",";
    }
    if(datosUsuario.altura != null){
        prompt = prompt + "Altura:" + datosUsuario.altura + ",";
    }
    if(datosUsuario.genero != null){
        prompt = prompt + "Genero:" + datosUsuario.genero + ",";
    }
    if(datosUsuario.objetivo != null){
        prompt = prompt + "Objetivo a nivel fisico:" + datosUsuario.objetivo + ",";
    }
    if(datosUsuario.experiencia != null){
        prompt = prompt + "Nivel de experiencia en rutinas fisicas:" + datosUsuario.experiencia + ",";
    }
    prompt = prompt + ". Teniendo en consideracion estos datos de mi usuario, quiero que me hagas una rutina fisica que tenga una intensidad: " + datosUsuario.intensidad + "y que esta se enfoque en entrenar los siguientes musculos: \n";

    for(x in datosUsuario.musculos){
        prompt = prompt + datosUsuario.musculos[x] + ".\n";
    }

    prompt = prompt + `Para realizar esta rutina, quiero que me devuelvas solamente los ID de los ejercicios con sus respectivos series y repeticiones, y en caso de ser un ejercicio cardiovascular como bicicleta entre otros me devuelvas el tiempo, a continuacion te dejo el formato de como deberia ser la salida, ID:, Series:, Repeticiones:, Tiempo. A continuacion te dejo los ejercicios disponibles.\n`

    try {
        const results = await pool.query('select idejercicio,tituloejercicio from ejercicios;');
        for (x of results.rows) {
            ejercicios = ejercicios + "Id:" + x.idejercicio + " Nombre:" + x.tituloejercicio + "\n";
        }
        prompt = prompt + ejercicios;
        prompt = prompt + "No me des ninguna informacion extra, ni algun texto, solamente lo solicitado que es: ID, Series, Repeticiones y tiempo\n"
        prompt = prompt + "Podrias entregarme la respuesta en formato JSON. podrias quitarme los saltos de linea y dejarlo solamente como un formato JSON para manejar los datos. Te recalco que no me mandes nada mas aparte del json con los ejercicios. En caso de que en el json, el ejercicio no tenga series ni repeticiones, rellenalo con 0. El nombre de la variable donde llegaran los json, sera 'Rutina', y los valores estaran en mayuscula, tambien para el valor de tiempo, no le agreges nada aparte del numero. Recuerda quitar todos los saltos de linea y dejarlo lo mas normal posible ademas de que todos los datos esten en formato string.\n"
        return prompt;
    } catch (error) {
       return "Error";
    }
}

const generarRecomendacion = async(req,res) =>{
    var prompt = await generarPrompt(req.body);
    if(prompt == "Error"){
        res.status(444).send({msg: "Error al consultar base de datos"});
    }else{
        try {
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{"role": "user", "content": prompt}],
            });
            res.status(200).send(chatCompletion.choices[0].message);
        } catch (error) {
            console.log(error);
            res.status(444).send({msg: "Pasó un error inesperado."});
        }
    }
}

const guardarRutina = async(req,res) =>{
    let data = req.body.datos;
    const eliminarRutinaAnterior = await pool.query('DELETE FROM rutinas_ejercicios WHERE idrutinas = $1',[req.body.idRutina]);
    const client = await pool.connect();
    try {
        const insertQueries = data.map(data => {
            if(data.Tiempo == '0'){
                return {
                    text: 'INSERT INTO rutinas_ejercicios(idrutinas, idejercicios,series,repeticiones) VALUES($1, $2, $3, $4)',
                    values: [req.body.idRutina, data.ID, data.Series, data.Repeticiones]
                };
            }else{
                return {
                    text: 'INSERT INTO rutinas_ejercicios(idrutinas, idejercicios, tiempo) VALUES($1, $2, $3)',
                    values: [req.body.idRutina, data.ID, data.Tiempo]
                };
            }
        });

        for (let query of insertQueries) {
            await client.query(query);
        }

        if(await modificarRutina(req.body.idRutina,req.body.musculos) == false){
            res.status(400).send({msg:"Hubo un error, porfavor intentar de nuevo"});
        }

        if(await generarFotoAleaYAutomatizacion(req.body.idRutina,req.body.datos) == false){
            res.status(400).send({msg:"Hubo un error, porfavor intentar de nuevo"});
        }

        res.status(200).send(true);
    } catch (err) {
        console.log(error);
        res.status(400).send({msg:"Hubo un error, porfavor intentar de nuevo"});
    } finally {
        client.release();
    }
}

async function generarFotoAleaYAutomatizacion(idRutina,ejercicios){
    try {
        let indiceAleatorio = Math.floor(Math.random() * ejercicios.length);
        let idEjercicio = ejercicios[indiceAleatorio].ID;
        let datosRutina = await pool.query('select foto from ejercicios where idejercicio = $1',[idEjercicio]);
        await pool.query("UPDATE rutinas SET foto = $1, automatizado = '1' where idrutinas = $2",[datosRutina.rows[0].foto,idRutina]);
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function modificarRutina(idRutina,musculos){
    try {
        const fechaActual = new Date();
        const dia = fechaActual.getDate();
        const mes = fechaActual.getMonth() + 1; 
        const ano = fechaActual.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${ano}`;
        let updateTitulo = "Rutina generada el: " + fechaFormateada;
        let updateDescripcion = "Esta rutina fue generada mediante IA, enfocandose en los musculos de: ";
        for(let i = 0; i < musculos.length; i++){
            if(i == musculos.length - 1){
                updateDescripcion = updateDescripcion + musculos[i] + ".";
            }else{
                updateDescripcion = updateDescripcion + musculos[i] + ", ";
            }
        }
        await pool.query('UPDATE rutinas SET titulorutina = $1, descripcion = $2 WHERE idrutinas = $3',[updateTitulo,updateDescripcion,idRutina]);
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {generarRecomendacion,guardarRutina}