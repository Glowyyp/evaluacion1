import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StorageService, Trip } from '../services/storage.service';
import { ModalController } from '@ionic/angular/standalone';
import { ViajeDetallePage } from '../viajedetalle/viajedetalle.page';
import { registroService } from '../services/registro.service';

declare var google: any;

@Component({
  selector: 'app-programarviaje',
  templateUrl: './programarviaje.page.html',
  styleUrls: ['./programarviaje.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProgramarViajePage implements OnInit {
  costo: number = 0;
  capacidad: number = 0;
  nombreConductor: string = '';
  patente: string = '';
  info: string = '';
  costoPorKm: number = 0;
  inicio = new Date().toISOString();

  mapa: any;
  marcador: any;
  puntoReferencia = { lat: -33.59832207631835, lng: -70.57876561735603 };
  busqueda: any;
  servicioDirecciones: any;
  renderizadorDirecciones: any;
  direccionesRuta: any;
  direccionDestino: string = '';

  constructor(private router: Router, 
    private storageService: StorageService, 
    private modalCtrl: ModalController,
    private registroService: registroService) { }
  async ngOnInit() {
    
    const usuarioActual = await this.registroService.obtenerUsuarioActual();
    if (usuarioActual) {
      this.nombreConductor = usuarioActual.username;
     
    }
    
    this.dibujarMapa();
    this.buscarDireccion(this.mapa, this.marcador);
  }

  dibujarMapa() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.mapa = new google.maps.Map(mapElement, {
        center: this.puntoReferencia,
        zoom: 15
      });

      this.marcador = new google.maps.Marker({
        position: this.puntoReferencia,
        map: this.mapa
      });

      this.servicioDirecciones = new google.maps.DirectionsService();
      this.renderizadorDirecciones = new google.maps.DirectionsRenderer();
      this.renderizadorDirecciones.setMap(this.mapa);

      const trayecto = document.getElementById('trayecto');
      if (trayecto) {
        this.renderizadorDirecciones.setPanel(trayecto);
      } else {
        console.warn("panel de trayecto no encontrado");
      }
    } else {
      console.error("elemento no encontrado");
    }
  }

  async agendar() {
    if (this.capacidad > 0 && this.costo > 0 &&
        this.nombreConductor.length >= 3 && // Only checking conductor's name
        this.patente.length === 7 && this.direccionesRuta) {
      
      const viaje: Trip = {
        nombreConductor: this.nombreConductor,
        patente: this.patente,
        capacidad: this.capacidad,
        costo: this.costo, 
        info: this.info,
        origin: this.puntoReferencia,
        destino: this.direccionDestino,
        routeDirections: this.direccionesRuta,
        inicio: this.inicio
      };
  
      await this.storageService.agregarViaje(viaje);
      alert(`Su viaje ha sido programado con una capacidad de ${this.capacidad} pasajeros y un costo de $${this.costo} por pasajero.`);
      this.router.navigate(['tabs/home']);
      
      const modal = await this.modalCtrl.create({
        component: ViajeDetallePage,
        componentProps: { viaje: viaje }
      });
  
      await modal.present();
  
    } else {
      this.mostrarErrores();
    }
  }
  

  calculaRuta() {
    if (!this.busqueda || !this.busqueda.getPlace()) {
      alert("Por favor seleccione una dirección válida");
      return;
    }
  
    const origen = this.puntoReferencia;
    const place = this.busqueda.getPlace();
    const destino = place.geometry.location;
    this.direccionDestino = place.formatted_address;
  
    const request = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING
    };
  
    this.servicioDirecciones.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.renderizadorDirecciones.setDirections(result);
  
   
        let distanciaText = result.routes[0].legs[0].distance.text;
        let distanciaEnKm = parseFloat(distanciaText.replace(',', '.'));
  
        if (distanciaText.includes(" m")) {
          distanciaEnKm = distanciaEnKm / 1000; 
        }
  
       
        this.direccionesRuta = {
          distance: distanciaText,
          duration: result.routes[0].legs[0].duration.text,
          steps: result.routes[0].legs[0].steps.map((step: any) => ({
            instructions: step.instructions,
            distance: step.distance.text,
            duration: step.duration.text
          }))
        };
  
       
        if (distanciaEnKm > 0) {
          this.costoPorKm = this.costo / distanciaEnKm;
        } else {
          this.costoPorKm = 0; 
        }
  
        console.log("Ruta calculada con éxito");
        console.log("Distancia original:", distanciaText);
        console.log("Distancia en km:", distanciaEnKm);
        console.log("Costo por Km calculado:", this.costoPorKm);
      } else {
        alert('Error al calcular la ruta');
        console.error("Calculo de ruta falló con el estado:", status);
      }
    });
  }
  

  buscarDireccion(mapaLocal: any, marcadorLocal: any) {
    const input = document.getElementById('autocomplete') as HTMLInputElement | null;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      this.busqueda = autocomplete;

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.warn("dirección seleccionada no válida");
          return;
        }

        const location = place.geometry.location;
        mapaLocal.setCenter(location);
        mapaLocal.setZoom(13);
        marcadorLocal.setPosition(location);
        this.calculaRuta();
      });
    } else {
      alert("Elemento autocomplete no encontrado");
    }
  }

  volver() {
    this.router.navigate(['tabs/home']);

  }

  mostrarErrores() {
    if (this.capacidad <= 0) {
      alert('Ingrese una capacidad válida');
    } else if (this.costo <= 0) {
      alert('Ingrese un costo válido');
    } else if (this.nombreConductor.length < 3) {
      alert('Ingrese un nombre válido');
    } else if (this.patente.length !== 7) {
      alert('Ingrese una patente válida de 7 caracteres');
    } else if (!this.direccionesRuta) {
      alert('Seleccione un destino y calcule la ruta.');
    }
  }
}
