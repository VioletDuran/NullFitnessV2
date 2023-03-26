import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {RutinaEjericio} from "./ejercicio-privado.type";

@Injectable({
  providedIn: 'root'
})
export class EjercicioPrivadoService {
  url: String = "http://localhost:3000/users";
  constructor(private httpClient:HttpClient) { }

  obtenerEjerciciosPrivados(idRutina:any): Observable<any>{
    let url = '/obtenerEjerciciosPrivados/' + idRutina;
    return this.httpClient.get("http://localhost:3000/users" + url);
  }

  obtenerEjerciciosTotales(): Observable<any>{
    return this.httpClient.get("http://localhost:3000/users" + "/obtenerEjerciciosTotales/1");
  }

  devolverRutinasEspecifica(id:any): Observable<any>{
    let url = 'devolverRutinasEspecifica/' + id;
    return this.httpClient.get("http://localhost:3000/users/" + url);
  }

  eliminarEjercicioDeRutina(rutinaEjericioEliminar:any){
    let idRutinaEjercicio: RutinaEjericio = rutinaEjericioEliminar;
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json'
      }),
      body:idRutinaEjercicio
    }
    this.httpClient.delete(this.url+"/dataEliminarEjercicioRutina",Options).subscribe()
  }

  añadirEjercicioRutina(ejercicioAñadir:any): Observable<any>{
    return this.httpClient.post('http://localhost:3000/users/anadirEjercicio',ejercicioAñadir);
  }
  
  editarInfoRutinaPriv(informacion:any): Observable<any>{
    return this.httpClient.put('http://localhost:3000/users/editarInfoRutinaPriv',informacion);
  }

}
