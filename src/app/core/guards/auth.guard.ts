import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthenticatedUserService } from '../services/authenticated-user.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const authService = inject(AuthenticatedUserService);
  const router = inject(Router);

  // const token = storage.get('session');
  const token = authService.isAuthenticated();

  if (token) {
    router.navigate(['/']);
    return false;
  }

  return true;
};

export const privateGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const authService = inject(AuthenticatedUserService);
  const router = inject(Router);

  // const token = storage.get('session');
  const token = authService.isAuthenticated();

  if (token) {
    return true;
  }

  router.navigate(['/auth/login']);

  authService.logout();

  return false;
};
