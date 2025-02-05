import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Customer } from '../../../core/interfaces/customers-response.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-customer',
  imports: [ReactiveFormsModule],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.css',
})
export default class ViewCustomerComponent implements OnInit {
  public customers = signal<Customer[]>([]);
  public searchForm!: FormGroup;

  private readonly customerService = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.getAllCustomers();
    this.searchForm = this.initSearchForm();
  }

  private getAllCustomers(): void {
    this.customerService
      .getAllCustomers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((customers) => {
        this.customers.set(customers.data);
      });
  }

  private initSearchForm(): FormGroup {
    return this.formBuilder.group({
      search: [''],
    });
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }

    console.log(this.searchForm.getRawValue());
    //this.login(this.searchForm.getRawValue());
  }
}
