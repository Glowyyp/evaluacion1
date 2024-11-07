import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class registroService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async registroUsuario(usuario: any) {
    const usuarios = await this._storage?.get('personas') || [];
    usuarios.push(usuario);
    await this._storage?.set('personas', usuarios);
    await this._storage?.set('usuarioActual', usuario); 
    console.log('Usuario registrado y guardado como actual:', usuario); 
  }
  
  
  private async ensureStorageInitialized() {
    if (!this._storage) {
      await this.init();
    }
  }

  async obtenerUsuarioActual() {
    await this.ensureStorageInitialized();
    const usuarioActual = await this._storage?.get('usuarioActual');
    console.log('Obteniendo usuario actual:', usuarioActual);  
    return usuarioActual;
  }

  

  async actualizarUsuarioActual(usuarioActualizado: any) {
    await this._storage?.set('usuarioActual', usuarioActualizado);
  }

  async obtenerUsuarios(key: string): Promise<any[]> {
    return await this.storage.get(key) || [];
  }

  async actualizarUsuario(key: string, usuarioActualizado: any) {
    const usuarios = await this.obtenerUsuarios(key);
    const index = usuarios.findIndex(user => user.identificador === usuarioActualizado.identificador);
    if (index !== -1) {
      usuarios[index] = usuarioActualizado;
      await this.storage.set(key, usuarios);
    }
  }
  async setUsuarioActual(usuario: any) {
    await this._storage?.set('usuarioActual', usuario);
  }
  

  async eliminarUsuario(key: string, identificador: string) {
    const usuarios = await this.obtenerUsuarios(key);
    const usuariosActualizados = usuarios.filter(user => user.identificador !== identificador);
    await this.storage.set(key, usuariosActualizados);
  }
  
  async eliminarUsuarioActual() {
    await this.ensureStorageInitialized();
    await this._storage?.remove('usuarioActual');
    console.log('Usuario actual eliminado de la sesión');
}
  
  
  async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }
  
  
  
  async get(key: string) {
    return await this._storage?.get(key);
  }
  async remove(key: string) {
    await this._storage?.remove(key);
  }
}
