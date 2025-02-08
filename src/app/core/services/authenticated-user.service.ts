import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { StoreUser } from '../interfaces/store-user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedUserService {
  private readonly _storage = inject(StorageService);

  private _user = signal<StoreUser>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    isAutehnticated: false,
  });

  readonly state = computed(() => this._user);

  constructor() {
    const userDataLocal = this._storage.get<StoreUser>('user');
    const token = this._storage.get<string>('session');

    if (userDataLocal && token) {
      this.setUser({
        id: userDataLocal.id,
        firstName: userDataLocal.firstName,
        lastName: userDataLocal.lastName,
        email: userDataLocal.email,
        isAutehnticated: true,
      });
    }
  }

  setUser(user: StoreUser): void {
    this._user.set(user);
  }

  getUser(): StoreUser {
    return this._user();
  }

  isAuthenticated(): boolean {
    const token = this._storage.get<string>('session');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;

    if (Date.now() >= exp * 1000) {
      this.clearUser();
      return false;
    }

    return true;
  }

  logout(): void {
    this._storage.remove('session');
    this._storage.remove('user');
    this.clearUser();
  }

  clearUser(): void {
    this._user.set({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      isAutehnticated: false,
    });
  }
}
