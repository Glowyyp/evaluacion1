import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

import { StorageService } from 'src/app/storage.service';

interface Persona{
  username: string;
  password: string;
  userRole: string;
  identificador: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule]
})
export class RegistroPage {
  
  
  username:string='';
  password:string=''; 
  userRole:any='';

  // Variables para leer parametros

  par_username: string='';  
  par_password: string='';  
  
  // Variables para el crud
  personas:Persona[]=[];
  currentId:string=""; 

  constructor(private router: Router,
              private storageservice: StorageService,
              private navCtrl: NavController
  ) {


    
  }

  

  async registro() {
    const nuevoRegistro={
      username:this.username,
      password:this.password,
      userRole:this.userRole,
      identificador:Date.now().toString() //Genera un id
    }
    // Agregar a la nueva persona al arreglo 
    this.personas.push(nuevoRegistro);

    let resp = this.storageservice.registro('personas', nuevoRegistro);

    // console.log('Usuario registrado:', { username: this.username, role: this.userRole });
    // alert('Usuario registrado exitosamente');
    // this.router.navigate(['/login']);
  
  
  } // Fin de registro


    volver() {
      this.navCtrl.navigateForward('/login'); 
    }
  

  

}
