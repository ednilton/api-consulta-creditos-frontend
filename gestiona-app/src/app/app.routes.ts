import { Routes } from '@angular/router';

// app-routing.module.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/consulta-creditos',
    pathMatch: 'full'
  },
  {
    path: 'consulta-creditos',
    loadComponent: () =>
      import('./pages/consulta-creditos/consulta-creditos.component').then(
        (m) => m.ConsultaCreditosComponent
      ),
    title: 'Consulta de Créditos ISSQN'
  },
  {
    path: '**',
    redirectTo: '/consulta-creditos'
  }
];