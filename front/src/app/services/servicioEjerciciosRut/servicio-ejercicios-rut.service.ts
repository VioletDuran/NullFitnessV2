import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../configRutas/config.service';


@Injectable({
  providedIn: 'root'
})
export class ServicioEjerciciosRutService {

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
  
  devolverRutinasEspecifica(id:any): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/devolverRutinasEspecifica/' + id
    return this.httpClient.get("http://localhost:3000/users/" + url,this.getHttpOptions());
  }

  obtenerEjerciciosTotales(): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + "/obtenerEjerciciosTotales"
    return this.httpClient.get(url);
  }
}
