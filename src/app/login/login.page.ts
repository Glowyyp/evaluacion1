import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { registroService } from 'src/app/services/registro.service';

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
  isLoggingIn: boolean = false;
  isLoading: boolean = false;
  

  constructor(private router: Router, private storageService: registroService) {}

  async login() {
    if (this.email && this.contrasenia) {
        this.isLoading = true; 

        try {
            const usuarios = await this.storageService.obtenerUsuarios('personas');
            const usuario = usuarios.find(
                user => user.username === this.email && user.password === this.contrasenia
            );

            if (usuario) {
                await this.storageService.setUsuarioActual(usuario);
                setTimeout(() => {
                    if (usuario.rolusuario === 'conductor') {
                        alert('Login exitoso como conductor');
                        this.router.navigateByUrl('/tabs/home').then(() => {
                            window.location.reload(); 
                        });
                    } else if (usuario.rolusuario === 'pasajero') {
                        alert('Login exitoso como pasajero');
                        this.router.navigateByUrl('/tabs/home').then(() => {
                            window.location.reload(); 
                        });
                    } else {
                        alert('Rol de usuario no reconocido');
                    }
                    this.isLoading = false; 
                }, 1000); 
            } else {
                alert('Usuario o contraseña incorrectos');
                this.isLoading = false; 
            }
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error');
            this.isLoading = false;
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