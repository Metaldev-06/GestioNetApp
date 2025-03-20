import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Customer } from '../../../../../core/interfaces/customers-response.interface';
import { TuiAlertService, TuiError } from '@taiga-ui/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModifyBalanceService } from '../../../../../core/services/modify-balance.service';
import { TransactionsType } from '../../../../../core/enums/transactions-type.enum';
import { ModifyBalanceBody } from '../../../../../core/interfaces/modify-balance.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import {
  TuiInputModule,
  TuiInputNumberModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';

@Component({
  selector: 'app-form-balance',
  imports: [
    AsyncPipe,
    ButtonComponent,
    ReactiveFormsModule,
    TuiCurrencyPipe,
    TuiError,
    TuiFieldErrorPipe,
    TuiInputModule,
    TuiInputNumberModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './form-balance.component.html',
  styleUrl: './form-balance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormBalanceComponent implements OnInit {
  public customer = input<Customer>();
  public type = input<TransactionsType | null>();
  public reloadData = output<void>();

  private readonly alerts = inject(TuiAlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly modifyBalanceService = inject(ModifyBalanceService);

  public customerForm!: FormGroup;

  ngOnInit(): void {
    this.customerForm = this.initLoginForm();
  }

  initLoginForm(): FormGroup {
    return this.formBuilder.group({
      amount: [
        null,
        [Validators.required, Validators.min(1), Validators.max(999999999)],
      ],
      description: ['', []],
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const formData = this.customerForm.getRawValue();

    const balance = {
      amount: Number(formData.amount),
      accountId: this.customer()!.account.id,
      description: formData.description || null,
    };

    if (this.type() === TransactionsType.DEBIT) {
      this.reduceBalance(balance);
      return;
    }

    this.addBalance(balance);
    this.customerForm.reset();
  }

  addBalance(modifyBalance: ModifyBalanceBody): void {
    this.modifyBalanceService.addBalance(modifyBalance).subscribe({
      next: () => {
        this.successAlert('Balance agregado', 'Balance agregado con éxito');
        this.reloadData.emit();
      },
      error: (error) => this.errorAlert(error),
    });
  }

  reduceBalance(modifyBalance: ModifyBalanceBody): void {
    this.modifyBalanceService.reduceBalance(modifyBalance).subscribe({
      next: () => {
        this.successAlert('Balance reducido', 'Balance reducido con éxito');
        this.reloadData.emit();
      },
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
