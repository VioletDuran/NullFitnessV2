import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusquedaServiceService {

  constructor(private httpClient:HttpClient) { 
  }

  devolverCoincidencias(coincidencia:string): Observable<any>{
    let url = 'devolverCoincidencias/' + coincidencia;
    return this.httpClient.get("http://localhost:3000/users/" + url);
  }

}
