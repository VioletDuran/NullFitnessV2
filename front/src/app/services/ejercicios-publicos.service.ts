import { Injectable } from '@angular/core';
import { EjerciciosPublicosAux } from "./ejercicios-publicos.type";
//import ejercicios from '../../assets/datos/ejercicios.json';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { ConfigService } from './configRutas/config.service';


@Injectable({
  providedIn: 'root'
})


export class EjerciciosPublicosService {

  constructor(private httpClient:HttpClient,private config: ConfigService) {
  }
  ngOnInit(): void {
  }

  devolverEjercicios(): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + "/obtenerEjerciciosTotales"
    return this.httpClient.get(url);
  }


}
