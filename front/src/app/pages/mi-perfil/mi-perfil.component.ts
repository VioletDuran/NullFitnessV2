import { Component, OnInit, ViewChild } from '@angular/core';
import { VistaPerfilService } from 'src/app/services/VistaPerfil/vista-perfil.service';
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";
import { datosModificables, usuarioFinal } from 'src/app/services/VistaPerfil/vista-perfil.type';
import { Rutina } from 'src/app/services/ejerciciosPrivados/ejercicio-privado.type';
import { NgForm } from '@angular/forms';
import { AdministradorService } from 'src/app/services/servicioAdmin/administrador.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {
  arrayMostrar: Rutina[] = [];
  Usuario: usuarioFinal | any = {
    idusuario: "",
    nombreusuario: "",
    edad: "",
    nombre: "",
    foto: "",
    peso: "",
    experiencia: "",
    altura: "",
    genero: "",
    objetivo: ""
  };
  datosCargados: boolean = false;
  fileTemp: any;
  tipoUsuario: string = "";
  musculosTotales: any;
  @ViewChild('fotoRut') formularioRut!: NgForm
  @ViewChild('fotoUsu') formularioUsu!: NgForm

  constructor(private perfil: VistaPerfilService, private estado: ServicioLoginService, private router: Router, private servicio: AdministradorService) { }

  ngOnInit(): void {
    //Se cargan los datos en caso de que el usuario tenga el token activo
    this.estado.loggedIn();
    if (!this.estado.isLoggedIn) {
      this.router.navigate(['']);
      Swal.fire({
        title: 'No estas logeado',
        text: 'Porfavor inicia sesion para entrar a tu perfil.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
    }
    if (this.datosCargados == false) {
      this.servicio.obtenerMusculos().subscribe((valor) => {
        this.musculosTotales = valor;
      })
      this.perfil.cargarDatos(this.estado.idUsuario).subscribe((valor) => {
        this.Usuario = valor;
        if (this.Usuario.peso != null) {
          this.Usuario.peso = this.Usuario.peso + " Kg";
        }
        if (this.Usuario.edad != null) {
          this.Usuario.edad = this.Usuario.edad + " Años";
        }
        if (this.Usuario.altura != null) {
          this.Usuario.altura = this.Usuario.altura + " Cms";
        }
        this.tipoUsuario = this.estado.tipoUsuario;
        this.datosCargados = true;
      })
    }

    // Se obtienen las rutinas desde la promesa
    this.perfil.obtenerRutinas(this.estado.idUsuario).subscribe((valor) => {
      this.arrayMostrar = valor;
    })
  }

  //Metodo para cambiar la foto del usuario.
  cambiarFoto($event: any) {
    const [file] = $event.target.files;
    let extension = 'jpg';
    let nombreFinal = this.Usuario.idusuario + '.' + extension;

    this.fileTemp = {
      fileRaw: file,
      fileName: nombreFinal,
    }

    Swal.fire({
      title: 'Deseas confirmar el archivo?',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm: () => {
        this.enviarFoto();
      }
    }).then(() => this.formularioUsu.resetForm())
  }

  //Se envia la foto al back para proceder a guardarla.
  enviarFoto() {

    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.perfil.guardarFoto(body).subscribe((valor) => {
      if (valor == true) {
        Swal.fire({
          title: "Foto cambiada con exito!",
          icon: "success",
          confirmButtonText: 'Aceptar',
          confirmButtonColor: 'green',
          preConfirm: () => {
            location.reload();
          }
        })
      }

    })
  }


  //Se ciera la sesion del usuario
  cerrarSesion() {
    this.estado.logout();
    this.router.navigate(['']);
    Swal.fire({
      title: 'Cerraste sesion de forma correcta',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green'
    })
  }

  recomendacion(idRutina: any) {
    Swal.fire({
      title: "Datos para generar recomendación",
      html: `<hr>
            <b>Recuerda llenar tu información para hacer la rutina más exacta.</b>
            <hr>
            <form class = "text-start mx-5">
            <select class="swal2-input" id="intensidad" name="intensidad" style="width: 17rem"">
            <option value="preter" id ="preter">Seleccionar intensidad</option>
            <option value="Baja" id ="BajarPeso">Baja</option>
            <option value="Media" id ="MantenerPeso">Media</option>
            <option value="Alta" id ="GanarMasaMus">Alta</option>
            </select>
            <hr>
            <strong>Seleccionar musculos a entrenar</strong>
            <br>
            <hr>
            ${this.musculosTotales.map((musclo: any) => {
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
        const intensidad = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#intensidad'))?.value;
        let musculosSeleccionados: String[] = [];
        for (let i = 0; i < this.musculosTotales.length; i++) {
          if ((<HTMLInputElement | null>document.getElementById(this.musculosTotales[i].idmusculo))?.checked) {
            musculosSeleccionados.push(this.musculosTotales[i].musculo);
          }
        }
        if (intensidad == "preter") {
          Swal.showValidationMessage(`Porfavor elija una intensidad valida`);
        } else if (musculosSeleccionados.length == 0) {
          Swal.showValidationMessage(`Debe seleccionar por lo menos un musculo`);
        } else {
          Swal.fire({
            title: "Estamos generando tu rutina; esto puede tomar un tiempo. Te redirigiremos automáticamente a la rutina una vez creada.",
            html: '<img src="../../../assets/img/pesos-academia.gif" alt="Cargando..." style="width: 300px; height: 200px;"/>',
            showConfirmButton: false,
            allowOutsideClick: false
          })
          let infoGeneracion = {
            edad: this.Usuario.edad,
            peso: this.Usuario.peso,
            altura: this.Usuario.altura,
            genero: this.Usuario.genero,
            objetivo: this.Usuario.objetivo,
            experiencia: this.Usuario.experiencia,
            intensidad: intensidad,
            musculos: musculosSeleccionados,
          }
          this.perfil.revisarCantidad().subscribe((valor) => {
            this.perfil.generarRutinaUsuario(infoGeneracion).subscribe((valor) => {
              let info;
              console.log(valor);
              try {
                info = JSON.parse(valor.content).Rutina
              } catch (error) {
                Swal.fire({
                  title: 'Hubo un error, intente de nuevo!',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: "#6D0101"
                })
              }
              let datosRutina = {
                idRutina: idRutina,
                datos: info,
                musculos: musculosSeleccionados
              }
              this.perfil.guardarRutinaUsuario(datosRutina).subscribe((respuesta) => {
                this.router.navigate(['/MisEjercicios', idRutina]);
                Swal.close();
              }, (error) => {
                Swal.fire({
                  title: 'Hubo un error, intente de nuevo!',
                  text: error.error.msg,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: "#6D0101"
                })
              })
            }, (error) => {
              Swal.fire({
                title: 'Hubo un error, intente de nuevo!',
                text: error.error.msg,
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: "#6D0101"
              })
            })
          }, (error) => {
            Swal.fire({
              title: 'Error!',
              text: error.error.error,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: "#6D0101"
            })
          })
        }
      }
    })
  }

  //Pop up para obtener la informacion del usuario a editar.
  editarInformacion() {
    Swal.fire({
      title: "Informacion de usuario",
      text: "Ingresa la informacion para editar.",
      html: `<form>
             <input type="number" class="swal2-input" placeholder="Edad" id="edad">
             <hr>
             <input type="number" class="swal2-input" placeholder="Peso (Kg)" id = "peso">
             <hr>
             <select class="swal2-input" id="objetivo" name="objetivo" style="width: 17rem"">
             <option value="preter" id ="preter">Seleccionar objetivo</option>
             <option value="BajarPeso" id ="BajarPeso">Bajar peso</option>
             <option value="MantenerPeso" id ="MantenerPeso">Mantener peso</option>
             <option value="GanarMasaMus" id ="GanarMasaMus">Ganar masa muscular</option>
             <option value="MejorarResistencia" id ="MejorarResistencia">Mejorar resistencia física</option>
             </select>

             <hr>
             <select class="swal2-input" id="genero" name="genero" style="width: 17rem"">
             <option value="preter" id ="preter">Seleccionar genero</option>
             <option value="H" id ="H">Masculino</option>
             <option value="M" id ="M">Femenino</option>
             </select>
             <hr>

             <input type="number" class="swal2-input" placeholder="Altura (Cms)" id = "altura">
             <hr>

             <select class="swal2-input" id="experiencia" name="experiencia" style="width: 17rem"">
             <option value="preter" id ="preter">Seleccionar experiencia</option>
             <option value="prin" id ="prin">Principiante</option>
             <option value="inter" id ="inter">Intermedio</option>
             <option value="avan" id ="avan">Avanzado</option>
             </select>
             <hr>
      </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        let flag = true;

        let edad = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#edad'))?.value;
        let edadUsuario = Number(edad);

        let peso = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#peso'))?.value;
        let pesoUsuario = Number(peso);

        let objetivo = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#objetivo'))?.value;
        let objetivoUsuario: any = document.getElementById(objetivo!)!.textContent

        let genero = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#genero'))?.value;
        let generoUsuario: any = document.getElementById(genero!)!.textContent

        let altura = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#altura'))?.value;
        let alturaUsuario = Number(altura);

        let experiencia = (<HTMLInputElement | null>Swal.getPopup()?.querySelector('#experiencia'))?.value;
        let experienciaUsuario: any = document.getElementById(experiencia!)!.textContent


        if(edad == ''){
          edad = undefined;
        } else if (edadUsuario < 16 || edadUsuario > 99) {
          Swal.showValidationMessage('Porfavor ingresa una edad valida entre 16 y 99 años');
          flag = false;
        }

        if(peso == ''){
          peso = undefined;
        } else if (pesoUsuario < 40 || pesoUsuario > 300) {
          Swal.showValidationMessage('Porfavor ingresa un peso valido entre 40 y 300 kg');
          flag = false;
        }

        if (objetivo == "preter") {
          objetivoUsuario = undefined;
        }

        if (genero == "preter") {
          generoUsuario = undefined;
        }

        console.log(altura);

        if(altura == ''){
          altura = undefined;
        } else if (alturaUsuario < 120 || alturaUsuario > 300) {
          Swal.showValidationMessage('Porfavor elija una altura entre 120 a 300 cms');
          flag = false;
        }

        

        if (experiencia == "preter") {
          experienciaUsuario = undefined;
        }

        if(flag == true){
          let datosUsuario: datosModificables = {
            idusuario: this.estado.idUsuario,
            edad: edad!,
            peso: peso!,
            objetivo: objetivoUsuario!,
            genero: generoUsuario!,
            altura: altura!,
            experiencia: experienciaUsuario!
          }
          
        this.perfil.actualizarInformacionUsuario(datosUsuario).subscribe((valor) => {
          if (valor == true) {
            Swal.fire({
              title: 'Modificacion Correcta',
              text: 'Se modifico tu informacion correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'green',
              preConfirm: () => {
                location.reload();
              }
            })
          } else {
            Swal.fire({
              title: 'Hubo un error en la actualizacion',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: 'red',
              preConfirm: () => {
                location.reload();
              }
            })
          }
        },(error) =>{
          Swal.fire({
            title: error.error,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: 'red',
          })
        })
      }
        }
    })
  }
  cambiarFotoPriv($event: any, idrutinas: any) {
    const [file] = $event.target.files;
    let extension = 'jpg';
    let nombreFinal = idrutinas + '_rutinaPriv' + '.' + extension;
    this.fileTemp = {
      fileRaw: file,
      fileName: nombreFinal,
    }
    Swal.fire({
      title: 'Deseas confirmar el archivo?',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm: () => {
        this.enviarFotoRutina();
      }
    }).then(() => {
      this.formularioRut.resetForm();
    })
  }

  enviarFotoRutina() {
    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.perfil.guardarFotoRutina(body).subscribe((valor) => {
      if (valor == true) {
        Swal.fire({
          title: "Foto cambiada con exito!",
          icon: "success",
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