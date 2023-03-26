import { Component, OnInit } from '@angular/core';
import { EjerciciosPublicosAux } from 'src/app/services/ejercicios-publicos.type';
import { ServicioEjerciciosRutService } from 'src/app/services/servicioEjerciciosRut/servicio-ejercicios-rut.service';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { Rutina } from 'src/app/services/vistaRutinas/rutinas-publicas.type';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ejercicios-rutinas-publicos',
  templateUrl: './ejercicios-rutinas-publicos.component.html',
  styleUrls: ['./ejercicios-rutinas-publicos.component.scss']
})
export class EjerciciosRutinasPublicosComponent implements OnInit {
  idEjerciciosUsuario: string[] = [];
  ejercicios:EjerciciosPublicosAux[] = [];
  ejerciciosTotales : EjerciciosPublicosAux[] = [];
  datosCargados: boolean = false;
  rutinaActual!:Rutina;
  constructor(private servicio:ServicioEjerciciosRutService,private router:Router,private _route:ActivatedRoute) { }

  ngOnInit(): void {
    forkJoin(
      [this.servicio.devolverRutinasEspecifica(this._route.snapshot.paramMap.get('id')),
      this.servicio.obtenerEjerciciosTotales(),this.servicio.obtenerEjerciciosPrivados(this._route.snapshot.paramMap.get('id'))]
    ).subscribe(([valor1,valor2,valor3]) => {
      this.rutinaActual = valor1[0];
      this.ejerciciosTotales = valor2;
      this.idEjerciciosUsuario = valor3;
      for(let aux in this.idEjerciciosUsuario){
        let auxA = Object.values(this.idEjerciciosUsuario[aux]);
        this.ejercicios.push(this.ejerciciosTotales.find(ejercicio => String(ejercicio.idejercicio) === String(auxA))!);
      }

      this.datosCargados = true;
    })

  }

}
