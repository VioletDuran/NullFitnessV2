import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-registro',
  templateUrl: './login-registro.component.html',
  styleUrls: ['./login-registro.component.scss']
})
export class LoginRegistroComponent implements OnInit {
  formularioLogin!: FormGroup;
  siteKey : string = "6LfGOQgjAAAAAI-NKUAP9D9oRACLJ1RKj7cF5Cw2";
  buttonClicked: boolean = false;
  captchaResolved: boolean = false;
  correoLlenado: boolean = true;
  passw: boolean = true;
  constructor(private formBuilder: FormBuilder, private router: Router, private login: ServicioLoginService) {
  }

  ngOnInit(): void {
    if(this.login.isLoggedIn == true){
      Swal.fire({
        title: 'Ya estas logeado',
        text: 'Tu sesion esta activa.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
      this.router.navigate(['']);
    }
    let formulario = {
      correo: ['', Validators.compose([
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        Validators.required
      ])],
      contraseña: ['', Validators.compose([
        Validators.pattern(/^.+$/),
        Validators.required
      ])],
      recaptcha: ['',Validators.required]
    }
    this.formularioLogin = this.formBuilder.group(formulario);

  }
  checkCaptcha() {
    this.captchaResolved = true;
  }
  async iniciarSesion() {
    let datos = this.formularioLogin.value;
    this.buttonClicked = true;
    if(datos.correo == ''){
      this.correoLlenado = false;
    }
    if(datos.contraseña == ''){
      this.passw = false;
    }

    if (this.formularioLogin.status === 'VALID') {
     this.login.logearUsuario(datos.correo,datos.contraseña).subscribe((res) =>{
      Swal.fire({
        title: 'Inicio de sesion exitoso!',
        text: 'Iniciaste de forma correcta.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00a000'
      })
      this.router.navigate(['']);
     },(error)=> {
      Swal.fire({
        title: 'Error!',
        text: error.error.error,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: "#6D0101"
      })
    });}
    }

    correoLlenadoT(){
      this.correoLlenado = true;
    }

    pass(){
      this.passw = true;
    }
  }
