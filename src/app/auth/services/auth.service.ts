import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { StorageService } from '../../core/services/storage.service';
import { AuthenticatedUserService } from '../../core/services/authenticated-user.service';
import { LoginData, LoginResponse } from '../interfaces/login.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.API_URL;
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly authenticatedUserService = inject(AuthenticatedUserService);

  login({ password, email }: LoginData): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          const userData = {
            id: response.user.id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            isAutehnticated: true,
          };
          this.authenticatedUserService.setUser(userData);
          this.storage.set('session', response.token);
          this.storage.set('user', userData);
        }),
      );
  }
}
