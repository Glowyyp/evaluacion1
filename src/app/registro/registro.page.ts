import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistroPage {
  
  nombreUsuario!: string;
  contrasenia!: string; 
  rolUsuario!: string;

  constructor(private router: Router,
              private navCtrl: NavController
  ) {}

  registro() {
    console.log('Usuario registrado:', { nombreUsuario: this.nombreUsuario, rol: this.rolUsuario });
    alert('Usuario registrado exitosamente');
    this.router.navigate(['/login']);
  }

  volver() {
    this.navCtrl.navigateForward('/login'); 
  }
}
