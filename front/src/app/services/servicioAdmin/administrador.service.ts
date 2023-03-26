import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient,HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  urlHttp:string = 'http://localhost:3000/users';
  constructor(private httpClient:HttpClient) { }
  
  cargarDatos(idusuario:string): Observable<any> {
    return this.httpClient.get(this.urlHttp+'/devolverDatos'+`/${idusuario}`)
  }

  devolverEjercicios(): Observable<any>{
    return this.httpClient.get(this.urlHttp + "/obtenerEjerciciosTotales/1");
  }

  eliminarEjercicioPublico(idejercicio:any){
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json'
      }),
      body:idejercicio
    }
    return this.httpClient.delete(this.urlHttp + "/EliminarEjercicioPublico",Options).subscribe();
  }

  obtenerMusculos(): Observable<any>{
    return this.httpClient.get(this.urlHttp + "/obtenerMusculosTotales/1");
  }

  modificarEjerciciosPublicos(datos:any): Observable<any>{
    return this.httpClient.put(this.urlHttp + "/modificarEjercicioPublico",datos);
  }

  guardarFotoEjercicio(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFotoEjercicio?carpeta=ejerciciosPublico',datoImagen);
  }

  guardarNuevoEjercicio(datos:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarNuevoEjercicio',datos);
  }

  guardarNuevaRutinaPub(datos:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarNuevaRutinaPub',datos);
  }

  devolverRutinasPublicas(): Observable<any>{
    return this.httpClient.get(this.urlHttp + '/devolverRutinasPublicas/1');
  }

  modificarRutinas(datos:any): Observable<any>{
    return this.httpClient.put(this.urlHttp + '/modificarRutinas',datos);
  }

  guardarFotoRutina(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFotoRutinaPub?carpeta=rutinasPublicas',datoImagen);
  }

  eliminarRutinaPub(idrutinas:any){
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json'
      }),
      body:idrutinas
    }
    return this.httpClient.delete(this.urlHttp + "/EliminarRutinasPub",Options).subscribe();
  }

}
