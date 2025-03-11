import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnChanges,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { TuiAlertService, TuiDataList, TuiError } from '@taiga-ui/core';
import {
  TuiDataListWrapper,
  TuiFieldErrorPipe,
  tuiValidationErrorsProvider,
} from '@taiga-ui/kit';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';

import { CustomerSanitized } from '../../../core/interfaces/customer-sanitized.interface';
import { ModifyBalanceService } from '../../../core/services/modify-balance.service';
import { TransactionsType } from '../../../core/enums/transactions-type.enum';
import { ModifyBalanceBody } from '../../../core/interfaces/modify-balance.interface';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-balance-form',
  imports: [
    AsyncPipe,
    ButtonComponent,
    ReactiveFormsModule,
    TuiCurrencyPipe,
    TuiDataList,
    TuiDataListWrapper,
    TuiError,
    TuiFieldErrorPipe,
    TuiInputModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './balance-form.component.html',
  styleUrl: './balance-form.component.css',
  providers: [
    tuiValidationErrorsProvider({
      required: 'Este campo es requerido',
      min: 'El monto debe ser mayor a 0',
      max: 'El monto debe ser menor a 999.999.999',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceFormComponent implements OnInit, OnChanges {
  private readonly alerts = inject(TuiAlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly modifyBalanceService = inject(ModifyBalanceService);

  public customerForm!: FormGroup;
  public customers = input.required<CustomerSanitized[]>();
  public type = signal<any[]>([
    { label: 'Crédito', value: TransactionsType.CREDIT },
    { label: 'Débito', value: TransactionsType.DEBIT },
  ]);

  ngOnInit(): void {
    this.customerForm = this.initLoginForm();
  }

  ngOnChanges(): void {
    // console.log(this.customers());
  }

  initLoginForm(): FormGroup {
    return this.formBuilder.group({
      amount: [
        null,
        [Validators.required, Validators.min(1), Validators.max(999999999)],
      ],
      type: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      description: ['', []],
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const formData = this.customerForm.getRawValue();
    const type = formData.type.value;
    const balance = {
      amount: Number(formData.amount),
      accountId: formData.customer.accountId,
      description: formData.description || null,
    };

    if (type === TransactionsType.DEBIT) {
      return this.reduceBalance(balance);
    }

    this.addBalance(balance);
    this.customerForm.reset();
  }

  addBalance(modifyBalance: ModifyBalanceBody): void {
    this.modifyBalanceService.addBalance(modifyBalance).subscribe({
      next: () =>
        this.successAlert('Balance agregado', 'Balance agregado con éxito'),
      error: (error) => this.errorAlert(error),
    });
  }

  reduceBalance(modifyBalance: ModifyBalanceBody): void {
    this.modifyBalanceService.reduceBalance(modifyBalance).subscribe({
      next: () =>
        this.successAlert('Balance reducido', 'Balance reducido con éxito'),
      error: (error) => this.errorAlert(error),
    });
  }

  successAlert(label: string, title: string): void {
    this.alerts
      .open(title, {
        label,
        appearance: 'positive',
        closeable: true,
        autoClose: 5000,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  errorAlert(error: any): void {
    this.alerts
      .open(`${error.error.message}`, {
        label: `${error.error.error}`,
        appearance: 'error',
        closeable: true,
        autoClose: 0,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
