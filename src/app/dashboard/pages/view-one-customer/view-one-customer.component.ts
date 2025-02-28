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

import { TUI_CONFIRM, TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiAlertService, TuiDataList, TuiDialogService } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/legacy';

import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/interfaces/customers-response.interface';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionDateResponse } from '../../../core/interfaces/transaction-date-response.interface';
import { MonthNamePipe } from '../../../shared/pipes/month-name.pipe';
import { Transaction } from '../../../core/interfaces/transaction-by-month';
import { HttpErrorResponse } from '@angular/common/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

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
  ],
  templateUrl: './view-one-customer.component.html',
  styleUrl: './view-one-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewOneCustomerComponent implements OnInit {
  @Input() private id: string = '';

  // Variables para la paginación
  private limit = signal(10);
  private offset = signal(0);
  private isLoading = signal(false); // Evita múltiples llamadas simultáneas
  private hasMoreTransactions = signal(true); // Controla si hay más datos por cargar

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
          this.getTransactionsByAccountId(
            this.customer().account.id,
            selectedYear,
          );
        }
      });
  }

  public onScroll() {
    if (!this.isLoading() && this.hasMoreTransactions()) {
      console.log('Cargando más clientes...');
      this.offset.update((value) => (value += this.limit()));
      // this.getAllCustomers();
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
    this.getTransactionsByMonth(this.customer().account.id, year, month);
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

  // ! Este es el que debo editar
  private getTransactionsByMonth(
    id: string,
    year: number,
    month: number,
  ): void {
    this.transactionService
      .getTransactionsByMonth(id, year, month)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.transactions.set(response.transactions),
        error: (error) => this.handleError(error),
      });
  }
  // !

  private handleError(error: HttpErrorResponse): void {
    this.alerts
      .open(`${error.error?.message || 'Error desconocido'}`, {
        // Manejo de mensaje de error opcional
        label: `${error.error?.error || 'Error'}`, // Manejo de título de error opcional
        appearance: 'error',
        closeable: true,
        autoClose: 0,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    console.error(error);
  }
}
