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
  completarRegistro(registroLleno:any){
    let form: Registro = registroLleno;
    this.httpClient.post(this.url+"/registro",form).subscribe();
  }
  revisarCorreo(correo:any): Observable<any> {
    return this.httpClient.get(this.url+`/${correo}`);
  }
}
