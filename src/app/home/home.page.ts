import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { registroService } from '../services/registro.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class HomePage implements OnInit {
  rolusuario: string = '';  

  constructor(
    private router: Router,
    private registroService: registroService,  
    private storageService: StorageService     
  ) {}

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Aceptar',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
      },
    },
  ];

  ngOnInit() {
    this.getUserRole();  
  }


  async ionViewWillEnter() {
    await this.getUserRole(); 
}

async getUserRole() {
  try {
    const usuarioActual = await this.registroService.obtenerUsuarioActual();
    this.rolusuario = usuarioActual ? usuarioActual.rolusuario : '';
    console.log('Current user role:', this.rolusuario);  
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
}

  setResult(ev: any) {
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
  
  
  async cerrar() {
    try {
        console.log('Cerrando sesión...');
        await this.registroService.eliminarUsuarioActual();
        this.rolusuario = ''; 
        this.router.navigateByUrl('/login');
        console.log('Sesión cerrada correctamente y redirigido al login');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}


  sobre() {
    this.router.navigateByUrl('/tabs/sobre');
  }  
}
