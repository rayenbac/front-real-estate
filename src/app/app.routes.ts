import { Routes } from '@angular/router';
import { LayoutComponent } from './front-office/layout/layout.component';
import { HomeComponent } from './front-office/home/home.component';
import { DashboardLayoutComponent } from './back-office/layout/layout.component';
import { DashboardComponent } from './back-office/dashboard/dashboard.component';

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
    component: DashboardLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'properties',
        loadChildren: () => import('./back-office/properties/properties.routes').then(m => {
          console.log('Lazy loading properties routes');
          return m.PROPERTIES_ROUTES;
        })
      },
      {
        path: 'users',
        loadChildren: () => import('./back-office/users/users.routes').then(m => m.USERS_ROUTES)
      },
      {
        path: 'posts',
        loadChildren: () => import('./back-office/posts/posts.routes').then(m => m.POSTS_ROUTES)
      },
      {
        path: 'categories',
        loadChildren: () => import('./back-office/categories/categories.routes').then(m => m.CATEGORIES_ROUTES)
      },
      // {
      //   path: 'reviews',
      //   loadChildren: () => import('./back-office/reviews/reviews.routes').then(m => m.REVIEWS_ROUTES)
      // },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Add this line for fallback route
];
