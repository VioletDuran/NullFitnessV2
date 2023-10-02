const jwt = require('jsonwebtoken');

function userExtractor(req,res,next){
    try {
        const token = req.headers['token'];        
        const secretKey = process.env.secretkey;
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send({error:'No estas autorizado'});
            } else {
              req.idusuario = decoded.data;
              next();
            }
        });
    } catch (error) {
        console.log(error)
        res.send(false)
    }
}

module.exports = {userExtractor}