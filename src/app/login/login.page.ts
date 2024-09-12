
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class LoginPage {
  email: string = '';
  contrasenia: string = '';


  par_email: string="";
  par_constrasenia:string="";

  constructor(private router: Router) {}

  login() {
    if (this.email && this.contrasenia) {
      this.router.navigateByUrl('/home');
    } else {
      alert('porfavor ingrese un correo y contrasña');
    }
  }

  goreset() {
    this.router.navigateByUrl('/resetcontrasenia');
  }
}
