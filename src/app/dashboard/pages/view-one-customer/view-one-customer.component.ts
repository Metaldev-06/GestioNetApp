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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { TUI_CONFIRM, TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiAlertService, TuiDataList, TuiDialogService } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/legacy';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/interfaces/customers-response.interface';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionDateResponse } from '../../../core/interfaces/transaction-date-response.interface';
import { MonthNamePipe } from '../../../shared/pipes/month-name.pipe';
import { Transaction } from '../../../core/interfaces/transaction-by-month';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';

@Component({
  selector: 'app-view-one-customer',
  imports: [
    CurrencyPipe,
    MonthNamePipe,
    DatePipe,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataList,
    TuiDataListWrapper,
    InfiniteScrollDirective,
    CustomerInfoComponent,
  ],
  templateUrl: './view-one-customer.component.html',
  styleUrl: './view-one-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewOneCustomerComponent implements OnInit {
  @Input() private id: string = '';

  private limit = signal(12);
  private offset = signal(0);
  private isLoading = signal(false);
  private selectedMonth = signal<number>(0);
  private selectedYear = signal<number>(new Date().getFullYear());
  private hasMoreTransactions = signal(true);

  private readonly currentYear = new Date().getFullYear();

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
  public yearFilter = signal<number[]>([]);

  selectForm = new FormGroup({
    selectValue: new FormControl(this.currentYear),
  });

  ngOnInit(): void {
    this.getCustomerById(this.id);

    this.selectForm
      .get('selectValue')
      ?.valueChanges.subscribe((selectedYear) => {
        if (selectedYear) {
          this.selectedYear.set(selectedYear);
          this.transactions.set([]);
          this.offset.set(0);
          this.hasMoreTransactions.set(true);
          this.getTransactionsByAccountId(
            this.customer().account.id,
            selectedYear,
          );
        }
      });
  }

  public onScroll() {
    if (
      !this.isLoading() &&
      this.hasMoreTransactions() &&
      this.selectedMonth()
    ) {
      this.offset.update((value) => value + this.limit());
      this.getTransactionsByMonth(
        this.customer().account.id,
        this.selectedYear(),
        this.selectedMonth(),
      );
    }
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
    this.selectedYear.set(year);
    this.selectedMonth.set(month);
    this.offset.set(0);
    this.getTransactionsByMonth(this.customer().account.id, year, month, true);
  }

  private getCustomerById(id: string): void {
    this.customerService
      .getCustomerById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((customer) => {
        this.customer.set(customer);
        this.getTransactionsByYear(customer.account.id);
        this.getTransactionsByAccountId(customer.account.id, this.currentYear);
      });
  }

  private getTransactionsByYear(id: string): void {
    this.transactionService
      .getTransactionsByYear(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.yearFilter.set(response),
        error: (error) => this.handleError(error),
      });
  }

  private deleteCustomerById(id: string): void {
    this.customerService
      .deleteCustomer(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/view-customers']),
        error: (error) => this.handleError(error),
      });
  }

  private getTransactionsByAccountId(id: string, year: number): void {
    this.transactionService
      .getTransactionsByAccountId(id, year)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.transactionsDate.set(response),
        error: (error) => this.handleError(error),
      });
  }

  private getTransactionsByMonth(
    id: string,
    year: number,
    month: number,
    isSelect = false,
  ): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    const filters = {
      limit: this.limit(),
      offset: this.offset(),
    };

    this.transactionService
      .getTransactionsByMonth(id, year, month, filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (isSelect) {
            this.selectedMonth.set(month);
            this.selectedYear.set(year);
            this.offset.set(0);
            this.transactions.set(response.transactions);
            this.isLoading.set(false);
            this.hasMoreTransactions.set(true);
            return;
          }

          if (response.transactions.length < this.limit()) {
            this.hasMoreTransactions.set(false);
          }
          this.transactions.set([
            ...this.transactions(),
            ...response.transactions,
          ]);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.handleError(error);
          this.isLoading.set(false);
        },
      });
  }

  private handleError(error: HttpErrorResponse): void {
    this.alerts
      .open(`${error.error?.message || 'Error desconocido'}`, {
        label: `${error.error?.error || 'Error'}`,
        appearance: 'error',
        closeable: true,
        autoClose: 0,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    console.error(error);
  }
}
