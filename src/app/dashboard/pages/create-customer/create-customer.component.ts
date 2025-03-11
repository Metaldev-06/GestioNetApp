import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiAlertService, TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { CustomerService } from '../../../core/services/customer.service';
import { CreateCustomerBody } from '../../../core/interfaces/create-customer.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-customer',
  imports: [
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiInputModule,
  ],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'Este campo es requerido',
      email: 'Ingrese un email válido',
    }),
  ],
})
export default class CreateCustomerComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);
  private readonly customerService = inject(CustomerService);

  public customerForm!: FormGroup;

  ngOnInit(): void {
    this.customerForm = this.initLoginForm();
  }

  initLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.email]],
      name: ['', [Validators.required]],
      dni: ['', []],
      address: ['', []],
      city: ['', []],
      phone: ['', []],
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    this.createCustomer(this.customerForm.getRawValue());
    this.customerForm.reset();
  }

  createCustomer(customer: CreateCustomerBody): void {
    this.customerService.createCustomer(customer).subscribe({
      next: () => {
        this.alerts
          .open('Cliente creado', {
            label: `Cliente creado con éxito`,
            appearance: 'positive',
            closeable: true,
            autoClose: 5000,
          })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
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
}
