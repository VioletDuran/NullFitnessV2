const OpenAI = require("openai");
const pool = require('../config/db.config')
require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function generarPrompt(){
    var ejercicios = '';
    var prompt = `Con los siguientes ejercicios, quiero una rutina fisica que se enfoque en fortalecer los gluteos, necesito que solamente me entregues los id, con sus respectivas series y repeticiones, no me escribas nada aparte de lo solicitado\n`
    try {
        await pool
        .query('select idejercicio,tituloejercicio from ejercicios;')
        .then(results => {
            for(x in results.rows){
                ejercicios = ejercicios + "Id:" + results.rows[x].idejercicio + " Nombre:" + results.rows[x].tituloejercicio + "\n";
            }
        })
        prompt = prompt + ejercicios;
        return prompt;
    } catch (error) {
        res.status(444).send({msg: "Error al consultar los ejercicios de la base de datos"});
    }
}

const generarRecomendacion = async(req,res) =>{
    var prompt = await generarPrompt();
    prompt = prompt + "te recalco que no me muestres nada mas que lo solicitado, es decir solamente los ID y las series con repeticiones, y separado en la siguiente estructura: ID:, Series:, Repeticiones:"
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{"role": "user", "content": prompt}],
      });
    console.log('****************');
    console.log(chatCompletion.choices[0].message);
}

module.exports = {generarRecomendacion}