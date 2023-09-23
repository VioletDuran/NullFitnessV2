export interface vistaPerfil{
    idrutinas:string;
    titulorutina:string;
    //ejercicios:string[];
    foto:string;
    descripcion: string;
}

export interface datosModificables{
    idusuario: string;
    edad: string;
    peso: string;
    objetivo: string;
    genero: string;
    altura: string;
    experiencia: string;
}

export interface usuarioFinal{
    idusuario : string, 
    nombreusuario : string,
    nombre: string, 
    edad : string, 
    peso : string, 
    nacionalidad : string, 
    contextura : string, 
    objetivo : string, 
    cantidad_ejercicio : string
}
