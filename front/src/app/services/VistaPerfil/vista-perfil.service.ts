import { Injectable } from '@angular/core';
import { vistaPerfil } from './vista-perfil.type';
//import rutinas from '../../../assets/datos/misRutinas.json';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import { datosModificables } from './vista-perfil.type';


@Injectable({
  providedIn: 'root'
})
export class VistaPerfilService {
  url:string = '../../../assets/datos/misRutinas.json';
  urlHttp:string = "http://localhost:3000/users";
  constructor(private httpClient:HttpClient) {
  }
  
  ngOnInit(): void { 
  }

  devolverRutinas(): Observable<any>{
    return this.httpClient.get(this.url);
  }
 
  obtenerRutinas(idusuario:string): Observable<any>{
    return this.httpClient.get(this.urlHttp +'/devolverRutinas'+`/${idusuario}`);
  }

  encontrarRutina(id:string | any, rutinas:vistaPerfil[]){
    return rutinas.find(rutinas => rutinas.idrutinas === id);
  }

  actualizarInformacionUsuario(usuario:datosModificables): Observable<any>{
    return this.httpClient.put(this.urlHttp + "/modificarDatos",usuario);
  }

  cargarDatos(idusuario:string): Observable<any> {
    return this.httpClient.get(this.urlHttp+'/devolverDatos'+`/${idusuario}`)
  }

  guardarFoto(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFoto',datoImagen);
  }
  guardarFotoRutina(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFotoRutina?carpeta=rutinasPrivadas',datoImagen);
  }
}

