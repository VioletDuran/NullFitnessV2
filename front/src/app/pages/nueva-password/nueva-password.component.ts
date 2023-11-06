import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroServiceService } from 'src/app/services/servicioRegistro/registro-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nueva-password',
  templateUrl: './nueva-password.component.html',
  styleUrls: ['./nueva-password.component.scss']
})
export class NuevaPasswordComponent implements OnInit {
  
  formularioRegistro!: FormGroup;
  passw:boolean = true;
  buttonClicked: boolean = false;

  constructor(private formBuilder: FormBuilder,private servicio:RegistroServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let formulario = {
      contraseña: ['', Validators.compose([
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,*]).{8,}$/),
        Validators.required
      ])]
    }
    this.formularioRegistro = this.formBuilder.group(formulario);
  }

  pass(){
    this.passw = true;
  }

  solicitarPass(){
    let datos = this.formularioRegistro.value;
    this.buttonClicked = true;
    if(datos.contraseña == ''){
      this.passw = false;
    }
    if (this.formularioRegistro.status === 'VALID'){
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        this.servicio.guardarPass({token: token, nuevaContrasena:datos.contraseña}).subscribe((valor) =>{
          Swal.fire({
            title: 'Todo correcto!',
            text: valor.error,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: "green",
            allowOutsideClick: false,
            preConfirm:() =>{
              this.router.navigate(['/Login']);
            }
          })
        })
      }, (error) =>{
        Swal.fire({
          title: 'Error!',
          text: error.error,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: "red",
        })
      });
    }
  }
}
