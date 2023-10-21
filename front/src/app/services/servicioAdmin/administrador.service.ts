import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { ConfigService } from '../configRutas/config.service';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  urlHttp:string = 'http://localhost:3000/users';
  constructor(private httpClient:HttpClient,private config: ConfigService) { }

  private getHttpOptions() {
    return {
        headers: new HttpHeaders({
            token: localStorage.getItem('token') || '',
        }),
    };
  }
  
  cargarDatos(idusuario:string): Observable<any> {
    return this.httpClient.get(this.urlHttp+'/devolverDatos',this.getHttpOptions())
  }

  devolverEjercicios(): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + "/obtenerEjerciciosTotales"
    return this.httpClient.get(url);
  }

  eliminarEjercicioPublico(idejercicio:any){
    let url = this.config.mainUrl + this.config.ejercicioUrl + '/EliminarEjercicioPublico';
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json',
        token: localStorage.getItem('token') || ''
      }),
      body:idejercicio
    }
    return this.httpClient.delete(url,Options).subscribe();
  }

  obtenerMusculos(): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + "/obtenerMusculosTotales";
    return this.httpClient.get(url);
  }

  modificarEjerciciosPublicos(datos:any): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + "/modificarEjercicioPublico";
    return this.httpClient.put(url,datos,this.getHttpOptions());
  }

  guardarFotoEjercicio(datoImagen:any): Observable<any> {
    let url = this.config.mainUrl + this.config.ejercicioUrl + '/guardarFotoEjercicio?carpeta=ejerciciosPublico';
    return this.httpClient.post(url,datoImagen,this.getHttpOptions());
  }

  guardarNuevoEjercicio(datos:any): Observable<any> {
    let url = this.config.mainUrl + this.config.ejercicioUrl + '/guardarNuevoEjercicio';
    return this.httpClient.post(url,datos,this.getHttpOptions());
  }

  guardarNuevaRutinaPub(datos:any): Observable<any> {
    let url = this.config.mainUrl + this.config.rutinasUrl + '/guardarNuevaRutinaPub'
    return this.httpClient.post(url,datos,this.getHttpOptions());
  }

  devolverRutinasPublicas(): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/devolverRutinasPublicas';
    return this.httpClient.get(url);
  }

  modificarRutinas(datos:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/modificarRutinas';
    return this.httpClient.put(url,datos,this.getHttpOptions());
  }

  guardarFotoRutina(datoImagen:any): Observable<any> {
    let url = this.config.mainUrl + this.config.rutinasUrl + '/guardarFotoRutinaPub?carpeta=rutinasPublicas';
    return this.httpClient.post(url,datoImagen,this.getHttpOptions());
  }

  eliminarRutinaPub(idrutinas:any){
    let url = this.config.mainUrl + this.config.rutinasUrl + "/EliminarRutinasPub";
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json',
        token: localStorage.getItem('token') || ''
      }),
      body:idrutinas
    }
    return this.httpClient.delete(url,Options).subscribe();
  }

}
