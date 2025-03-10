import { Routes } from '@angular/router';
import { LayoutComponent } from './front-office/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'home', 
        loadComponent: () => import('./front-office/layout/layout.component').then(m => m.LayoutComponent) 
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./back-office/back-office.component').then(m => m.BackOfficeComponent) 
  },
];
