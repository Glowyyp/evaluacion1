import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
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
  showQR: boolean = false; // 
  tripFinished: boolean = false; 

  @ViewChild('map', { static: false }) mapElementRef!: ElementRef;
  @ViewChild('trayecto', { static: false }) trayectoElementRef!: ElementRef;

  mapa: any;
  servicioDirecciones: any;
  renderizadorDirecciones: any;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) {}

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
      console.error("no se encontró la dirección");
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
      map: this.mapa,
      suppressMarkers: false
    });

    setTimeout(() => {
      if (this.trayectoElementRef) {
        console.log("Panel de trayecto encontrado");
        this.renderizadorDirecciones.setPanel(this.trayectoElementRef.nativeElement);
        this.displayRoute();
      } else {
        console.warn("Panel de trayecto no encontrado en el tiempo límite");
      }
    }, 500); 

    google.maps.event.addListenerOnce(this.mapa, 'tilesloaded', () => {
      google.maps.event.trigger(this.mapa, 'resize');
    });
  }

  displayRoute() {
    if (!this.servicioDirecciones || !this.renderizadorDirecciones) {
      console.error("Servicio o renderizador no iniciado");
      return;
    }

    const request = {
      origin: { lat: this.viaje.origin.lat, lng: this.viaje.origin.lng },
      destination: this.viaje.destino,
      travelMode: google.maps.TravelMode.DRIVING
    };

    console.log("Requesting route:", request);

    this.servicioDirecciones.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log("Route result:", result);
        this.renderizadorDirecciones.setDirections(result);

        google.maps.event.trigger(this.mapa, 'resize');
        this.mapa.setCenter(this.viaje.origin);
      } else {
        alert('Error al calcular la ruta');
        console.error("Error al calcular la ruta:", status);
      }
    });
  }

  async finishTrip() {
    if (!this.showQR) {
    
      this.showQR = true;
    } else if (!this.tripFinished) {
     
      this.tripFinished = true;

    
      const alert = await this.alertCtrl.create({
        header: 'Viaje Finalizado',
        message: 'El viaje ha sido completado exitosamente.',
        buttons: ['OK']
      });

      await alert.present();

     
      this.modalCtrl.dismiss({ finished: true });
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
