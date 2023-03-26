import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServicioEjerciciosRutService {
  url: String = "http://localhost:3000/users";
  constructor(private httpClient:HttpClient) { }

  obtenerEjerciciosPrivados(idRutina:any): Observable<any>{
    let url = '/obtenerEjerciciosPrivados/' + idRutina;
    return this.httpClient.get("http://localhost:3000/users" + url);
  }
  
  devolverRutinasEspecifica(id:any): Observable<any>{
    let url = 'devolverRutinasEspecifica/' + id;
    return this.httpClient.get("http://localhost:3000/users/" + url);
  }

  obtenerEjerciciosTotales(): Observable<any>{
    return this.httpClient.get("http://localhost:3000/users" + "/obtenerEjerciciosTotales/1");
  }
}
