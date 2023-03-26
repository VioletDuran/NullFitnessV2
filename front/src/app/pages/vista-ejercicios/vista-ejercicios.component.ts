import { Component, OnInit } from '@angular/core';
import {EjerciciosPublicosAux} from "../../services/ejercicios-publicos.type";
import {EjercicioPrivadoService} from "../../services/ejerciciosPrivados/ejercicio-privado.service";
import {ServicioLoginService} from "../../services/Login/servicio-login.service";
import { VistaPerfilService } from 'src/app/services/VistaPerfil/vista-perfil.service';
import { Rutina } from 'src/app/services/ejerciciosPrivados/ejercicio-privado.type';
import Swal from "sweetalert2";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-vista-ejercicios',
  templateUrl: './vista-ejercicios.component.html',
  styleUrls: ['./vista-ejercicios.component.scss']
})

export class VistaEjerciciosComponent implements OnInit {
  arrayEjercicios:EjerciciosPublicosAux[] = [];
  datosCargados:boolean = false;
  idUsuario:string = '';
  tipoUsuario:string = '';
  rutinasUsuario:Rutina[]  = [];
  constructor(private servicioEjercicio:EjercicioPrivadoService, private servicioLogin:ServicioLoginService, private servicioPerfil:VistaPerfilService) {
  }
  ngOnInit(): void {
      this.servicioLogin.loggedIn();
      this.idUsuario = this.servicioLogin.idUsuario;
      this.tipoUsuario = this.servicioLogin.tipoUsuario;
      forkJoin([
          this.servicioEjercicio.obtenerEjerciciosTotales(),
          this.servicioPerfil.obtenerRutinas(this.idUsuario)
          ]
      ).subscribe(([ejerciciosTotales,rutinasUsuario])=>{
        this.arrayEjercicios = ejerciciosTotales;

        this.rutinasUsuario = rutinasUsuario;
        this.datosCargados = true;
      })
    }
  agregarEjercicios(idejercicios:string) {
    if(this.servicioLogin.isLoggedIn == false){
      Swal.fire({
        title: 'Debes logearte para usar esta funcion!',
        text: 'Porfavor inicia sesion',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
    }else{
      Swal.fire({
        title: '¿Cual rutina deseas agregar este ejercicio?',
        html: `<select class="swal2-input" id="rutina" name="rutina" style="width: 17rem">
                      ${this.rutinasUsuario.map((rutina) => {
            return `<option value="${rutina.idrutinas}" class = "swal2-input">${rutina.titulorutina}</option>`
        })}
                  </select>
                `,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green',
        preConfirm: () => {
            const idrutinas = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#rutina'))?.value;
            this.servicioEjercicio.añadirEjercicioRutina({ idrutinas: idrutinas, idejercicios: String(idejercicios)}).subscribe((valor) =>{
              if(valor == false){
                Swal.fire({
                  title: 'Este ejercicio ya se encuentra en esta rutina',
                  text: 'Porfavor elige otro ejercicio',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: 'green'
                })
              }else{
                Swal.fire({
                  title: 'Ejercicio incluido de forma correcta!',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: 'green'
                })
              }
            });
        }
      })
    }
  }
}