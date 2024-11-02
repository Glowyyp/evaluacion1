import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/registro.service';

interface Persona {
  username: string;
  password: string;
  rolusuario: string;
  identificador: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegistroPage {
  username: string = '';
  password: string = ''; 
  rolusuario: any = '';
  personas: Persona[] = [];

  constructor(
    private router: Router,
    private storageService: StorageService,
    private navCtrl: NavController
  ) {}

  async registro() {
    const nuevoRegistro = {
      username: this.username,
      password: this.password,
      rolusuario: this.rolusuario,
      identificador: Date.now().toString()  
    };

    await this.storageService.registroUsuario(nuevoRegistro);
    alert('Usuario registrado exitosamente');
    this.router.navigate(['/login']);
  }

  volver() {
    this.navCtrl.navigateForward('/login'); 
  }
}
