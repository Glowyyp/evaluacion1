import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';  
import { Router } from '@angular/router';

@Component({
  selector: 'app-programarviaje',
  templateUrl: './programarviaje.page.html',
  styleUrls: ['./programarviaje.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]  
})
export class ProgramarViajePage implements OnInit {

  costo: number = 0;
  capacidad: number = 0;
  nombreConductor: string = '';
  apellidoConductor: string = '';
  patente: string = '';
  info: string='';


  
  constructor(private router: Router) { 
    
  }
  
  volver() {
    this.router.navigate(['/home']);
  }


  agendar() {
    if (this.capacidad > 0 &&
        this.costo > 0 && 
        this.nombreConductor.length >= 3 &&
        this.apellidoConductor.length >= 3 && 
        this.patente.length > 0 && 
        this.patente.length === 7 &&
        this.info.length >= 1 
        ) {
       
        alert(`Su viaje ha sido programado con una capacidad de ${this.capacidad} pasajeros y un costo de $${this.costo} por pasajero`);
    } else {
      if(this.capacidad <= 0){
        alert('ingrese una capacidad valida');
      }else if(this.costo <= 0){
        alert('Ingrese un costo valido')
      }else if(this.nombreConductor.length <= 3 ){
        alert('Ingrese un Nombre valido')
      }else if(this.apellidoConductor.length <= 3){
        alert('Ingrese un apellido Valido')
      }else if(this.patente.length != 7){
        alert('Ingrese una patente valida de 7 caracteres')
      }else if(this.info.length <=1){
        alert('La informacion debe ser mayor a 1 caracteres')
      }
      
      
    }

    this.router.navigate(['/home'])
  }

  

  ngOnInit() {}
}



