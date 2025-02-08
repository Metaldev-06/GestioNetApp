import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TUI_CONFIRM } from '@taiga-ui/kit';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/interfaces/customers-response.interface';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionDateResponse } from '../../../core/interfaces/transaction-date-response.interface';
import { MonthNamePipe } from '../../../shared/pipes/month-name.pipe';
import { Transaction } from '../../../core/interfaces/transaction-by-month';

@Component({
  selector: 'app-view-one-customer',
  imports: [CurrencyPipe, MonthNamePipe, DatePipe, NgClass],
  templateUrl: './view-one-customer.component.html',
  styleUrl: './view-one-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewOneCustomerComponent implements OnInit {
  @Input() private id: string = '';

  private readonly customerService = inject(CustomerService);
  private readonly transactionService = inject(TransactionService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);

  public customer = signal<Customer>({} as Customer);
  public transactionsDate = signal<TransactionDateResponse>(
    {} as TransactionDateResponse,
  );
  public transactions = signal<Transaction[]>([]);

  ngOnInit(): void {
    this.getCustomerById(this.id);
  }

  public deleteCustomer(id: string): void {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: '¿Estás seguro de que quieres eliminar este cliente?',
        data: {
          content: 'Esta acción no se puede deshacer',
          yes: 'Eliminar',
          no: 'Cancelar',
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response) {
          this.deleteCustomerById(id);
        }
      });
  }

  public selectMonth(month: number, year: number): void {
    this.transactionService
      .getTransactionsByMonth(this.customer().account.id, year, month)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.transactions.set(response.transactions);
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
          console.error(error);
        },
      });
  }

  private getCustomerById(id: string): void {
    this.customerService.getCustomerById(id).subscribe((customer) => {
      this.customer.set(customer);
      this.getTransactionsByAccountId(customer.account.id);
    });
  }

  private deleteCustomerById(id: string): void {
    this.customerService
      .deleteCustomer(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/view-customers']);
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
          console.error(error);
        },
      });
  }

  private getTransactionsByAccountId(id: string): void {
    this.transactionService
      .getTransactionsByAccountId(id, 2025)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.transactionsDate.set(response);
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
          console.error(error);
        },
      });
  }
}
