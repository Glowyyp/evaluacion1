import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-resetcontrasenia',
  templateUrl: './resetcontrasenia.page.html',
  styleUrls: ['./resetcontrasenia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class ResetContraseniaPage {
  email: string = '';

  constructor(private router: Router) {}

  resetcontrasenia() {
    if (this.email) {
      alert('se ha enviado un correo para resetear su contrase;a a  ' + this.email);
      this.router.navigateByUrl('/login');
    } else {
      alert('porfavor ingrese un email.');
    }
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
