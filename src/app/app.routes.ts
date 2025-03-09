import { Routes } from '@angular/router';


export const routes: Routes = [
  { 
    path: 'home', 
    loadComponent: () => import('./front-office/front-office.component').then(m => m.FrontOfficeComponent) 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./back-office/back-office.component').then(m => m.BackOfficeComponent) 
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
