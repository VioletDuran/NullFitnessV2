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

  idEjerciciosUsuario: string[] = [];
  ejerciciosUsuario : EjerciciosPublicosAux[] = [];
  ejerciciosTotales : EjerciciosPublicosAux[] = [];
  rutinaActual?: Rutina | any ;
  datosCargados = false;
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
      this.ejerciciosPriv.obtenerEjerciciosTotales(),this.ejerciciosPriv.obtenerEjerciciosPrivados(this._route.snapshot.paramMap.get('id'))]
    ).subscribe(([valor1,valor2,valor3]) => {
      this.rutinaActual = valor1[0];
      this.ejerciciosTotales = valor2;
      this.idEjerciciosUsuario = valor3;
      for(let aux in this.idEjerciciosUsuario){
        let auxA = Object.values(this.idEjerciciosUsuario[aux]);
        this.ejerciciosUsuario.push(this.ejerciciosTotales.find(ejercicio => String(ejercicio.idejercicio) === String(auxA))!);
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
        this.router.navigate(['/MiPerfil']);
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
            if(valor == true){
              Swal.fire({
                title: 'Rutina modificada exitosamente!',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: 'green'
              })
              this.router.navigate(['/MiPerfil']);
            }
          })
        }
      }
    })
  }

}
