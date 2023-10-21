import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { ConfigService } from '../configRutas/config.service';

@Injectable({
  providedIn: 'root'
})
export class BusquedaServiceService {

  constructor(private httpClient:HttpClient,private config: ConfigService) { 
  }

  devolverCoincidencias(coincidencia:string): Observable<any>{
    let url = this.config.mainUrl + this.config.ejercicioUrl + '/devolverCoincidencias/' + coincidencia;
    return this.httpClient.get(url);
  }

}
