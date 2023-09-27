import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {RutinaEjericio} from "./ejercicio-privado.type";

@Injectable({
  providedIn: 'root'
})
export class EjercicioPrivadoService {
  url: String = "http://localhost:3000/users";
  private HttpOptions = {
		headers: new HttpHeaders({
			token: localStorage.getItem('token') || '',
		}),
	};
  constructor(private httpClient:HttpClient) { }

  obtenerEjerciciosPrivados(idRutina:any): Observable<any>{
    let url = '/obtenerEjerciciosPrivados/' + idRutina;
    return this.httpClient.get("http://localhost:3000/users" + url,this.HttpOptions);
  }

  obtenerEjerciciosPrivadoUsuario(idRutina:any): Observable<any>{
    let url = '/obtenerEjerciciosPrivadoUsuario/' + idRutina;
    return this.httpClient.get("http://localhost:3000/users" + url,this.HttpOptions);
  }

  obtenerEjerciciosTotales(): Observable<any>{
    return this.httpClient.get("http://localhost:3000/users" + "/obtenerEjerciciosTotales/1");
  }

  devolverRutinasEspecifica(id:any): Observable<any>{
    let url = 'devolverRutinasEspecifica/' + id;
    return this.httpClient.get("http://localhost:3000/users/" + url,this.HttpOptions);
  }

  eliminarEjercicioDeRutina(rutinaEjericioEliminar:any){
    let idRutinaEjercicio: RutinaEjericio = rutinaEjericioEliminar;
    let Options = {
      headers: new HttpHeaders({
        'Conten.type': 'application/json',
        token: localStorage.getItem('token') || ''
      }),
      body:idRutinaEjercicio
    }
    this.httpClient.delete(this.url+"/dataEliminarEjercicioRutina",Options).subscribe()
  }

  añadirEjercicioRutina(ejercicioAñadir:any): Observable<any>{
    return this.httpClient.post('http://localhost:3000/users/anadirEjercicio',ejercicioAñadir,this.HttpOptions);
  }

  revisarExisteEjercicio(ejercicio:any): Observable<any>{
    return this.httpClient.post('http://localhost:3000/users/revisarEjercicioRutina',ejercicio,this.HttpOptions);
  }
  
  editarInfoRutinaPriv(informacion:any): Observable<any>{
    return this.httpClient.put('http://localhost:3000/users/editarInfoRutinaPriv',informacion,this.HttpOptions);
  }

  esCardio(id:any): Observable<any>{
    return this.httpClient.get('http://localhost:3000/users/esCardio/' + id,this.HttpOptions);
  }

  añadirEjercicioCardio(datos:any): Observable<any>{
    return this.httpClient.post('http://localhost:3000/users/anadirEjercicioCardio',datos,this.HttpOptions);
  }

  modificarTiempo(datos:any): Observable<any>{
    return this.httpClient.put('http://localhost:3000/users/modificarTiempo',datos,this.HttpOptions);
  }

  modificarCarga(datos:any): Observable<any>{
    return this.httpClient.put('http://localhost:3000/users/modificarCarga',datos,this.HttpOptions);
  }

}
