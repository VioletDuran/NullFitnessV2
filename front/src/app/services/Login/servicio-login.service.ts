import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './servicio-login.type';
import { JwtHelperService } from '@auth0/angular-jwt';
import { datosModificables } from '../VistaPerfil/vista-perfil.type';

@Injectable({
  providedIn: 'root'
})
export class ServicioLoginService {
  url:string = "http://localhost:3000/users";
  idUsuario: string = "";
  tipoUsuario: string = "";
  isLoggedIn:boolean = false;
  helper = new JwtHelperService();
  
  constructor(private httpClient:HttpClient) { }

  llenarToken(Token:any){
    this.idUsuario = Token.data.idusuario;
    this.tipoUsuario = Token.data.tipousuario;
    this.isLoggedIn = true;
  }

  async devolverLogin(correo:any,contraseña:any){
    const url = this.url +'/login';
      try{
        var request = await fetch(url, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          'body': JSON.stringify({"correo": correo, "contraseña": contraseña})
        });
        
        let body = await request.json()
        if (request.status == 400) {
          return false
        }
        const decodedToken = this.helper.decodeToken(body.token);
        this.llenarToken(decodedToken);
        localStorage.setItem('token', body.token);
        return true;
      } catch(error) {
        console.log('error fetch', error)
        return false;
      }
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }
  
  loggedIn():any {
    const token =  localStorage.getItem('token') ?? '';
    if (this.helper.isTokenExpired(token) == true) {
      this.logout;
      return false
    }
    if(this.isLoggedIn == false){
      this.llenarToken(this.helper.decodeToken(token));
    }
  }

}
