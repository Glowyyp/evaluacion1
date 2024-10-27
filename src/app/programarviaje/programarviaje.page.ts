import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';  
import { Router } from '@angular/router';

declare var google:any;


@Component({
  selector: 'app-programarviaje',
  templateUrl: './programarviaje.page.html',
  styleUrls: ['./programarviaje.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]  
})
export class ProgramarViajePage implements OnInit {

  costo: number = 0;
  capacidad: number = 0;
  nombreConductor: string = '';
  apellidoConductor: string = '';
  patente: string = '';
  info: string='';

  mapa:any;
  marker:any;
  puntoreferencia={lat:-33.56927262660861, lng:-70.55750206116815} //latitud,longitud
  search:any;

  directionsService:any;
  directionsRenderer:any;
  
  
  constructor(private router: Router) { 
    
  }
  
  volver() {
    this.router.navigate(['/home']);
  }


  agendar() {
    if (this.capacidad > 0 &&
        this.costo > 0 && 
        this.nombreConductor.length >= 3 &&
        this.apellidoConductor.length >= 3 && 
        this.patente.length > 0 && 
        this.patente.length === 7 &&
        this.info.length >= 1 
        ) {
       
        alert(`Su viaje ha sido programado con una capacidad de ${this.capacidad} pasajeros y un costo de $${this.costo} por pasajero`);
        this.router.navigate(['/home'])
    } else {
      if(this.capacidad <= 0){
        alert('ingrese una capacidad valida');
      }else if(this.costo <= 0){
        alert('Ingrese un costo valido')
      }else if(this.nombreConductor.length <= 3 ){
        alert('Ingrese un Nombre valido')
      }else if(this.apellidoConductor.length <= 3){
        alert('Ingrese un apellido Valido')
      }else if(this.patente.length != 7){
        alert('Ingrese una patente valida de 7 caracteres')  
    }

    this.router.navigate(['/home'])
  }
}
  

  ngOnInit() {

    this.dibujarMapa();
    this.buscarDireccion(this.mapa, this.marker );
  }

  dibujarMapa(){
    var mapElement =document.getElementById('map')
    //verifico si existe el objeto
    if(mapElement){
      // crear un nuevo mapa
      this.mapa =new google.maps.Map(mapElement,{
        center: this.puntoreferencia,
        zoom:15 //1: al 25
      });

      // crear un marcador
      this.marker = new google.maps.Marker({
        position:this.puntoreferencia,
        map:this.mapa

      });

      // Inicializar variables

      this.directionsService= new google.maps.DirectionsService();
      this.directionsRenderer= new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.mapa)

      // variables para leer la caja de indicaciones

      var trayecto=document.getElementById('trayecto') as HTMLInputElement | null;
      this.directionsRenderer.setPanel(trayecto);


    }// fin mapElemet


  }// fin dibujar mapa




  calculaRuta() {
    alert('Calculo ruta en progreso...');

      const origen= this.puntoreferencia;
      const destino= this.search.getPlace().geometry.location;

      const request={
        origin:origen,
        destination:destino,
        travelMode: google.maps.TravelMode.DRIVING 
      };

      this.directionsService.route(request, (result:any, status:any) =>{
        if(status === google.maps.DirectionsStatus.OK){
          this.directionsRenderer.setDirections(result);
        }else{
          alert('error al calcular la ruta');
        }
        this.marker.setPosition(null);

      });

  } // fin  calculaRuta() 


  buscarDireccion(mapaLocal:any, marcadorLocal:any ){
    var input = document.getElementById('autocomplete') as HTMLInputElement | null;
    if(input) {
      const autocomplete =new google.maps.places.Autocomplete(input);
      this.search=autocomplete;

      // Agregamos movimiento del mapa
      autocomplete.addListener('place_changed', () => {
        const place =autocomplete.getPlace().geometry.location; // Lat y Long de la caja
        mapaLocal.setCenter(place);
        mapaLocal.setZoom(13); 
        marcadorLocal.setPosition(place);
      this.calculaRuta();
      });





    }  else {
        alert("Elemento autocomplete no encontrado")
    }// fin if

  } // fin   buscarDireccion()


}



