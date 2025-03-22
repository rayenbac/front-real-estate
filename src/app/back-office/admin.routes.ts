import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Import the routes for each feature
import { USERS_ROUTES } from './users/users.routes';
import { PROPERTIES_ROUTES } from './properties/properties.routes';
import { POSTS_ROUTES } from './posts/posts.routes';
import { CATEGORIES_ROUTES } from './categories/categories.routes';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'properties',
        children: PROPERTIES_ROUTES  // Include the routes from properties.routes.ts
      },
      {
        path: 'users',
        children: USERS_ROUTES  // Include the routes from users.routes.ts
      },
      {
        path: 'posts',
        children: POSTS_ROUTES  // Include the routes from posts.routes.ts
      },
      {
        path: 'categories',
        children: CATEGORIES_ROUTES  // Include the routes from categories.routes.ts
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
