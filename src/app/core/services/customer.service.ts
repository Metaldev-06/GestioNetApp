import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateCustomerBody } from '../interfaces/create-customer.interface';
import { CustomerResponse } from '../interfaces/customers-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = environment.API_URL;
  private readonly http = inject(HttpClient);

  public createCustomer(
    customer: CreateCustomerBody,
  ): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(
      `${this.apiUrl}/customers`,
      customer,
    );
  }

  public getAllCustomers(): Observable<CustomerResponse> {
    const params = new HttpParams().set('limit', '10');

    return this.http.get<CustomerResponse>(`${this.apiUrl}/customers`, {
      params,
    });
  }
}
