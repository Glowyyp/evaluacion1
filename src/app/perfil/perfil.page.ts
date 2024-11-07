import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { registroService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]  
})
export class PerfilPage implements OnInit {
  perfilForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private storageService: registroService
  ) { 
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      direccion: ['', Validators.required],
      rut: ['', Validators.pattern('^[a-zA-Z0-9]*$')],
      numero: ['', Validators.pattern('^[0-9]*$')],
      email: ['', Validators.email]
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
  }
  nombreUsuario: string = '';

  async loadUserProfile() {
    const perfilGuardado = await this.storageService.obtenerUsuarioActual();
    console.log('Perfil guardado (usuario actual):', perfilGuardado); 
  
    if (perfilGuardado) {
      this.nombreUsuario = perfilGuardado.username;
      console.log('Nombre de usuario cargado:', this.nombreUsuario);
      this.perfilForm.patchValue({
        email: perfilGuardado.email,
        numero: perfilGuardado.numero || '',
        direccion: perfilGuardado.direccion || '',
        edad: perfilGuardado.edad || '',
        rut: perfilGuardado.rut || ''
      });
    } else {
      console.warn('No se encontró el perfil del usuario actual.');  
    }
}

  async guardar() {
    if (this.perfilForm.valid) {
      const perfilGuardado = this.perfilForm.value;
      await this.storageService.actualizarUsuarioActual(perfilGuardado);
      alert('Datos guardados');
    } else {
      alert('Datos no válidos');
    }
  }

  volver() {
    this.navCtrl.navigateForward('tabs/home'); 
  }
}
