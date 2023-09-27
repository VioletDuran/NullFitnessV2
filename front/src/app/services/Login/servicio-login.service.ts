import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ServicioLoginService {
  private readonly url: string = "http://localhost:3000/users";
  private readonly USUARIO_LOGIN_ENDPOINT = "/login";

  idUsuario: string = "";
  tipoUsuario: string = "";
  isLoggedIn: boolean = false;
  private helper = new JwtHelperService();

  constructor(private httpClient: HttpClient) { }

  logearUsuario(correo: string, contraseña: string): Observable<{ token: string }> {
    const body = { correo, contraseña };
    const endpoint = this.url + this.USUARIO_LOGIN_ENDPOINT;

    return this.httpClient.post<{ token: string }>(endpoint, body).pipe(
      tap((res) => {
        const decodedToken = this.helper.decodeToken(res.token);
        this.storeTokenData(decodedToken);
        localStorage.setItem('token', res.token);
      })
    );
  }

  private storeTokenData(decodedToken: any): void {
    this.idUsuario = decodedToken.data.idusuario;
    this.tipoUsuario = decodedToken.data.tipousuario;
    this.isLoggedIn = true;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  loggedIn(): boolean {
    if (this.isLoggedIn) {
      return true;
    }

    const token = localStorage.getItem('token') ?? '';

    if (this.helper.isTokenExpired(token)) {
      this.logout();  // Se añadieron los paréntesis para llamar a la función.
      return false;
    }

    this.storeTokenData(this.helper.decodeToken(token));
    return true;
  }
}
