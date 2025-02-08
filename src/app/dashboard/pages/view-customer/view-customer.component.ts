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
import { TuiAlertService } from '@taiga-ui/core';
import { noSpaceValidator } from '../../../core/helpers/noSpaceValidator.helper';
import { ParamsFilter } from '../../../core/interfaces/params-filter.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-customer',
  imports: [ReactiveFormsModule, RouterLink],
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

  ngOnInit(): void {
    this.getAllCustomers();
    this.searchForm = this.initSearchForm();
  }

  public resetFilters(): void {
    this.searchForm.reset();
    this.getAllCustomers();
  }

  private getAllCustomers(paramsFilter?: ParamsFilter): void {
    this.customerService
      .getAllCustomers(paramsFilter)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.customers.set(response.data);
        },
        error: (error) => {
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
    if (this.searchForm.invalid) {
      return;
    }

    const term = this.searchForm.getRawValue().term.trim();
    this.lastSearchTerm.set(term);

    this.getAllCustomers({ term });
  }
}
