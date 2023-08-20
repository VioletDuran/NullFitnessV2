import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient,HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  urlHttp:string = 'http://localhost:3000/users';

  private HttpOptions = {
		headers: new HttpHeaders({
			token: localStorage.getItem('token') || '',
		}),
	};
  constructor(private httpClient:HttpClient) { }
  
  cargarDatos(idusuario:string): Observable<any> {
    return this.httpClient.get(this.urlHttp+'/devolverDatos',this.HttpOptions)
  }

  devolverEjercicios(): Observable<any>{
    return this.httpClient.get(this.urlHttp + "/obtenerEjerciciosTotales/1");
  }

  eliminarEjercicioPublico(idejercicio:any){
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json',
        token: localStorage.getItem('token') || ''
      }),
      body:idejercicio
    }
    return this.httpClient.delete(this.urlHttp + "/EliminarEjercicioPublico",Options).subscribe();
  }

  obtenerMusculos(): Observable<any>{
    return this.httpClient.get(this.urlHttp + "/obtenerMusculosTotales/1");
  }

  modificarEjerciciosPublicos(datos:any): Observable<any>{
    return this.httpClient.put(this.urlHttp + "/modificarEjercicioPublico",datos,this.HttpOptions);
  }

  guardarFotoEjercicio(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFotoEjercicio?carpeta=ejerciciosPublico',datoImagen,this.HttpOptions);
  }

  guardarNuevoEjercicio(datos:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarNuevoEjercicio',datos,this.HttpOptions);
  }

  guardarNuevaRutinaPub(datos:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarNuevaRutinaPub',datos,this.HttpOptions);
  }

  devolverRutinasPublicas(): Observable<any>{
    return this.httpClient.get(this.urlHttp + '/devolverRutinasPublicas/1');
  }

  modificarRutinas(datos:any): Observable<any>{
    return this.httpClient.put(this.urlHttp + '/modificarRutinas',datos,this.HttpOptions);
  }

  guardarFotoRutina(datoImagen:any): Observable<any> {
    return this.httpClient.post(this.urlHttp+'/guardarFotoRutinaPub?carpeta=rutinasPublicas',datoImagen,this.HttpOptions);
  }

  eliminarRutinaPub(idrutinas:any){
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json',
        token: localStorage.getItem('token') || ''
      }),
      body:idrutinas
    }
    return this.httpClient.delete(this.urlHttp + "/EliminarRutinasPub",Options).subscribe();
  }

}
