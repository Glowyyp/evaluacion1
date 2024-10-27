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
}
