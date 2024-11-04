import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Trip } from '../services/storage.service';
import { QRCodeModule } from 'angularx-qrcode';

declare var google: any;

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viajedetalle.page.html',
  styleUrls: ['./viajedetalle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, QRCodeModule]
})
export class ViajeDetallePage implements OnInit, AfterViewInit {
  @Input() viaje!: Trip;
  showQR: boolean = false;

  @ViewChild('map', { static: false }) mapElementRef!: ElementRef;
  mapa: any;
  servicioDirecciones: any;
  renderizadorDirecciones: any;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log("Detalles del viaje:", this.viaje);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 500);
  }

  initializeMap() {
    if (!this.mapElementRef) {
      console.error("Map element reference not found.");
      return;
    }

    const mapElement = this.mapElementRef.nativeElement;
    mapElement.style.height = '300px';
    mapElement.style.width = '100%';

    this.mapa = new google.maps.Map(mapElement, {
      center: this.viaje.origin,
      zoom: 15
    });

    this.servicioDirecciones = new google.maps.DirectionsService();
    this.renderizadorDirecciones = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      map: this.mapa
    });

    const trayectoElement = document.getElementById('trayecto');
    if (trayectoElement) {
      this.renderizadorDirecciones.setPanel(trayectoElement);
    } else {
      console.warn("Trayecto panel not found");
    }

    google.maps.event.addListenerOnce(this.mapa, 'tilesloaded', () => {
      google.maps.event.trigger(this.mapa, 'resize');
      this.mapa.setCenter(this.viaje.origin);
      setTimeout(() => this.displayRoute(), 300); 
    });
  }

  displayRoute() {
    if (!this.servicioDirecciones || !this.renderizadorDirecciones) return;
  
    const request = {
      origin: { lat: this.viaje.origin.lat, lng: this.viaje.origin.lng },
      destination: this.viaje.destino,
      travelMode: google.maps.TravelMode.DRIVING
    };
  
    console.log("Solicitud de ruta:", request);
  
    this.servicioDirecciones.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log("Resultado de las direcciones:", result); 
        this.renderizadorDirecciones.setDirections(result); 
      } else {
        alert('Error al calcular la ruta');
        console.error("Error al calcular la ruta:", status);
      }
    });
  }

  finishTrip() {
    this.showQR = true;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
