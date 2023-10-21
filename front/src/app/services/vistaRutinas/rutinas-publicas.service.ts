import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import { ConfigService } from '../configRutas/config.service';


@Injectable({
  providedIn: 'root'
})

export class RutinasPublicasService {
  constructor(private httpCliente: HttpClient,private config: ConfigService) {
  }
  devolverRutinasPublicas(): Observable<any>{
    let url = this.config.mainUrl + this.config.rutinasUrl + '/devolverRutinasPublicas';
    return this.httpCliente.get(url);
  }
}
