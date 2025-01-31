import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DashboardRoutes),
    canActivate: [privateGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AuthRoutes),
    canActivate: [publicGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
