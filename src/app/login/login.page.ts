import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage {
  email: string = '';
  contrasenia: string = '';

  constructor(private router: Router, private storageService: StorageService) {}

  async login() {
    if (this.email && this.contrasenia) {
     
      const usuarios = await this.storageService.obtenerUsuarios('personas');

     
      const usuario = usuarios.find(
        user => user.username === this.email && user.password === this.contrasenia
      );

      if (usuario) {
        await this.storageService.setUsuarioActual(usuario);
        if (usuario.rolusuario === 'conductor') {
          alert('Login exitoso como conductor');
          this.router.navigateByUrl('/tabs/programarviaje');
        } else if (usuario.rolusuario === 'pasajero') {
          alert('Login exitoso como Pasajero');
          this.router.navigateByUrl('/tabs/viajesdisp');
        } else {
          alert('Rol de usuario no reconocido');
        }
      } else {
        alert('usuario o contraseña incorrectos');
      }
    } else {
      alert('Por favor ingrese un usuario y contraseña');
    }
  }

  goreset() {
    this.router.navigateByUrl('/resetcontrasenia');
  }

  goregistro() {
    this.router.navigateByUrl('/registro');
  }
}
