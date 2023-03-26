import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class RutinasPublicasService {
  urlHttp:string = "http://localhost:3000/users";
  constructor(private httpCliente: HttpClient) {
  }
  devolverRutinasPublicas(): Observable<any>{
    return this.httpCliente.get(this.urlHttp + '/devolverRutinasPublicas/1');
  }
}
