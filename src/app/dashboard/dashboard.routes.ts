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
        data: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard',
          breadcrumbIcon: 'home',
          breadcrumbActive: true,
          breadcrumbLink: '/',
        },
      },
      {
        path: 'create-customer',
        loadComponent: () =>
          import('./pages/create-customer/create-customer.component'),
        data: {
          title: 'Agregar Cliente',
          breadcrumb: 'Agregar Cliente',
          breadcrumbIcon: 'user-plus',
          breadcrumbActive: false,
          breadcrumbLink: '/create-customer',
        },
      },
      {
        path: 'view-customers',
        loadComponent: () =>
          import('./pages/view-customer/view-customer.component'),
        data: {
          title: 'Ver Clientes',
          breadcrumb: 'Ver Clientes',
          breadcrumbIcon: 'users',
          breadcrumbActive: false,
          breadcrumbLink: '/view-customers',
        },
      },
      {
        path: 'view-customers/:id',
        loadComponent: () =>
          import('./pages/view-one-customer/view-one-customer.component'),
        data: {
          title: 'Información de Cliente',
          breadcrumb: 'Información de Cliente',
          breadcrumbIcon: 'user',
          breadcrumbActive: false,
          breadcrumbLink: '/view-customers/:id',
        },
      },
      {
        path: 'modify-balance',
        loadComponent: () =>
          import('./pages/modify-balance/modify-balance.component'),
        data: {
          title: 'Modificar Saldo',
          breadcrumb: 'Modificar Saldo',
          breadcrumbIcon: 'money-bill-wave',
          breadcrumbActive: false,
          breadcrumbLink: '/modify-balance',
        },
      },
    ],
  },
];
