import { Injectable } from '@angular/core';
import { vistaPerfil } from './vista-perfil.type';
//import rutinas from '../../../assets/datos/misRutinas.json';
import { HttpClient, HttpHeaders} from '@angular/common/http';
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

  private getHttpOptions() {
    return {
        headers: new HttpHeaders({
            token: localStorage.getItem('token') || '',
        }),
    };
}

  devolverRutinas(): Observable<any>{
    return this.httpClient.get(this.url);
  }

  obtenerRutinas(idusuario:string): Observable<any>{
    return this.httpClient.get(this.urlHttp +'/devolverRutinas',this.getHttpOptions());
  }

  encontrarRutina(id:string | any, rutinas:vistaPerfil[]){
    return rutinas.find(rutinas => rutinas.idrutinas === id);
  }

  actualizarInformacionUsuario(usuario:datosModificables): Observable<any>{
    return this.httpClient.put(this.urlHttp + "/modificarDatos",usuario,this.getHttpOptions());
  }

  cargarDatos(idusuario:string): Observable<any> {
    return this.httpClient.get(this.urlHttp+'/devolverDatos',this.getHttpOptions());
  }

  guardarFoto(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFoto',datoImagen,this.getHttpOptions());
  }

  guardarFotoRutina(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFotoRutina?carpeta=rutinasPrivadas',datoImagen,this.getHttpOptions());
  }

  generarRutinaUsuario(datos:any): Observable<any>{
    return this.httpClient.post("http://localhost:3000/gpt/rutinaGenerada",datos,this.getHttpOptions());
  }

  guardarRutinaUsuario(datos:any): Observable<any>{
    return this.httpClient.post("http://localhost:3000/gpt/guardarRutinaGenerada",datos,this.getHttpOptions());
  }
}

