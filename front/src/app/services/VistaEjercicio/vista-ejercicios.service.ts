import { Injectable } from '@angular/core';
import {EjerciciosPublicosAux} from "../ejercicios-publicos.type";

@Injectable({
  providedIn: 'root'
})
export class VistaEjerciciosService {
  arregloVistaEjercicio:EjerciciosPublicosAux[] = [];
  constructor() {

  }

}
