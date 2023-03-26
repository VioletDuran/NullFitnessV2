import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { RegistroServiceService } from 'src/app/services/servicioRegistro/registro-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  formularioRegistro!: FormGroup;
  siteKey : string = "6LfGOQgjAAAAAI-NKUAP9D9oRACLJ1RKj7cF5Cw2";
  buttonClicked: boolean = false;
  captchaResolved: boolean = false;
  nombreR:boolean = true;
  nombreU:boolean = true;
  edadU:boolean = true;
  correoU:boolean = true;
  passw:boolean = true;
  constructor(private formBuilder: FormBuilder, private router: Router, private servicio:RegistroServiceService) {
  }

  ngOnInit(): void {
    let formulario = {
      nombre: ['', Validators.compose([
          Validators.required
      ])],
      nombreUsuario: ['', Validators.compose([
          Validators.required
      ])],
      edad: ['', Validators.compose([
          Validators.pattern(/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/),
          Validators.required
      ])],
      correo: ['', Validators.compose([
          Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
          Validators.required
      ])],
      contraseña: ['', Validators.compose([
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,*]).{8,}$/),
          Validators.required
      ])],

      recaptcha: ['',Validators.required]
    }
    this.formularioRegistro = this.formBuilder.group(formulario);
  }
  checkCaptcha() {
      this.captchaResolved = true;
  }
  registrarse(){
      let validacion = this.formularioRegistro.value;
      this.buttonClicked = true;
      if(validacion.nombre == ''){
          this.nombreR = false;
      }
      if(validacion.nombreUsuario == ''){
          this.nombreU = false;
      }
      if(validacion.edad == ''){
          this.edadU = false;
      }
      if(validacion.correo == ''){
          this.correoU = false;
      }
      if(validacion.contraseña == ''){
          this.passw = false;
      }
      if (this.formularioRegistro.status === 'VALID') {
      let datos = this.formularioRegistro.value;
      this.servicio.revisarCorreo(datos.correo).subscribe((value) =>{
        if(value == true){
          Swal.fire({
            title: 'Error!',
            text: 'El correo ya se encuentra registrado.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: "#6D0101"
          })
        }else{
          this.servicio.completarRegistro(datos);
          Swal.fire({
            title: 'Registro exitoso!',
            text: 'La cuenta se creo de manera correcta',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#00a000'
          })
          this.router.navigate(['']);
        }
      })
    }
  }
}
