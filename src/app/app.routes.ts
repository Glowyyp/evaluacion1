import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'resetcontrasenia', loadComponent: () => import('./resetcontrasenia/resetcontrasenia.page').then(m => m.ResetContraseniaPage) },
  { path: 'registro', loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage) },
  

  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'programarviaje',
        loadComponent: () => import('./programarviaje/programarviaje.page').then(m => m.ProgramarViajePage)
      },
      {
        path: 'viajesdisp',
        loadComponent: () => import('./viajesdisp/viajesdisp.page').then(m => m.ViajesDispPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage)
      },
      {
        path: 'sobre',
        loadComponent: () => import('./sobre/sobre.page').then(m => m.SobrePage)
      },
      
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
