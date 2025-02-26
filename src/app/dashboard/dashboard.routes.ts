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
      {
        path: 'view-customers',
        loadComponent: () =>
          import('./pages/view-customer/view-customer.component'),
      },
      {
        path: 'view-customers/:id',
        loadComponent: () =>
          import('./pages/view-one-customer/view-one-customer.component'),
      },
      {
        path: 'modify-balance',
        loadComponent: () =>
          import('./pages/modify-balance/modify-balance.component'),
      },
    ],
  },
];
