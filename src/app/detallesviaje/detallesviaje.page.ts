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
  
  distancia: number = 0;
  duracion: string = '';
  costoTotal: number = 0;
  costoPorPersona: number = 0;

  directionsService: any;
  directionsRenderer: any;

  constructor(
    private modalCtrl: ModalController
  ) {}

  ngOnInit() { 
    this.iniciarMapa();
  }

  iniciarMapa() {
    const elementoMapa = document.getElementById('map');
    const elementoTrayecto = document.getElementById('trayecto');

    if (elementoMapa && elementoTrayecto) {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();

      const mapa = new google.maps.Map(elementoMapa, {
        center: this.viaje.origin,
        zoom: 15
      });

      this.directionsRenderer.setMap(mapa);
      this.directionsRenderer.setPanel(elementoTrayecto);

      const solicitud = {
        origin: this.viaje.origin,
        destination: this.viaje.destino,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(solicitud, (resultado: any, estado: any) => {
        if (estado === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(resultado);

          const ruta = resultado.routes[0];
          this.distancia = ruta.legs[0].distance.value / 1000;
          this.duracion = ruta.legs[0].duration.text;

          const costoPorKm = 0.5;
          this.costoTotal = this.distancia * costoPorKm;
          this.costoPorPersona = this.costoTotal / this.viaje.capacidad;
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
    const horaActual = new Date();
    const horaViaje = new Date(this.viaje.inicio); 

    if (horaViaje.getTime() - horaActual.getTime() >= 30 * 60 * 1000) {
      alert('Viaje cancelado con éxito.');
      this.modalCtrl.dismiss(null, 'cancel');
    } else {
      alert('No se puede cancelar el viaje con menos de 30 minutos de anticipación.');
    }
  }
}
