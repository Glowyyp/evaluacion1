import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { Trip } from '../services/storage.service';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { StorageService } from '../services/storage.service';

declare var google: any;

@Component({
  selector: 'app-confimarcionpago',
  templateUrl: './confimarcionpago.page.html',
  styleUrls: ['./confimarcionpago.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfirmacionPagoPage implements OnInit, OnDestroy {
  @Input() viaje!: Trip;
  costoPorPersona: number = 0;
  distancia: number = 0;
  duracion: string = '';
  scannerResult: string | null = null;
  private html5QrCode: Html5QrcodeScanner | null = null;
  isCameraPermissionGranted: boolean = false;

  @ViewChild('map', { static: false }) mapElementRef!: ElementRef;
  mapa: any;
  servicioDirecciones: any;
  renderizadorDirecciones: any;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.costoPorPersona = this.viaje.costo;

    if (this.viaje.routeDirections) {
      let distanciaText = this.viaje.routeDirections.distance;

      if (distanciaText.includes("km")) {
        this.distancia = parseFloat(distanciaText.replace(" km", "").replace(",", "."));
      } else if (distanciaText.includes("m")) {
        const metros = parseFloat(distanciaText.replace(" m", "").replace(",", "."));
        this.distancia = metros / 1000;
      }

      this.duracion = this.viaje.routeDirections.duration;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 500);
  }
  initializeMap() {
    if (!this.mapElementRef) {
      console.error("Referencia al elemento del mapa no encontrada.");
      return;
    }
  
    const mapElement = this.mapElementRef.nativeElement;
    mapElement.style.height = '250px';
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
      console.warn("Panel de trayecto no encontrado");
    }
  
    this.displayRoute();
  }
  

  displayRoute() {
    if (!this.servicioDirecciones || !this.renderizadorDirecciones) return;

    const request = {
      origin: { lat: this.viaje.origin.lat, lng: this.viaje.origin.lng },
      destination: this.viaje.destino,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.servicioDirecciones.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.renderizadorDirecciones.setDirections(result);
      } else {
        alert('Error al calcular la ruta');
        console.error("Error al calcular la ruta:", status);
      }
    });
  }

  requestCameraPermission() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.isCameraPermissionGranted = true;
        })
        .catch((error) => {
          console.error("Detalles del error al solicitar permisos de cámara:", error);
          alert("Error al solicitar permisos de cámara: " + (error.message || error.name || error));
        });
    } else {
      alert("Navegador no soporta el acceso a la cámara");
    }
  }

  startScanner() {
    const config = {
      fps: 10,
      qrbox: 250,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    this.html5QrCode = new Html5QrcodeScanner("reader", config, false);

    this.html5QrCode.render(
      (result) => {
        this.scannerResult = result;
        console.log("Resultado del escáner", result);
        this.html5QrCode?.clear();
      },
      (error) => {
        console.warn("Error al escanear el código QR:", error);
      }
    );
  }

  async finalizarPago() {
    const success = await this.storageService.reducirCapacidad(this.viaje.patente);

    if (success) {
      alert('Pago realizado con éxito. Capacidad del viaje actualizada.');
    } else {
      alert('Error al actualizar el viaje.');
    }

    this.navCtrl.navigateRoot('tabs/home');
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }

  pagar() {
    this.startScanner();
  }

  finalizarViaje() {
    this.navCtrl.navigateRoot('tabs/home');
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if (this.html5QrCode) {
      this.html5QrCode.clear();
    }
  }
}
