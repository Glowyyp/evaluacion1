import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Trip {
  nombreConductor: string;
  patente: string;
  capacidad: number;
  costo: number;
  info: string;
  origin: { lat: number; lng: number }; 
  destino: string; 
  routeDirections: any; 
  inicio: string; 
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly TRIPS_KEY = 'viajes';
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  private async getStorage(): Promise<Storage> {
    if (!this._storage) {
      await this.init();
    }
    return this._storage!;
  }

  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async get(key: string) {
    return await this.storage.get(key);
  }

  async remove(key: string) {
    await this.storage.remove(key);
  }

  async allViajes(): Promise<Trip[]> {
    const trips = await this.get(this.TRIPS_KEY);
    return trips ? trips : [];
  }

  async agregarViaje(newTrip: Trip) {
    const trips = await this.allViajes();
    trips.push(newTrip);
    await this.set('viajes', trips);  
    console.log('Trip added:', newTrip);  
  }

  async viajeActualizado(viajeActualizado: Trip) {
    const trips = await this.allViajes();
    const index = trips.findIndex(trip => trip.patente === viajeActualizado.patente);
    
    if (index !== -1) {
      trips[index] = viajeActualizado;
      await this.set(this.TRIPS_KEY, trips);
    }
  }
  async eliminarViaje(patente: string): Promise<void> {
    const trips = await this.allViajes();
    const updatedTrips = trips.filter(trip => trip.patente !== patente);
    await this.set(this.TRIPS_KEY, updatedTrips);
    console.log('Viaje eliminado:', patente);
  }
 
  async reducirCapacidad(patente: string): Promise<boolean> {
    const trips = await this.allViajes();
    const index = trips.findIndex(trip => trip.patente === patente);

    if (index !== -1) {
      trips[index].capacidad -= 1; 

      if (trips[index].capacidad <= 0) {
        trips.splice(index, 1); 
      }

      await this.set(this.TRIPS_KEY, trips); 
      return true;
    }
    return false;
  }
}
