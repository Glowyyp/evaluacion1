import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Trip } from '../services/storage.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

declare var google: any;

@Component({
  selector: 'app-detallesviaje',
  templateUrl: './detallesviaje.page.html',
  styleUrls: ['./detallesviaje.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class DetallesviajePage implements OnInit {
  @Input() viaje!: Trip; 
  
  
  distance: number = 0;
  duration: string = '';
  totalCost: number = 0;
  costPerPerson: number = 0;

  directionsService: any;
  directionsRenderer: any;

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() { 
    this.iniciarMap();
  }

  iniciarMap() {
    const mapElement = document.getElementById('map');
    const trayectoElement = document.getElementById('trayecto');

    if (mapElement && trayectoElement) {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();

      const map = new google.maps.Map(mapElement, {
        center: this.viaje.origin,
        zoom: 15
      });

      this.directionsRenderer.setMap(map);
      this.directionsRenderer.setPanel(trayectoElement);

      const request = {
        origin: this.viaje.origin,
        destination: this.viaje.destination,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);

          const route = result.routes[0];
          this.distance = route.legs[0].distance.value / 1000; // Convert meters to km
          this.duration = route.legs[0].duration.text;

          const costPerKm = 0.5; // For example, 0.5 currency units per km
          this.totalCost = this.distance * costPerKm;
          this.costPerPerson = this.totalCost / this.viaje.capacidad;
        } else {
          alert('Error al calcular la ruta');
        }
      });
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  confirmar() {
  
    if (this.viaje.capacidad > 0) {
      this.viaje.capacidad--; 
      alert('Viaje solicitado');
      this.modalCtrl.dismiss(this.viaje);
    } else {
      alert('Capacidad agotada');
    }
  }
  cancelarViaje() {
    const currentTime = new Date();
    const viajeTime = new Date(this.viaje.inicio); 

    if (viajeTime.getTime() - currentTime.getTime() >= 30 * 60 * 1000) {
      alert('Viaje cancelado con éxito.');
      this.modalCtrl.dismiss(null, 'cancel');
    } else {
      alert('No se puede cancelar el viaje con menos de 30 minutos de anticipación.');
    }
  }
}
