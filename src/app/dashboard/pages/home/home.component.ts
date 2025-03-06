import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Customer } from '../../../core/interfaces/customers-response.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomersSummaryResponse } from '../../../core/interfaces/customer-summary.interface';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
  public customers = signal<Customer[]>([]);
  public customerSummary = signal<CustomersSummaryResponse>(
    {} as CustomersSummaryResponse,
  );

  private readonly customerService = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getCustomers();
    this.getCustomerSummary();
  }

  getCustomers() {
    this.customerService
      .getAllCustomers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customers) => {
          this.customers.set(customers.data);
        },
        error: (error) => {},
      });
  }

  getCustomerSummary() {
    this.customerService
      .getCustomerSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (summary) => {
          console.log(summary);
          this.customerSummary.set(summary);
        },
        error: (error) => {},
      });
  }
}
