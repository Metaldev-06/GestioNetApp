import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { StoreUser } from '../interfaces/store-user.interface';

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
