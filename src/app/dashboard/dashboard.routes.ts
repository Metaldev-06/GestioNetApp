import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component'),
      },
      {
        path: 'create-customer',
        loadComponent: () =>
          import('./pages/create-customer/create-customer.component'),
      },
    ],
  },
];
