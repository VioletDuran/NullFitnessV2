import { Component, OnInit } from '@angular/core';
import {EjerciciosPublicosAux} from "../../services/ejercicios-publicos.type";
import {EjerciciosPublicosService} from "../../services/ejercicios-publicos.service";
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.component.html',
  styleUrls: ['./ejercicio.component.scss']
})


export class EjercicioComponent implements OnInit {
  
  ejerciciopublicoUnico: EjerciciosPublicosAux[] = [];
  ejercicioEspecifico! : EjerciciosPublicosAux | any;

  url: string = "";
  urlSafe: SafeResourceUrl = "";
  datosCargados : boolean = false;
  constructor(private ejerciciospublicos:EjerciciosPublicosService, private _route:ActivatedRoute, public sanitizer: DomSanitizer, private login:ServicioLoginService, private router:Router) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    this.ejerciciospublicos.devolverEjercicios().subscribe((valor) => {
      this.ejerciciopublicoUnico = valor;
      console.log(this.ejerciciopublicoUnico);
      this.ejercicioEspecifico = this.obtenerObjeto(this.ejerciciopublicoUnico);
      this.url = this.ejercicioEspecifico.video;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.datosCargados = true;
    })
  }
  
  obtenerObjeto(aux: EjerciciosPublicosAux[]){
    let auxObjeto;
    for(let i = 0; i < aux.length; i++){
      if(aux[i].idejercicio == this._route.snapshot.paramMap.get('id')){
        auxObjeto = aux[i];
      }
    }
    if(auxObjeto != undefined){
      return auxObjeto;
    }
    return {
      id:"",
      tituloEjercicio:"",
      tituloFoto:"",
      foto:"",
      descripcion:"",
      descripcionMusculos: [],
      video: ""
    };
  }
}
