import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Customer } from '../../../core/interfaces/customers-response.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
  public customers = signal<Customer[]>([]);

  private readonly customerService = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getCustomers();
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
}
