import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Customer } from '../../../core/interfaces/customers-response.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TuiAlertService } from '@taiga-ui/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { noSpaceValidator } from '../../../core/helpers/noSpaceValidator.helper';
import { ParamsFilter } from '../../../core/interfaces/params-filter.interface';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly alerts = inject(TuiAlertService);

  // Variables para la paginación
  private limit = signal(10);
  private offset = signal(0);
  private isLoading = signal(false); // Evita múltiples llamadas simultáneas
  private hasMoreCustomers = signal(true); // Controla si hay más datos por cargar

  ngOnInit(): void {
    this.searchForm = this.initSearchForm();
    this.getAllCustomers();
  }

  public onScroll() {
    if (!this.isLoading() && this.hasMoreCustomers()) {
      console.log('Cargando más clientes...');
      this.offset.update((value) => (value += this.limit()));
      this.getAllCustomers();
    }

    console.log('No hay más clientes por cargar');
  }

  public resetFilters(): void {
    this.searchForm.reset();
    this.offset.set(0);
    this.hasMoreCustomers.set(true);
    this.getAllCustomers();
  }

  private getAllCustomers(paramsFilter?: ParamsFilter): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    const filters: ParamsFilter = {
      limit: this.limit(),
      offset: this.offset(),
      ...paramsFilter,
    };

    this.customerService
      .getAllCustomers(filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.pagination.total < this.limit()) {
            this.hasMoreCustomers.set(false);
          }
          this.customers.set([...this.customers(), ...response.data]);
          this.isLoading.set(false);

          console.log('Clientes cargados:', this.customers());
        },
        error: (error) => {
          this.isLoading.set(false);
          this.alerts
            .open(`${error.error.message}`, {
              label: `${error.error.error}`,
              appearance: 'error',
              closeable: true,
              autoClose: 0,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
          console.log(error);
        },
      });
  }

  private initSearchForm(): FormGroup {
    return this.formBuilder.group({
      term: ['', [Validators.required, noSpaceValidator]],
    });
  }

  onSubmit(): void {
    if (this.searchForm.invalid) return;

    const term = this.searchForm.getRawValue().term.trim();
    this.lastSearchTerm.set(term);

    this.offset.set(0);
    this.hasMoreCustomers.set(true);
    this.getAllCustomers({ term });
  }
}
