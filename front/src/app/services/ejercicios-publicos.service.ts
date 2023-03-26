import { Injectable } from '@angular/core';
import { EjerciciosPublicosAux } from "./ejercicios-publicos.type";
//import ejercicios from '../../assets/datos/ejercicios.json';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})


export class EjerciciosPublicosService {
  urlHttp:string = "http://localhost:3000/users";
  constructor(private httpClient:HttpClient) {
  }
  ngOnInit(): void {
  }

  devolverEjercicios(): Observable<any>{
    return this.httpClient.get(this.urlHttp + "/obtenerEjerciciosTotales/1");
  }


}
