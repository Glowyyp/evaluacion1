import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { DetallesviajePage } from '../detallesviaje/detallesviaje.page';



@Component({
  selector: 'app-viajesdisp',
  templateUrl: './viajesdisp.page.html',
  styleUrls: ['./viajesdisp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})


export class ViajesDispPage {
  viajes = [
    { capacidad: 3, costo: 1000, imagen:'../../assets/icon/viaje1.jpeg', descripcion:"Suv crossover compacto",nombre: "Luis Lizana",placa:"KLM 9012" },
    { capacidad: 2, costo: 1200 , imagen:'../../assets/icon/viaje2.jpeg', descripcion:"Camioneta color azulado", nombre:"Benjamin Venegas",placa:"XYZ 5674"}, 
    { capacidad: 4, costo: 900 , imagen:'../../assets/icon/viaje3.jpeg', descripcion:"Auto color negro", nombre:"XD" ,placa:"ABC 1234" }
    
  ];

  constructor(
    private router: Router,
    private modalCtrl: ModalController) { }

    async solicitarviaje(viaje:any){
      const modal = await this.modalCtrl.create ({
          component: DetallesviajePage,
          componentProps: {viaje}
      });
      return await modal.present();
    }


  


  volver() {
    this.router.navigate(['/home']);
  }
}



  
