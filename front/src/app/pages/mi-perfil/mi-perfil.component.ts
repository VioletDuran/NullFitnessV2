import { Component, OnInit, ViewChild } from '@angular/core';
import { VistaPerfilService } from 'src/app/services/VistaPerfil/vista-perfil.service';
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import Swal from 'sweetalert2';
import {Router} from "@angular/router";
import { datosModificables,usuarioFinal } from 'src/app/services/VistaPerfil/vista-perfil.type';
import { Rutina } from 'src/app/services/ejerciciosPrivados/ejercicio-privado.type';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {
  arrayMostrar:Rutina[] = [];
  Usuario: usuarioFinal | any = {
    idusuario : "", 
    nombreusuario : "", 
    edad : "", 
    nombre : "", 
    foto : "", 
    peso : "", 
    experiencia : "", 
    altura : "",
    genero: "",
    objetivo: ""
  };
  datosCargados: boolean = false;
  fileTemp:any;
  tipoUsuario: string = "";
  @ViewChild('fotoRut') formularioRut!:NgForm
  @ViewChild('fotoUsu') formularioUsu!:NgForm

  constructor(private perfil:VistaPerfilService, private estado:ServicioLoginService, private router:Router) { }

  ngOnInit(): void {
    //Se cargan los datos en caso de que el usuario tenga el token activo
    this.estado.loggedIn();
    if(!this.estado.isLoggedIn){
      this.router.navigate(['']);
      Swal.fire({
        title: 'No estas logeado',
        text: 'Porfavor inicia sesion para entrar a tu perfil.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
    }
    if(this.datosCargados == false){
      this.perfil.cargarDatos(this.estado.idUsuario).subscribe((valor) =>{
        this.Usuario = valor;
        if(this.Usuario.peso != null){
          this.Usuario.peso = this.Usuario.peso + " Kg";
        }
        if(this.Usuario.edad != null){
          this.Usuario.edad = this.Usuario.edad + " Años";
        }
        if(this.Usuario.altura != null){
          this.Usuario.altura = this.Usuario.altura + " Cms";
        }
        this.tipoUsuario = this.estado.tipoUsuario;
        this.datosCargados = true;
      })
    }

    // Se obtienen las rutinas desde la promesa
    this.perfil.obtenerRutinas(this.estado.idUsuario).subscribe((valor) =>{
      this.arrayMostrar = valor;
    })
  }

  //Metodo para cambiar la foto del usuario.
  cambiarFoto($event:any) {
    const [ file ] = $event.target.files;
    let extension = 'jpg';
    let nombreFinal = this.Usuario.idusuario + '.' + extension;

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
        this.enviarFoto();
      }
    }).then(() => this.formularioUsu.resetForm())
  }

  //Se envia la foto al back para proceder a guardarla.
  enviarFoto(){

    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.perfil.guardarFoto(body).subscribe((valor)=>{
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
  

  //Se ciera la sesion del usuario
  cerrarSesion(){
    this.estado.logout();
    this.router.navigate(['']);
    Swal.fire({
      title: 'Cerraste sesion de forma correcta',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'green'
    })
  }

  //Pop up para obtener la informacion del usuario a editar.
  editarInformacion(){
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
      preConfirm: () =>{

        const edad = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#edad'))?.value;
        let edadUsuario = Number(edad);

        const peso = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#peso'))?.value;
        let pesoUsuario = Number(peso);

        const objetivo = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#objetivo'))?.value;
        let objetivoUsuario = document.getElementById(objetivo!)!.textContent

        const genero = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#genero'))?.value;
        let generoUsuario = document.getElementById(genero!)!.textContent

        const altura = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#altura'))?.value;
        let alturaUsuario = Number(altura);

        const experiencia = (<HTMLInputElement | null> Swal.getPopup()?.querySelector('#experiencia'))?.value;
        let experienciaUsuario = document.getElementById(experiencia!)!.textContent


        if(edadUsuario < 16 || edadUsuario > 99){
          Swal.showValidationMessage(`Porfavor ingresa una edad valida entre 16 y 99 años`);
        }
        else if(pesoUsuario < 40 || pesoUsuario > 300 )
        {
          Swal.showValidationMessage(`Porfavor ingresa un peso valido entre 40 y 300 kg`);
        }
        else if(objetivo == "preter"){
          Swal.showValidationMessage(`Porfavor elija un objetivo valido`);
        }
        else if(genero == "preter"){
          Swal.showValidationMessage(`Porfavor elija un genero valido`);
        }else if(alturaUsuario < 120 || alturaUsuario > 300){
          Swal.showValidationMessage(`Porfavor elija una altura entre 120 a 300 cms`);
        }else if(experiencia == "preter"){
          Swal.showValidationMessage(`Porfavor elija una experiencia valida`);
        }else{
          let datosUsuario: datosModificables  = {
            idusuario: this.estado.idUsuario,
            edad: edad!,
            peso: peso!,
            objetivo: objetivoUsuario!,
            genero: generoUsuario!,
            altura: altura!,
            experiencia:experienciaUsuario!
          }

          console.log(datosUsuario);

          this.perfil.actualizarInformacionUsuario(datosUsuario).subscribe((valor) =>
            {
              if(valor == true){
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
            }else{
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
          })
        }
      }
    })
  }
  cambiarFotoPriv($event: any,idrutinas:any) {
    const [ file ] = $event.target.files; 
    let extension = 'jpg';
    let nombreFinal = idrutinas + '_rutinaPriv' + '.' + extension;
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
        this.enviarFotoRutina();
      }
    }).then(()=>
     {
      this.formularioRut.resetForm();
     })
  }

  enviarFotoRutina() {
    const body = new FormData();
    body.append('myFile', this.fileTemp.fileRaw, this.fileTemp.fileName);
    this.perfil.guardarFotoRutina(body).subscribe((valor)=>{
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

}
