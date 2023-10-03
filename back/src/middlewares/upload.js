const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (res, file, cb) {
      const fileName = file.originalname;
      cb(null, `${fileName}`);
    },
    destination: function (res, file, cb) {
      const carpeta = res.query['carpeta'];
      if(carpeta == undefined){
        cb(null, './public');
      }else{
        cb(null, './public/' + carpeta);
      }
      
    },
  });
module.exports = multer({ storage });