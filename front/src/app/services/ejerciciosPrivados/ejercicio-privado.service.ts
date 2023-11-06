import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {RutinaEjericio} from "./ejercicio-privado.type";
import { ConfigService } from '../configRutas/config.service';

@Injectable({
  providedIn: 'root'
})
export class EjercicioPrivadoService {
  constructor(private httpClient:HttpClient,private config: ConfigService) { }

  private getHttpOptions() {
    return {
        headers: new HttpHeaders({
            token: localStorage.getItem('token') || '',
        }),
    };
  }

  obtenerEjerciciosPrivados(idRutina:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/obtenerEjerciciosPrivados/' + idRutina;
    return this.httpClient.get(url,this.getHttpOptions());
  }

  obtenerEjerciciosPrivadoUsuario(idRutina:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/obtenerEjerciciosPrivadoUsuario/' + idRutina
    return this.httpClient.get(url,this.getHttpOptions());
  }

  obtenerEjerciciosTotales(): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + "/obtenerEjerciciosTotales"
    return this.httpClient.get(url);
  }

  devolverRutinasEspecifica(id:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/devolverRutinasEspecifica/' + id
    return this.httpClient.get(url,this.getHttpOptions());
  }

  eliminarEjercicioDeRutina(rutinaEjericioEliminar:any){
    let url = this.config.mainUrl + this.config.rutinasUrl + "/dataEliminarEjercicioRutina";
    let idRutinaEjercicio: RutinaEjericio = rutinaEjericioEliminar;
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json',
        token: localStorage.getItem('token') || ''
      }),
      body:idRutinaEjercicio
    }
    this.httpClient.delete(url,Options).subscribe()
  }

  añadirEjercicioRutina(ejercicioAñadir:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/anadirEjercicio';
    return this.httpClient.post(url,ejercicioAñadir,this.getHttpOptions());
  }

  revisarExisteEjercicio(ejercicio:any): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + '/revisarEjercicioRutina';
    return this.httpClient.post('http://localhost:3000/users/revisarEjercicioRutina',ejercicio,this.getHttpOptions());
  }
  
  editarInfoRutinaPriv(informacion:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/editarInfoRutinaPriv';
    return this.httpClient.put(url,informacion,this.getHttpOptions());
  }

  esCardio(id:any): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + "/obtenerMusculosEjercicios/" + id;
    return this.httpClient.get(url,this.getHttpOptions());
  }

  añadirEjercicioCardio(datos:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/anadirEjercicioCardio';
    return this.httpClient.post(url,datos,this.getHttpOptions());
  }

  modificarTiempo(datos:any): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + '/modificarTiempo';
    return this.httpClient.put(url,datos,this.getHttpOptions());
  }

  modificarCarga(datos:any): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + '/modificarCarga';
    return this.httpClient.put(url,datos,this.getHttpOptions());
  }

  guardarCalificacion(informacion:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/calificarRutina';
    return this.httpClient.post(url,informacion,this.getHttpOptions());
  }

}
