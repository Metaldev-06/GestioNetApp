import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateCustomerBody } from '../interfaces/create-customer.interface';
import { Observable } from 'rxjs';
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
}
