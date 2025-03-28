// app.routes.ts

import { Routes } from '@angular/router';
import { LayoutComponent } from './front-office/layout/layout.component';
import { HomeComponent } from './front-office/home/home.component';
import { ADMIN_ROUTES } from './back-office/admin.routes'; // Importing admin routes

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    children: ADMIN_ROUTES // Including the admin routes here
  }
];
