DROP TABLE IF EXISTS tipoUsuarios ;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS tipoUsuarios (
  idTipo INT NOT NULL,
  tipo text NOT NULL,
  PRIMARY KEY (idTipo))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY

-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES DEMO *** ------------------------------------
-- Table `usuarios`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS usuarios ;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE SEQUENCE usuarios_seq;

CREATE TABLE IF NOT EXISTS usuarios (
  idUsuario INT NOT NULL DEFAULT NEXTVAL ('usuarios_seq'),
  tipoUsuario INT NOT NULL,
  correo text NOT NULL,
  contraseña text NOT NULL,
  nombreUsuario text NOT NULL,
  edad INT NOT NULL,
  nombre text NOT NULL,
  foto text NULL,
  peso INT NULL,
  nacionalidad text NULL,
  contextura text NULL,
  objetivo text NULL,
  cantidad_ejercicio INT NULL,
  PRIMARY KEY (idUsuario),
  CONSTRAINT tipo_usuario
    FOREIGN KEY (tipoUsuario)
    REFERENCES tipoUsuarios (idTipo)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY



-- SQLINES DEMO *** ------------------------------------
-- Table `rutinas`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS rutinas ;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE SEQUENCE rutinas_seq;

CREATE TABLE IF NOT EXISTS rutinas (
  idrutinas INT NOT NULL DEFAULT NEXTVAL ('rutinas_seq'),
  tituloRutina text NOT NULL,
  foto text NOT NULL,
  descripcion text NULL,
  idUsuario INT NULL,
  PRIMARY KEY (idrutinas),
  CONSTRAINT idUsuario
    FOREIGN KEY (idUsuario)
    REFERENCES usuarios (idUsuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY



-- SQLINES DEMO *** ------------------------------------
-- Table `ejercicios`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS ejercicios ;
CREATE SEQUENCE ejercicios_seq;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS ejercicios (
  idEjercicio INT NOT NULL DEFAULT NEXTVAL ('ejercicios_seq'),
  tituloEjercicio text NOT NULL,
  tituloFoto text NOT NULL,
  foto text NOT NULL,
  descripcion TEXT NOT NULL,
  video text NOT NULL,
  PRIMARY KEY (idEjercicio))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY



-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** ercicios`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS rutinas_ejercicios ;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS rutinas_ejercicios (
  idRutinas INT NOT NULL,
  idEjercicios INT NOT NULL,
  PRIMARY KEY (idRutinas, idEjercicios),
  CONSTRAINT idRutinas
    FOREIGN KEY (idRutinas)
    REFERENCES rutinas (idrutinas)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT idEjercicios
    FOREIGN KEY (idEjercicios)
    REFERENCES ejercicios (idEjercicio)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY



-- SQLINES DEMO *** ------------------------------------
-- Table `musculos`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS musculos ;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE SEQUENCE musculos_seq;

CREATE TABLE IF NOT EXISTS musculos (
  idMusculo INT NOT NULL DEFAULT NEXTVAL ('musculos_seq'),
  musculo text NOT NULL,
  PRIMARY KEY (idMusculo))
;

-- SQLINES LICENSE FOR EVALUATION USE ONLY


-- SQLINES LICENSE FOR EVALUATION USE ONLY



-- SQLINES DEMO *** ------------------------------------
-- SQLINES DEMO *** _musculos`
-- SQLINES DEMO *** ------------------------------------
DROP TABLE IF EXISTS ejercicios_musculos ;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE IF NOT EXISTS ejercicios_musculos (
  idEjercicio INT NOT NULL,
  idMusculo INT NOT NULL,
  PRIMARY KEY (idEjercicio, idMusculo),
  CONSTRAINT idEjercicio
    FOREIGN KEY (idEjercicio)
    REFERENCES ejercicios (idEjercicio)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT idMusculo
    FOREIGN KEY (idMusculo)
    REFERENCES musculos (idMusculo)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
;



-- SQLINES LICENSE FOR EVALUATION USE ONLY


/* SET SQL_MODE=@OLD_SQL_MODE; */
/* SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; */
/* SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS; */
