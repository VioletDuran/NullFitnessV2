import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registro } from './registro-service.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroServiceService {
  url:string = "http://localhost:3000/users"
  constructor(private httpClient:HttpClient) {
  }

  completarRegistro(registroLleno:any):Observable<any>{
    return this.httpClient.post(this.url+"/registro",registroLleno);
  }

  recuperarPass(correo:any): Observable<any>{
    return this.httpClient.post(this.url + '/solicitar-recuperacion',correo);
  }

  guardarPass(datos:any): Observable<any>{
    return this.httpClient.post(this.url + '/guardarRecuperacion',datos);
  }
}
