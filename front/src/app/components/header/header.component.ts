import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BusquedaServiceService } from 'src/app/services/servicioBusqueda/busqueda-service.service';
import { EjerciciosPublicosService } from 'src/app/services/ejercicios-publicos.service';
import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  ejercicios: any = [];
  control = new FormControl();
  keyword = 'tituloejercicio';
  clicked = true;
  clicked2 = true;
  @ViewChild ('inputS') search?:ElementRef;
  @ViewChild ('list') lista?:ElementRef;
  @ViewChild ('inputS2') search2?:ElementRef;
  @ViewChild ('list2') lista2?:ElementRef;
  constructor(private login:ServicioLoginService, private router:Router, private busqueda: BusquedaServiceService, private cargar:EjerciciosPublicosService,private eRef: ElementRef) { }
  
  ngOnInit(): void {
    this.observerChangeSearch();
  }

  revisarEstado(){
    this.login.loggedIn();
    if(this.login.isLoggedIn == false){
      Swal.fire({
        title: 'No estas logeado',
        text: 'Porfavor inicia sesion para entrar a tu perfil.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'green'
      })
    }else{
      this.router.navigate(['/MiPerfil']);

    }
  }

  observerChangeSearch(){
    this.control.valueChanges.pipe(debounceTime(500)).subscribe(query =>{
      this.busqueda.devolverCoincidencias(query).subscribe((valor) =>{
          this.ejercicios = valor;
          console.log(this.ejercicios);
      })
    })
  }
  routear(aux:any){
    this.router.navigate(['/Ejercicio/'+aux]);
  }

  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if(event.target == this.search?.nativeElement || event.target == this.lista?.nativeElement){
      this.clicked =  false;
    } else {
      this.clicked = true;
    }
    if(event.target == this.search2?.nativeElement || event.target == this.lista2?.nativeElement){
      this.clicked2 =  false;
    } else {
      this.clicked2 = true;
    }
  }

}
