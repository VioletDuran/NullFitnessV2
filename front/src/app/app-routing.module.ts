import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './pages/mainpage/mainpage.component';
import { VistaEjerciciosComponent } from './pages/vista-ejercicios/vista-ejercicios.component';
import { VistaRutinasComponent } from './pages/vista-rutinas/vista-rutinas.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { EjercicioComponent } from './pages/ejercicio/ejercicio.component';
import { LoginRegistroComponent } from './pages/login-registro/login-registro.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { MisEjerciciosComponent } from './pages/mis-ejercicios/mis-ejercicios.component';
import { AdministradorComponent } from './pages/administrador/administrador/administrador.component';
import { EjerciciosRutinasPublicosComponent } from './pages/ejerciciosRutinasPublicos/ejercicios-rutinas-publicos/ejercicios-rutinas-publicos.component';
const routes: Routes = [
  {path:'Ejercicios',component:VistaEjerciciosComponent},
  {path:'Rutinas',component:VistaRutinasComponent},
  {path:'MiPerfil',component:MiPerfilComponent},
  {path:'Ejercicio/:id',component:EjercicioComponent},
  {path:'Login',component:LoginRegistroComponent},
  {path:'Registro', component:RegistroComponent},
  {path:'MisEjercicios/:id', component:MisEjerciciosComponent},
  {path:'Administrador',component:AdministradorComponent},
  {path:'EjerciciosRutinasPublicas/:id',component:EjerciciosRutinasPublicosComponent},
  {path:'',component:MainpageComponent},
  {path:'**',redirectTo:''}
];

@NgModule({
  imports: [
  RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled',
  onSameUrlNavigation: 'reload',
  useHash: true
  }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
