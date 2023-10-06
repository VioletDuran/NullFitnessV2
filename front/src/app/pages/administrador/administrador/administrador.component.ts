import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import Swal from 'sweetalert2';
import { usuarioFinal } from 'src/app/services/VistaPerfil/vista-perfil.type';
import { AdministradorService } from 'src/app/services/servicioAdmin/administrador.service';
import { EjerciciosPublicosAux } from 'src/app/services/ejercicios-publicos.type';
import { NgForm } from '@angular/forms';
import { Rutina } from 'src/app/services/vistaRutinas/rutinas-publicas.type';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.scss']
})
export class AdministradorComponent implements OnInit {
  Usuario: usuarioFinal | any = {
    idusuario : "", 
    nombreusuario : "",
    nombre: "", 
    edad : "", 
    peso : "", 
    nacionalidad : "", 
    contextura : "", 
    objetivo : "", 
    cantidad_ejercicio : "",
    foto: ""
  };
  fileTemp:any;
  @ViewChild('fotoEjer') formularioRut!:NgForm
  ejerciciosTotales : EjerciciosPublicosAux[] = [];
  datosCargados:Boolean = false;
  musculosTotales:any;
  rutinas: Rutina[] = [];

  constructor(private login:ServicioLoginService, private router:Router, private servicio:AdministradorService) { }

  ngOnInit(): void {
    this.login.loggedIn();
    if(!this.login.isLoggedIn){
      this.router.navigate(['']);
      Swal.fire({
        title: 'No estas logeado',
        text: 'Porfavor inicia sesion para entrar a tu administrador.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
    }
    if(this.login.tipoUsuario != "2"){
        this.router.navigate(['']);
        Swal.fire({
          title: 'Debes ser administrador para entrar aqui',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'green'
        })
    }

    this.servicio.cargarDatos(this.login.idUsuario).subscribe((valor) => {
      this.Usuario = valor;
    })

    this.servicio.devolverEjercicios().subscribe((valor)=>{
      this.ejerciciosTotales = valor;
    })
    this.servicio.obtenerMusculos().subscribe((valor)=>{
      this.musculosTotales = valor;
      
    })
    this.servicio.devolverRutinasPublicas().subscribe((valor)=>{
      this.rutinas = valor;
      this.datosCargados = true;
    })
  }

  cambiarFotoEjer($event: any,idejercicio:any){
    const [ file ] = $event.target.files; 
    let extension = 'jpg';
    let nombreFinal = idejercicio + '_ejercicioPublic' + '.' + extension;
    this.fileTemp = {
      fileRaw:file,
      fileName:nombreFinal,
    }
    Swal.fire({
      title: 'Deseas confirmar el archivo?',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm:() => {
        this.enviarFotoRutina()
      }
    }).then(()=>
     {
      this.formularioRut.resetForm();
     })
  }

  enviarFotoRutina() {
    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.servicio.guardarFotoEjercicio(body).subscribe((valor)=>{
      if(valor == true){
        Swal.fire({
          title: "Foto cambiada con exito!",
          icon: "success",
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'green',
          preConfirm:() => {
            location.reload();
          }
        })
      }
    })
  }

  eliminarEjercicio(id:string){
    Swal.fire({
      title: '¿Estas seguro de eliminar este ejercicio?',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      showCancelButton: true,
      preConfirm:() => {
        this.servicio.eliminarEjercicioPublico({idejercicio:id});
        location.reload();
      }
    })
  }

  modificarEjercicio(id:string){
    Swal.fire({
      title: 'Datos para editar el ejercicio',
      html: `<form class = "text-start mx-5">
              <input type="text" class="swal2-input" placeholder="titulo ejercicio" id="tituloejercicio">
              <hr>
              <textarea class="swal2-input" placeholder="descripcion ejercicio" id = "descripcionejercicio"></textarea>
              <hr>
              <input type="text" class="swal2-input" placeholder="Video de youtube" id="video">
              <hr>
              <input type="file" class="tamañoInput" id="foto">
              <hr>
                    ${this.musculosTotales.map((musclo:any)=> {
          return `
          <input type="checkbox" id="${musclo.idmusculo}" name="${musclo.idmusculo}" value="${musclo.idmusculo}">
          <label for="${musclo.idmusculo}">${musclo.musculo}</label><br>
          `
      }).flat().join('')}
                </form>`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      showCancelButton: true,
      preConfirm: () => {
        const tituloejercicio = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#tituloejercicio'))?.value;
        const descripcion = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#descripcionejercicio'))?.value;
        let video = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#video'))?.value;
        let foto = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#foto'))?.files;
        let musculosSeleccionados: String[] = [];
        for (let i = 0; i < this.musculosTotales.length; i++) {
          if ((<HTMLInputElement | null>document.getElementById(this.musculosTotales[i].idmusculo))?.checked) {
            musculosSeleccionados.push(this.musculosTotales[i].idmusculo);
          }
        }
        if (tituloejercicio == "") {
          Swal.showValidationMessage(`Debe ingresar un titulo`);
        }
        else if (musculosSeleccionados.length == 0) {
          Swal.showValidationMessage(`Debe seleccionar por lo menos un musculo`);
        } else {
          this.servicio.modificarEjerciciosPublicos({ idejercicio: id, tituloejercicio: tituloejercicio, descripcion: descripcion, video: video, musculos: musculosSeleccionados }).subscribe((valor) => {
            if (valor == true) {
              if(foto?.length != 0){
                this.anadirFotoEjer(foto,id);
              }
              location.reload();
            }
          })
        }
      }
    })
  }

  anadirNuevoEjercicio(){
    Swal.fire({
      title: 'Datos para nuevo ejercicio',
      html: `<form class = "text-start mx-5">
              <input type="text" class="swal2-input" placeholder="titulo ejercicio" id="tituloejercicio">
              <hr>
              <textarea class="swal2-input" placeholder="descripcion ejercicio" id = "descripcionejercicio"></textarea>
              <hr>
              <input type="text" class="swal2-input" placeholder="Video de youtube" id="video">
              <hr>
              <input type="file" class="tamañoInput" id="foto">
              <hr>
                    ${this.musculosTotales.map((musclo:any)=> {
          return `
          <input type="checkbox" id="${musclo.idmusculo}" name="${musclo.idmusculo}" value="${musclo.idmusculo}">
          <label for="${musclo.idmusculo}">${musclo.musculo}</label><br>
          `
      }).flat().join('')}
                </form>`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      showCancelButton: true,
      preConfirm: () => {
        const tituloejercicio = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#tituloejercicio'))?.value;
        const descripcion = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#descripcionejercicio'))?.value;
        let video = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#video'))?.value;
        let foto = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#foto'))?.files;
        let musculosSeleccionados: String[] = [];
        for (let i = 0; i < this.musculosTotales.length; i++) {
          if ((<HTMLInputElement | null>document.getElementById(this.musculosTotales[i].idmusculo))?.checked) {
            musculosSeleccionados.push(this.musculosTotales[i].idmusculo);
          }
        }
        if (tituloejercicio == "") {
          Swal.showValidationMessage(`Debe ingresar un titulo`);
        }
        else if (descripcion == "") {
          Swal.showValidationMessage(`Debe ingresar una descripcion`);
        }
        else if (musculosSeleccionados.length == 0) {
          Swal.showValidationMessage(`Debe seleccionar por lo menos un musculo`);
        }else if(foto!.length == 0){
          Swal.showValidationMessage(`Debe subir una fotografia`);
        }else{
          this.servicio.guardarNuevoEjercicio({tituloejercicio: tituloejercicio, descripcion: descripcion, video: video, musculos: musculosSeleccionados }).subscribe((valor) =>{
            this.anadirFotoEjer(foto,valor);
          })
        }
      }
    })
  }

  anadirFotoEjer(foto: any,idejercicio:any){
    const [ file ] = foto;
    let extension = 'jpg';
    let nombreFinal = idejercicio + '_ejercicioPublic' + '.' + extension;
    this.fileTemp = {
      fileRaw:file,
      fileName:nombreFinal,
    }
    this.enviarFotoRutinaEjer();
  }

  enviarFotoRutinaEjer() {
    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.servicio.guardarFotoEjercicio(body).subscribe((valor)=>{
      if(valor == true){
        Swal.fire({
          title: "Ejercicio añadido con exito!",
          icon: "success",
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'green',
          preConfirm:() => {
            location.reload();
          }
        })
      }
    })
  }



  modificarRutina(id:string){
    Swal.fire({
      title: 'Datos para editar la rutina',
      html: `<form class = "text-start mx-5">
              <input type="text" class="swal2-input" placeholder="titulo rutina" id="titulorutina">
              <hr>
              <textarea class="swal2-input" placeholder="descripcion rutina" id = "descripcionrutina"></textarea>
              <hr>
              <input type="file" class="tamañoInput" id="foto">
              <hr>
                    ${this.ejerciciosTotales.map((ejercicio:any)=> {
          return `
          <input type="checkbox" id="${ejercicio.idejercicio}" name="${ejercicio.idejercicio}" value="${ejercicio.idejercicio}">
          <label for="${ejercicio.idejercicio}">${ejercicio.tituloejercicio}</label><br>
          `
      }).flat().join('')}
                </form>`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      showCancelButton: true,
      preConfirm: () => {
        const titulorutina = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#titulorutina'))?.value;
        const descripcion = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#descripcionrutina'))?.value;
        let foto = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#foto'))?.files;
        let ejerciciosSeleccionados: String[] = [];
        for (let i = 0; i < this.ejerciciosTotales.length; i++) {

          if ((<HTMLInputElement | null>document.getElementById(String(this.ejerciciosTotales[i].idejercicio)))?.checked){
            ejerciciosSeleccionados.push(this.ejerciciosTotales[i].idejercicio);
          }
        }
        if (titulorutina == "") {
          Swal.showValidationMessage(`Debe ingresar un titulo`);
        }
        else if (ejerciciosSeleccionados.length == 0) {
          Swal.showValidationMessage(`Debe seleccionar por lo menos un ejercicio`);
        } else {
          this.servicio.modificarRutinas({ idrutinas: id, titulorutina: titulorutina, descripcion: descripcion,ejercicios: ejerciciosSeleccionados }).subscribe((valor) => {
            if (valor == true) {
              if(foto?.length != 0){
                this.anadirFotoRutPub(foto,id);
              }
              location.reload();
            }
          })
        }
      }
    })
  }

  anadirFotoRutPub(foto: any,idrutina:any){
    const [ file ] = foto;
    let extension = 'jpg';
    let nombreFinal = idrutina + '_rutinaPub' + '.' + extension;
    this.fileTemp = {
      fileRaw:file,
      fileName:nombreFinal,
    }
    this.enviarFotoRutinaPub();
  }

  enviarFotoRutinaPub() {
    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.servicio.guardarFotoRutina(body).subscribe((valor)=>{
    })
  }

  eliminarRutina(id:string){
    Swal.fire({
      title: '¿Estas seguro de eliminar esta rutina?',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      showCancelButton: true,
      preConfirm:() => {
        this.servicio.eliminarRutinaPub({idrutinas:id});
        location.reload();
      }
    })
  }

  anadirNuevaRut(){
    Swal.fire({
      title: 'Datos para nueva rutina',
      html: `<form class = "text-start mx-5">
              <input type="text" class="swal2-input" placeholder="titulo rutina" id="titulorutina">
              <hr>
              <textarea class="swal2-input" placeholder="descripcion rutina" id = "descripcionrutina"></textarea>
              <hr>
              <input type="file" class="tamañoInput" id="foto">
              <hr>
              ${this.ejerciciosTotales.map((ejercicio:any)=> {
                return `
                <input type="checkbox" id="${ejercicio.idejercicio}" name="${ejercicio.idejercicio}" value="${ejercicio.idejercicio}">
                <label for="${ejercicio.idejercicio}">${ejercicio.tituloejercicio}</label><br>
                `
            }).flat().join('')}
                </form>`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      showCancelButton: true,
      preConfirm: () => {
        const titulorutina = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#titulorutina'))?.value;
        const descripcion = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#descripcionrutina'))?.value;
        let foto = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#foto'))?.files;
        let ejerciciosSeleccionados: String[] = [];
        for (let i = 0; i < this.ejerciciosTotales.length; i++) {

          if ((<HTMLInputElement | null>document.getElementById(String(this.ejerciciosTotales[i].idejercicio)))?.checked){
            ejerciciosSeleccionados.push(this.ejerciciosTotales[i].idejercicio);
          }
        }
        if (titulorutina == "") {
          Swal.showValidationMessage(`Debe ingresar un titulo`);
        }
        else if (descripcion == "") {
          Swal.showValidationMessage(`Debe ingresar una descripcion`);
        }
        else if (ejerciciosSeleccionados.length == 0) {
          Swal.showValidationMessage(`Debe seleccionar por lo menos un musculo`);
        }else if(foto!.length == 0){
          Swal.showValidationMessage(`Debe subir una fotografia`);
        }else{
          this.servicio.guardarNuevaRutinaPub({titulorutina: titulorutina, descripcion: descripcion,ejercicios: ejerciciosSeleccionados}).subscribe((valor) =>{
            this.anadirFotoRutPub(foto,valor);
            location.reload();
          })
        }
      }
    })
  }

}
