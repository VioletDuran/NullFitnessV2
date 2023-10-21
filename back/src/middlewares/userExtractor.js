const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.status(400).send({ error: 'Token no proporcionado' });
    }
    const secretKey = process.env.secretkey;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send({ error: 'No estas autorizado' });
        } else {
            req.idusuario = decoded.data;
            next();
        }
    });
}