const pool = require('../config/db.config')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
const fotoOriginal = "../../../assets/img/usuario.png"
const nodemailer = require('nodemailer');

const guardarRecuperacion = async(req,res) =>{
  const { token, nuevaContrasena } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hashSync(nuevaContrasena, 10); 
    await pool.query('UPDATE usuarios SET contraseña = $1 WHERE idusuario = $2', [hashedPassword, payload.idusuario]);
    res.status(200).send({error:'Tu contraseña ha sido restablecida.'});
  } catch (error) {
    console.log(error);
    res.status(500).send({error:'Error al restablecer la contraseña.'});
  }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

const solicitarRecuperacion = async(req,res) =>{
    const email= req.body;
    try {
      const user = await pool.query('SELECT idusuario FROM usuarios WHERE correo = $1', [email.correo]);
      if (user.rowCount === 0) {
        return res.status(400).send('Correo no encontrado.');
      }

      const token = jwt.sign({ idusuario: user.rows[0].idusuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const resetUrl = `http://localhost:4200/#/SolicitarPassword?token=${token}`;
  
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email.correo,
        subject: 'Recuperación de contraseña',
        text: `Para restablecer tu contraseña, por favor sigue este enlace: ${resetUrl}`
      };
      await transporter.sendMail(mailOptions);
      res.status(200).send({error:'Se ha enviado un enlace de recuperación a tu correo electrónico.'});
    } catch (error) {
      res.status(500).send('Error al solicitar la recuperación de contraseña.');
    }
}

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

const consultarCantidad = async(req,res) => {
    // Obtener el user_id del token (asegúrate de implementar la autenticación adecuada)
  const user_id = req.idusuario.idusuario;
  const fechaActual = new Date().toISOString().slice(0, 10); // Formato de fecha AAAA-MM-DD

  try {
    // Iniciar transacción
    await pool.query('BEGIN');

    // Consultar el uso actual del día
    const usoDelDia = await pool.query(
      'SELECT contador FROM usos_funcionalidad WHERE user_id = $1 AND fecha_uso = $2',
      [user_id, fechaActual]
    );

    if (usoDelDia.rowCount > 0) {
      // Ya hay registros para hoy, comprobar si el usuario puede usar la funcionalidad
      if (usoDelDia.rows[0].contador >= 6) {
        // Usuario ha alcanzado el límite
        await pool.query('COMMIT');
        return res.status(429).json({ error: 'Has alcanzado el límite de usos por hoy.' });
      } else {
        // Incrementar el contador
        await pool.query(
          'UPDATE usos_funcionalidad SET contador = contador + 1 WHERE user_id = $1 AND fecha_uso = $2',
          [user_id, fechaActual]
        );
      }
    } else {
      // No hay registros para hoy, crear uno nuevo
      await pool.query(
        'INSERT INTO usos_funcionalidad (user_id, fecha_uso, contador) VALUES ($1, $2, $3)',
        [user_id, fechaActual, 1]
      );
    }

    // Finalizar transacción
    await pool.query('COMMIT');

    // Realizar la funcionalidad aquí, luego enviar respuesta al cliente
    res.json({ success: 'La funcionalidad se ha utilizado con éxito.' });
  } catch (error) {
    // Si hay un error, revertir la transacción
    await pool.query('ROLLBACK');
    console.error('Error al usar la funcionalidad:', error);
    res.status(500).json({ error: 'Error del servidor al intentar usar la funcionalidad.' });
  }
}

module.exports = {registrarUsuario,loginUsuario,guardarFoto,devolverDatos,revisarCorreo,modificarDatos,consultarCantidad,solicitarRecuperacion,guardarRecuperacion}