import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const token = storage.get('session');

  if (token) {
    router.navigate(['/']);
    return false;
  }

  return true;
};

export const privateGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const token = storage.get('session');

  if (token) {
    return true;
  }

  router.navigate(['/auth/login']);

  return false;
};
