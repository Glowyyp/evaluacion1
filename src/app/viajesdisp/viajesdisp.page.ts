import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular'; 
import { CommonModule } from '@angular/common';
import { StorageService, Trip } from '../services/storage.service';
import { ModalController } from '@ionic/angular';
import { DetallesviajePage } from '../detallesviaje/detallesviaje.page';

declare var google: any;

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
  directionsService: any;
  directionsRenderer: any;

  constructor(private router: Router, private storageService: StorageService, private modalCtrl: ModalController) {}

  async ngOnInit() {
    this.viajes = await this.storageService.allViajes();
    await this.cargarViajes();
  }
  
  async cargarViajes() {
    this.viajes = await this.storageService.allViajes();
  }
  async actualizarIon() {
    await this.cargarViajes();
  }
  
  async DetallesViajeModal(viaje: Trip) {
    const modal = await this.modalCtrl.create({
      component: DetallesviajePage,
      componentProps: { viaje }
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.role === 'cancel') {
        this.viajes = this.viajes.filter(trip => trip.patente !== viaje.patente);
      } else if (result.data) {
        this.listaActualizada(result.data);
      }
    });
  
    return await modal.present();
  }
  


  verRuta(viaje: Trip) {
    const mapElement = document.getElementById('map');
    const trayectoElement = document.getElementById('trayecto');
    
    if (mapElement && trayectoElement) {
     
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();

      const map = new google.maps.Map(mapElement, {
        center: viaje.origin,
        zoom: 15
      });

      this.directionsRenderer.setMap(map);
      this.directionsRenderer.setPanel(trayectoElement);

     
      const request = {
        origin: viaje.origin,
        destination: viaje.destination,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);

          const route = result.routes[0];
          const distance = route.legs[0].distance.value / 1000; 
          const duration = route.legs[0].duration.text;
          
          
          const costPerKm = viaje.costoPorKm || 0.5;
          const totalCost = distance * costPerKm;
          const costPerPerson = totalCost / viaje.capacidad;
  
          alert(`Distancia: ${distance} km\nDuración estimada: ${duration}\nCosto total: ${totalCost.toFixed(2)}\nCosto por persona: ${costPerPerson.toFixed(2)}`);
      

        } else {
          alert('Error al calcular la ruta');
          console.error("calculo de ruta fallo con el estado de : ", status);
        }
      });
    } else {
      console.error("trayecto no encontrado");
    }
  }

  volver() {
    this.router.navigate(['/home']);
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
}
