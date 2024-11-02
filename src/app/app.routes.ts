import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',  loadComponent: () => import('./login/login.page').then( m => m.LoginPage),},
  { path: 'resetcontrasenia', loadComponent: () => import('./resetcontrasenia/resetcontrasenia.page').then(m => m.ResetContraseniaPage) },
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },
  { path: 'viajesdisp', loadComponent: () => import('./viajesdisp/viajesdisp.page').then(m => m.ViajesDispPage) },
  { path: 'programarviaje',loadComponent: () => import('./programarviaje/programarviaje.page').then( m => m.ProgramarViajePage)},
  {
    path: 'detallesviaje',
    loadComponent: () => import('./detallesviaje/detallesviaje.page').then( m => m.DetallesviajePage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'sobre',
    loadComponent: () => import('./sobre/sobre.page').then( m => m.SobrePage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'viajedetalle',
    loadComponent: () => import('./viajedetalle/viajedetalle.page').then( m => m.ViajeDetallePage)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
