import { Component, OnInit } from '@angular/core';
import { ServicioLoginService } from 'src/app/services/Login/servicio-login.service';
import { EjerciciosPublicosAux } from '../../services/ejercicios-publicos.type';
import { EjercicioPrivadoService } from 'src/app/services/ejerciciosPrivados/ejercicio-privado.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  ejerciciosTotales : EjerciciosPublicosAux[] | any = [];
  ejerciciopublico: EjerciciosPublicosAux[] = [];

  constructor(private usuarioLogin:ServicioLoginService, private probar:EjercicioPrivadoService) { }

  ngOnInit(): void {
   this.probar.obtenerEjerciciosTotales().subscribe((valor) => {
      this.ejerciciosTotales = valor;
      this.ejerciciopublico = this.randomNumber(this.ejerciciosTotales);
      this.usuarioLogin.loggedIn();
    })
  }

  randomNumber(arreglo:EjerciciosPublicosAux[]){
    let currentIndex = arreglo.length,  randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arreglo[currentIndex], arreglo[randomIndex]] = [
        arreglo[randomIndex], arreglo[currentIndex]];
    }
    return arreglo;
  }

}
