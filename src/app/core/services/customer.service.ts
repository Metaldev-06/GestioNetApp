import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateCustomerBody } from '../interfaces/create-customer.interface';
import {
  Customer,
  CustomerResponse,
} from '../interfaces/customers-response.interface';
import { ParamsFilter } from '../interfaces/params-filter.interface';
import { CustomerSanitized } from '../interfaces/customer-sanitized.interface';
import { CustomersSummaryResponse } from '../interfaces/customer-summary.interface';

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

  public getAllCustomers(
    paramsFilter?: ParamsFilter,
  ): Observable<CustomerResponse> {
    const {
      limit = 10,
      offset = 0,
      sort = 'name',
      order,
      term,
    } = paramsFilter || {};

    let params = new HttpParams().set('limit', limit).set('offset', offset);

    if (sort) params = params.set('sort', sort);
    if (order) params = params.set('order', order);
    if (term) params = params.set('term', term);

    return this.http.get<CustomerResponse>(`${this.apiUrl}/customers`, {
      params,
    });
  }

  public getCustomerSanitized(): Observable<CustomerSanitized[]> {
    return this.http.get<CustomerSanitized[]>(
      `${this.apiUrl}/customers/sanitized`,
    );
  }

  public getCustomerSummary(): Observable<CustomersSummaryResponse> {
    return this.http.get<CustomersSummaryResponse>(
      `${this.apiUrl}/customers/summary`,
    );
  }

  public getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`);
  }

  public deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/customers/${id}`);
  }
}
