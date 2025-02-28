import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ModifyBalanceBody,
  ModifyBalanceResponse,
} from '../interfaces/modify-balance.interface';

@Injectable({
  providedIn: 'root',
})
export class ModifyBalanceService {
  private readonly apiUrl = environment.API_URL;
  private readonly http = inject(HttpClient);

  addBalance(
    modifyBalance: ModifyBalanceBody,
  ): Observable<ModifyBalanceResponse> {
    return this.http.post<ModifyBalanceResponse>(
      `${this.apiUrl}/account/balance`,
      modifyBalance,
    );
  }

  reduceBalance(
    modifyBalance: ModifyBalanceBody,
  ): Observable<ModifyBalanceResponse> {
    return this.http.post<ModifyBalanceResponse>(
      `${this.apiUrl}/account/reduce`,
      modifyBalance,
    );
  }
}
