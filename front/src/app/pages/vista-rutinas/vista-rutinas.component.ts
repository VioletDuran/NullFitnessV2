import { Component, OnInit } from '@angular/core';
import {Rutina} from '../../services/vistaRutinas/rutinas-publicas.type';
import {RutinasPublicasService} from '../../services/vistaRutinas/rutinas-publicas.service';

@Component({
  selector: 'app-vista-rutinas',
  templateUrl: './vista-rutinas.component.html',
  styleUrls: ['./vista-rutinas.component.scss']
})
export class VistaRutinasComponent implements OnInit {
  datosCargados: boolean = false;
  arrayRutinas:Rutina[] = []
  constructor(private arrayRutinasAux:RutinasPublicasService) { 
  }
  ngOnInit(): void {
    this.arrayRutinasAux.devolverRutinasPublicas().subscribe((valor) =>{
      this.arrayRutinas = valor;
      console.log(this.arrayRutinas);
      this.datosCargados = true;
    })
  }

}
