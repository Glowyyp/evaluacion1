import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService, Trip } from '../services/storage.service';
import { registroService } from '../services/registro.service';
import { ModalController } from '@ionic/angular';
import { DetallesviajePage } from '../detallesviaje/detallesviaje.page';

@Component({
  selector: 'app-viajesdisp',
  templateUrl: './viajesdisp.page.html',
  styleUrls: ['./viajesdisp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})
export class ViajesDispPage implements OnInit {
  viajes: Trip[] = [];
  rolusuario: string = ''; 
  username: string = '';
  isLoading: boolean = false; 

  constructor(
    private router: Router,
    private storageService: StorageService,  
    private registroService: registroService, 
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
   
    await this.getUserData();
    await this.cargarViajes();
  }

  async ionViewWillEnter() {
    await this.cargarViajes();
  }

  async getUserData() {
    const usuarioActual = await this.registroService.obtenerUsuarioActual();
    this.rolusuario = usuarioActual ? usuarioActual.rolusuario : '';
    this.username = usuarioActual ? usuarioActual.username : '';
  }

  async cargarViajes() {
    this.isLoading = true;
  
    try {
      const allViajes = await this.storageService.allViajes(); 
      console.log('All trips:', allViajes); 
  
      if (this.rolusuario === 'conductor') {
        this.viajes = allViajes.filter(viaje => viaje.nombreConductor === this.username);
        console.log('Filtered trips for conductor:', this.viajes); 
      } else if (this.rolusuario === 'pasajero') {
        this.viajes = allViajes;
        console.log('Trips for passenger:', this.viajes); 
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async DetallesViajeModal(viaje: Trip) {
    const modal = await this.modalCtrl.create({
      component: DetallesviajePage,
      componentProps: { viaje }
    });
  
    modal.onDidDismiss().then(async (result) => {  
      if (result.role === 'cancel') {
        this.viajes = this.viajes.filter(trip => trip.patente !== viaje.patente);
      } else if (result.data) {
        this.listaActualizada(result.data);
      }
      await this.cargarViajes();  
    });
  
    return await modal.present();
  }

  listaActualizada(viajeActualizado: Trip) {
    const index = this.viajes.findIndex(trip => trip.patente === viajeActualizado.patente);
    
    if (index !== -1) {
      if (viajeActualizado.capacidad > 0) {
        this.viajes[index] = viajeActualizado;
      } else {
        this.viajes.splice(index, 1);
      }
    }
  }
  volver() {
    this.router.navigate(['tabs/home']); 
  }
}
