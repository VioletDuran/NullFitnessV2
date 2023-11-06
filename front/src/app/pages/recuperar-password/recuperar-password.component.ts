import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroServiceService } from 'src/app/services/servicioRegistro/registro-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss']
})
export class RecuperarPasswordComponent implements OnInit {
  formularioLogin!: FormGroup;
  correoLlenado: boolean = true;
  buttonClicked: boolean = false;
  constructor(private formBuilder: FormBuilder,private servicio:RegistroServiceService) { }

  ngOnInit(): void {
    let formulario = {
      correo: ['', Validators.compose([
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        Validators.required
      ])]
    }
    this.formularioLogin = this.formBuilder.group(formulario);
  }

  correoLlenadoT(){
    this.correoLlenado = true;
  }

  recuperarPass(){
    let datos = this.formularioLogin.value;
    this.buttonClicked = true;
    if(datos.correo == ''){
      this.correoLlenado = false;
    }
    if (this.formularioLogin.status === 'VALID'){
      this.servicio.recuperarPass(datos).subscribe((valor) =>{
        Swal.fire({
          title: 'Todo correcto!',
          text: valor.error,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: "green"
        })
      }, (error)=>{
        Swal.fire({
          title: 'Error!',
          text: error.error,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: "red"
        })
      } )
    }
  }

}
