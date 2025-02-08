import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TransactionDateResponse } from '../interfaces/transaction-date-response.interface';
import { TransactionsByMonthResponse } from '../interfaces/transaction-by-month';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly apiUrl = environment.API_URL;
  private readonly http = inject(HttpClient);

  public getTransactionsByAccountId(
    id: string,
    year: number,
  ): Observable<TransactionDateResponse> {
    const params = new HttpParams().set('year', year);

    return this.http.get<TransactionDateResponse>(
      `${this.apiUrl}/transactions/by-date/${id}`,
      { params },
    );
  }

  public getTransactionsByMonth(
    id: string,
    year: number,
    month: number,
    page: number = 0,
    limit: number = 10,
  ): Observable<TransactionsByMonthResponse> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<TransactionsByMonthResponse>(
      `${this.apiUrl}/transactions/by-month/${id}`,
      { params },
    );
  }
}
