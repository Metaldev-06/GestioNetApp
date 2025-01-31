import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage = localStorage;

  get<T>(key: string): T | null {
    const value = this._storage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  }

  set(key: string, value: unknown): void {
    this._storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this._storage.removeItem(key);
  }
}
