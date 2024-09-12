import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonicModule, NavController } from '@ionic/angular';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})


export class PerfilPage implements OnInit{
    
  perfilForm: FormGroup;

  ngOnInit() {
  
  }

  

  constructor(
    private navCtrl: NavController,
    private fb:FormBuilder) { 

      this.perfilForm=this.fb.group({
        nombre: ['', Validators.required],
        edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
        direccion: ['', Validators.required],
        rut: ['', Validators.pattern('^[a-zA-Z0-9]*$')],
        numero: ['', Validators.pattern('^[0-9]*$')],
        email: ['', Validators.email]
      })
    }

    guardar(){
      if(this.perfilForm.valid){
        const perfilGuardado = this.perfilForm.value;
        alert('datos guardados');
      } else{
        alert('datos no validos ')
      }

    }


    

  volver() {
    this.navCtrl.navigateForward('/home'); 
  }

}