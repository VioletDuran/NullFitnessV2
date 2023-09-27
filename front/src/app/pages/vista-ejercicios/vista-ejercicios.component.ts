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
      if(this.servicioLogin.isLoggedIn){
        forkJoin([
          this.servicioEjercicio.obtenerEjerciciosTotales(),
          this.servicioPerfil.obtenerRutinas(this.idUsuario)
          ]
      ).subscribe(([ejerciciosTotales,rutinasUsuario])=>{
        this.arrayEjercicios = ejerciciosTotales;

        this.rutinasUsuario = rutinasUsuario;
        this.datosCargados = true;
      })
      }else{
        this.servicioEjercicio.obtenerEjerciciosTotales().subscribe((valor) =>{
          this.arrayEjercicios = valor;
          this.datosCargados = true;
        })
      }
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
            this.servicioEjercicio.revisarExisteEjercicio({ idrutinas: idrutinas, idejercicios: String(idejercicios)}).subscribe((valor) =>{
              console.log(valor)
              if(valor == false){
                Swal.fire({
                  title: 'Este ejercicio ya se encuentra en esta rutina',
                  text: 'Porfavor elige otro ejercicio',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: 'green'
                })
              }else{
                  this.servicioEjercicio.esCardio(idejercicios).subscribe((valor:Array<any>) => {
                    const existe = valor.some(valor => valor.idmusculo === 10);
                    if(existe){
                          Swal.fire({
                            title: '¿Cuanto tiempo en minutos?',
                            html: `<input type="number" class="swal2-input" placeholder="Minutos" id="tiempo">`,
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: 'green',
                            preConfirm: () =>{
                              const tiempo = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#tiempo'))?.value;
                              let tiempoEjer = Number(tiempo);
                              if(tiempoEjer < 1 || tiempoEjer > 180){
                                Swal.showValidationMessage(`Porfavor ingresa un tiempo valido entre 1 y 180`);
                              }else{
                                this.servicioEjercicio.añadirEjercicioCardio({ idrutinas: idrutinas, idejercicios: String(idejercicios), tiempo: tiempoEjer}).subscribe((valor) => {
                                  console.log(valor);
                                  Swal.fire({
                                    title: 'Se agrego ejercicio correctamente!',
                                    icon: 'success',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: 'green',
                                    preConfirm: () => {
                                      location.reload();
                                    }
                                  })
                                }) 
                              }
                            }
                          })
                    }else{
                          Swal.fire({
                          title: '¿Cuantas series y repeticiones?',
                          html:`<input type="number" class="swal2-input" placeholder="Series" id="series">
                                <hr>
                                <input type="number" class="swal2-input" placeholder="Repeticiones" id = "repeticiones">
                                <hr>`,
                          confirmButtonText: 'Aceptar',
                          confirmButtonColor: 'green',   
                          preConfirm: () =>{
                            const series = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#series'))?.value;
                            let seriesEjercicio = Number(series);
                
                            const repes = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#repeticiones'))?.value;
                            let repesEjercicio = Number(repes);

                            if(seriesEjercicio < 1 || seriesEjercicio > 99){
                              Swal.showValidationMessage(`Porfavor ingresa series valida entre 1 y 99`);
                            }
                            else if(repesEjercicio < 1 || repesEjercicio > 99){
                              Swal.showValidationMessage(`Porfavor ingresa repeticiones validas entre 1 y 99`);
                            }else{
                              this.servicioEjercicio.añadirEjercicioRutina({ idrutinas: idrutinas, idejercicios: String(idejercicios), series: series , repeticiones: repes}).subscribe((valor) => {
                                console.log(valor);
                                Swal.fire({
                                  title: 'Se agrego ejercicio correctamente!',
                                  icon: 'success',
                                  confirmButtonText: 'Aceptar',
                                  confirmButtonColor: 'green',
                                  preConfirm: () => {
                                    location.reload();
                                  }
                                })
                              }) 
                            }
                          }   
                        })
                    }
                  })
              }
            });
        }
      })
    }
  }
}