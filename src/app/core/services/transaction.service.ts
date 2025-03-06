import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TransactionDateResponse } from '../interfaces/transaction-date-response.interface';
import { TransactionsByMonthResponse } from '../interfaces/transaction-by-month';
import { ParamsFilter } from '../interfaces/params-filter.interface';

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
    paramsFilter?: ParamsFilter,
  ): Observable<TransactionsByMonthResponse> {
    const { limit = 15, offset = 0, order, sort, term } = paramsFilter || {};

    const params = new HttpParams()
      .set('year', year)
      .set('month', month)
      .set('page', offset)
      .set('limit', limit);

    return this.http.get<TransactionsByMonthResponse>(
      `${this.apiUrl}/transactions/by-month/${id}`,
      { params },
    );
  }

  public getTransactionsByYear(id: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/transactions/by-year/${id}`);
  }
}
