import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { VistaEjerciciosComponent } from './pages/vista-ejercicios/vista-ejercicios.component';
import { VistaRutinasComponent } from './pages/vista-rutinas/vista-rutinas.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { EjercicioComponent } from './pages/ejercicio/ejercicio.component';
import { LoginRegistroComponent } from './pages/login-registro/login-registro.component';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';"@angular/forms";
import { RegistroComponent } from './pages/registro/registro.component';
import { MisEjerciciosComponent } from './pages/mis-ejercicios/mis-ejercicios.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxCaptchaModule } from 'ngx-captcha';
import {CommonModule} from '@angular/common';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { AdministradorComponent } from './pages/administrador/administrador/administrador.component';
import { EjerciciosRutinasPublicosComponent } from './pages/ejerciciosRutinasPublicos/ejercicios-rutinas-publicos/ejercicios-rutinas-publicos.component';


@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    HeaderComponent,
    FooterComponent,
    VistaEjerciciosComponent,
    VistaRutinasComponent,
    MiPerfilComponent,
    EjercicioComponent,
    LoginRegistroComponent,
    RegistroComponent,
    MisEjerciciosComponent,
    AdministradorComponent,
    EjerciciosRutinasPublicosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxCaptchaModule,
    FormsModule,
    CommonModule,
    AutocompleteLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
