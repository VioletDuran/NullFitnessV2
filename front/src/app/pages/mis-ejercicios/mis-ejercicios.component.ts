import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EjercicioPrivadoService } from 'src/app/services/ejerciciosPrivados/ejercicio-privado.service';
import {Rutina, RutinaEjericio} from 'src/app/services/ejerciciosPrivados/ejercicio-privado.type';
import { EjerciciosPublicosAux } from '../../services/ejercicios-publicos.type';
import { forkJoin } from 'rxjs';
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';


@Component({
  selector: 'app-mis-ejercicios',
  templateUrl: './mis-ejercicios.component.html',
  styleUrls: ['./mis-ejercicios.component.scss']
})
export class MisEjerciciosComponent implements OnInit {

  idEjerciciosUsuario: any = [];
  ejerciciosUsuario : EjerciciosPublicosAux[] = [];
  ejerciciosTotales : EjerciciosPublicosAux[] = [];
  rutinaActual?: Rutina | any ;
  datosCargados = false;
  esAutomatizado = false;
  constructor(private _route:ActivatedRoute, private ejerciciosPriv:EjercicioPrivadoService, private router:Router, private estado:ServicioLoginService) {
  }

  ngOnInit(): void {
    this.estado.loggedIn();
    if(!this.estado.isLoggedIn){
      this.router.navigate(['']);
      Swal.fire({
        title: 'No estas logeado',
        text: 'Porfavor inicia sesion para entrar a tus rutinas.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
    }
    forkJoin(
      [this.ejerciciosPriv.devolverRutinasEspecifica(this._route.snapshot.paramMap.get('id')),
      this.ejerciciosPriv.obtenerEjerciciosTotales(),this.ejerciciosPriv.obtenerEjerciciosPrivadoUsuario(this._route.snapshot.paramMap.get('id'))]
    ).subscribe(([valor1,valor2,valor3]) => {
      this.rutinaActual = valor1[0];
      this.ejerciciosTotales = valor2;
      this.idEjerciciosUsuario = valor3;
      for(let aux in this.idEjerciciosUsuario){
        let auxA = Object.values(this.idEjerciciosUsuario[aux]);
        this.ejerciciosUsuario.push(this.ejerciciosTotales.find(ejercicio => String(ejercicio.idejercicio) === String(auxA[0]))!);
      }
      for (let i = 0; i < this.ejerciciosUsuario.length; i++) {
        this.ejerciciosUsuario[i].series = this.idEjerciciosUsuario[i].series;
        this.ejerciciosUsuario[i].repeticiones = this.idEjerciciosUsuario[i].repeticiones;
        this.ejerciciosUsuario[i].tiempo = this.idEjerciciosUsuario[i].tiempo;
      }
      if(this.rutinaActual.automatizado == '1'){
        this.esAutomatizado = true;
      }
      this.datosCargados = true;
    })
  }
  eliminarEjercicio(idEjericio:string , idRutina:string){
    Swal.fire({
      title: '¿Deseas eliminar el ejercicio de tu rutina?',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm:() => {
        let dataRutinaEjercicios:RutinaEjericio = {
          idrutinas: idRutina,
          idejericio:idEjericio
        }
        this.ejerciciosPriv.eliminarEjercicioDeRutina(dataRutinaEjercicios);
        location.reload();
      }
    })
  }

  editarInformacion(){
    Swal.fire({
      title: "Informacion de rutina",
      text: "Ingresa la informacion para editar.",
      html: `
      <form>
      <input type="text" class="swal2-input" placeholder="Titulo rutina" id = "titulorutina">
      <input type="text" class="swal2-input" placeholder="Descripcion rutina" id = "descripcion">
      </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const titulorutina = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#titulorutina'))?.value;
        const descripcion =(<HTMLInputElement | null> Swal.getPopup()?.querySelector('#descripcion'))?.value;
        if(titulorutina == ''){
          Swal.showValidationMessage(`El titulo no puede estar vacio`);
        }else{
          this.ejerciciosPriv.editarInfoRutinaPriv({idrutinas: this._route.snapshot.paramMap.get('id'),titulorutina : titulorutina, descripcion : descripcion}).subscribe((valor) => {
            if(valor.success == true){
              Swal.fire({
                title: 'Rutina modificada exitosamente!',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'green',
                allowOutsideClick: false,
                preConfirm: ()=>{
                  location.reload();
                }
              })

            }
          })
        }
      }
    })
  }

  modificarCarga(idEjercicio:string , idRutina:string){
    this.ejerciciosPriv.esCardio(idEjercicio).subscribe((valor: Array<any>) =>{
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
              this.ejerciciosPriv.modificarTiempo({ idrutinas: idRutina, idejercicios: String(idEjercicio), tiempo: tiempoEjer}).subscribe((valor) => {
                if(valor){
                  Swal.fire({
                    title: 'Se modifico correctamente!',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: 'green',
                    preConfirm: () => {
                      location.reload();
                    }
                  })
                }
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
                  this.ejerciciosPriv.modificarCarga({ idrutinas: idRutina, idejercicios: String(idEjercicio), series: series , repeticiones: repes}).subscribe((valor) => {
                    if(valor){
                      Swal.fire({
                        title: 'Se modifico correctamente!',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: 'green',
                        preConfirm: () => {
                          location.reload();
                        }
                      })
                    }
                  }) 
                }
              }   
            })
        }
    })
  }

  rateWithStars(idrutinas:any) {
    let rating = 0;
  
    Swal.fire({
      title: 'Califica esta Rutina',
      html: '<div style="display: flex; align-items: center; justify-content: center;">' +
            '<span class="star" data-value="1" style="margin-right: 10px; font-size: 18px; cursor: pointer;">1</span>' + 
            '<div class="rating">' +
            '  <span class="star" data-value="1">&#9733;</span>' +
            '  <span class="star" data-value="2">&#9733;</span>' +
            '  <span class="star" data-value="3">&#9733;</span>' +
            '  <span class="star" data-value="4">&#9733;</span>' +
            '  <span class="star" data-value="5">&#9733;</span>' +
            '</div>' +
            '<span class="star" data-value="5" style="margin-left: 10px; font-size: 18px; cursor: pointer;">5</span>' +
            '</div>',
      cancelButtonColor: "grey",
      confirmButtonColor: "green",
      showCancelButton: true,
      preConfirm: () => {
        return rating;
      },
      didRender: () => {
        const ratingElement = document.querySelector('.rating');
        ratingElement?.addEventListener('click', (event) => {
          const target = event.target as HTMLElement;
          if (target && target.classList.contains('star')) {
            const value = target.getAttribute('data-value');
            if (value) {
              rating = parseInt(value, 10);
              const stars = document.querySelectorAll('.star');
              stars.forEach((star: Element) => {
                const starElement = star as HTMLElement;
                const starValue = parseInt(starElement.getAttribute('data-value') || '0', 10);
                starElement.style.color = starValue <= rating ? 'gold' : 'grey';
              });
            }
          }
        });

          // Cambia el estilo del cursor para todos los elementos con clase 'star'
          const stars = document.querySelectorAll('.star');
          stars.forEach(star => {
            star.addEventListener('mouseover', () => {
              (star as HTMLElement).style.cursor = 'pointer';
            });
            star.addEventListener('mouseout', () => {
              (star as HTMLElement).style.cursor = '';
            });
          });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejerciciosPriv.guardarCalificacion({idrutinas : idrutinas, calificacion: rating}).subscribe((valor) =>{
          Swal.fire({
            title: valor.msg,
            icon: "success",
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'green',
          })
        }, (error) =>{
          Swal.fire({
            title: error.msg,
            icon: "error",
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'red',
          })
        })
      }
    });
  }


}
