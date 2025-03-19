import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Customer } from '../../../core/interfaces/customers-response.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { noSpaceValidator } from '../../../core/helpers/noSpaceValidator.helper';
import { map } from 'rxjs';

@Component({
  selector: 'app-view-customer',
  imports: [ReactiveFormsModule, RouterLink, InfiniteScrollDirective],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.css',
})
export default class ViewCustomerComponent implements OnInit {
  public customers = signal<Customer[]>([]);
  public lastSearchTerm = signal<string>('');
  public searchForm!: FormGroup;

  private readonly customerService = inject(CustomerService);
  private readonly formBuilder = inject(FormBuilder);

  private limit = signal(10);
  private offset = signal(0);
  private isLoading = signal(false);
  private hasMoreCustomers = signal(true);
  private isSearching = signal(false);

  public customersRx = rxResource({
    request: () => ({
      limit: this.limit(),
      offset: this.offset(),
      term: this.lastSearchTerm(),
    }),
    loader: ({ request }) => {
      this.isLoading.set(true);
      return this.customerService.getAllCustomers(request).pipe(
        map((customers) => {
          if (this.isSearching()) {
            this.customers.set(customers.data);
            this.isSearching.set(false);
            this.isLoading.set(false);
            return customers.data;
          }

          if (customers.pagination.total < this.limit()) {
            this.hasMoreCustomers.set(false);
          } else {
            this.hasMoreCustomers.set(true);
          }

          this.isLoading.set(false);
          this.customers.set([...this.customers(), ...customers.data]);

          return [...this.customers(), ...customers.data];
        }),
      );
    },
  });

  ngOnInit(): void {
    this.searchForm = this.initSearchForm();
  }

  public onScroll() {
    if (!this.isLoading() && this.hasMoreCustomers()) {
      this.offset.update((value) => (value += this.limit()));
    }
  }

  public resetFilters(): void {
    this.searchForm.reset();
    this.offset.set(0);
    this.hasMoreCustomers.set(true);
    this.customersRx.set([]);
    this.lastSearchTerm.set('');
  }

  private initSearchForm(): FormGroup {
    return this.formBuilder.group({
      term: ['', [Validators.required, noSpaceValidator]],
    });
  }

  onSubmit(): void {
    if (this.searchForm.invalid) return;
    this.isSearching.set(true);

    const term = this.searchForm.getRawValue().term.trim();
    this.lastSearchTerm.set(term);

    this.offset.set(0);
    this.hasMoreCustomers.set(true);
  }
}
