import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class HomePage {

  constructor(private router: Router) {}

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'aceptar',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  perfil() {
    this.router.navigateByUrl('/tabs/perfil');
  }

  viajesdisp() {
    this.router.navigateByUrl('/tabs/viajesdisp');
  }

  programar() {
    this.router.navigateByUrl('/tabs/programarviaje');
  }

  cerrar() {
    this.router.navigateByUrl('/login');
  }

  sobre() {
    this.router.navigateByUrl('/tabs/sobre');
  }
}
