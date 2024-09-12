import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular/standalone';

@Component({
  selector: 'app-detallesviaje',
  templateUrl: './detallesviaje.page.html',
  styleUrls: ['./detallesviaje.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class DetallesviajePage implements OnInit {

  viaje:any;
  constructor(
      private modalCtrl: ModalController, 
      private navParams: NavParams,
      private router: Router) {}





  

  ngOnInit() { this.viaje = this.navParams.get('viaje');
  }

  cerrar() {
  this.modalCtrl.dismiss();
  } 

  confirmar(){
      this.modalCtrl.dismiss();
      alert('viaje solicitado');
  }

} 
