import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StorageService, Trip } from '../services/storage.service';

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
  apellidoConductor: string = '';
  patente: string = '';
  info: string = '';

 
  mapa: any;
  marker: any;
  puntoreferencia = { lat: -33.56927262660861, lng: -70.55750206116815 };
  search: any;
  directionsService: any;
  directionsRenderer: any;
  routeDirections: any;  
  destinationAddress: string = ''; 

  constructor(private router: Router, private storageService: StorageService) { }

  ngOnInit() {
    this.dibujarMapa();
    this.buscarDireccion(this.mapa, this.marker);
  }

  dibujarMapa() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      this.mapa = new google.maps.Map(mapElement, {
        center: this.puntoreferencia,
        zoom: 15
      });

      this.marker = new google.maps.Marker({
        position: this.puntoreferencia,
        map: this.mapa
      });

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.mapa);

      const trayecto = document.getElementById('trayecto');
      if (trayecto) {
        this.directionsRenderer.setPanel(trayecto);
      } else {
        console.warn("panel de trayecto no encontrado");
      }
    } else {
      console.error("elemento no encontrado");
    }
  }

  async agendar() {
  
    if (this.capacidad > 0 && this.costo > 0 && 
        this.nombreConductor.length >= 3 &&
        this.apellidoConductor.length >= 3 && 
        this.patente.length === 7 && this.routeDirections) {
      
      const viaje: Trip = {
        nombreConductor: this.nombreConductor,
        apellidoConductor: this.apellidoConductor,
        patente: this.patente,
        capacidad: this.capacidad,
        costo: this.costo,
        info: this.info,
        origin: this.puntoreferencia,              
        destination: this.destinationAddress,      
        routeDirections: this.routeDirections  
      };

      await this.storageService.agregarViaje(viaje);
      alert(`Su viaje ha sido programado con una capacidad de ${this.capacidad} pasajeros y un costo de $${this.costo} por pasajero.`);
      this.router.navigate(['/viajesdisp']);
      
    } else {
      this.mostrarErroresVa();
    }
  }

  calculaRuta() {
    if (!this.search || !this.search.getPlace()) {
      alert("porfavor seleccione una direccion valida");
      return;
    }
  
    const origen = this.puntoreferencia;
    const place = this.search.getPlace();
    const destino = place.geometry.location;
    this.destinationAddress = place.formatted_address;
  
    const request = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING 
    };
  
    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        
        
        this.routeDirections = {
          distance: result.routes[0].legs[0].distance.text,
          duration: result.routes[0].legs[0].duration.text,
          steps: result.routes[0].legs[0].steps.map((step: any) => ({
            instructions: step.instructions,
            distance: step.distance.text,
            duration: step.duration.text
          }))
        };
  
        console.log("ruta calculada con exito");
      } else {
        alert('Error al calcular la ruta');
        console.error("calculo de ruta fallo con el estado:", status);
      }
    });
  }

  buscarDireccion(mapaLocal: any, marcadorLocal: any) {
    const input = document.getElementById('autocomplete') as HTMLInputElement | null;
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      this.search = autocomplete;

      
      autocomplete.addListener('direccion cambiada', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.warn("direccion seleccionada no valida");
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
    this.router.navigate(['/home']);
  }

  mostrarErroresVa() {
    if (this.capacidad <= 0) {
      alert('Ingrese una capacidad válida');
    } else if (this.costo <= 0) {
      alert('Ingrese un costo válido');
    } else if (this.nombreConductor.length < 3) {
      alert('Ingrese un nombre válido');
    } else if (this.apellidoConductor.length < 3) {
      alert('Ingrese un apellido válido');
    } else if (this.patente.length !== 7) {
      alert('Ingrese una patente válida de 7 caracteres');
    } else if (!this.routeDirections) {
      alert('Seleccione un destino y calcule la ruta.');
    }
  }
}

