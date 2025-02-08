import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import {
  Customer,
  CustomerResponse,
} from '../../../core/interfaces/customers-response.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-one-customer',
  imports: [CurrencyPipe],
  templateUrl: './view-one-customer.component.html',
  styleUrl: './view-one-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ViewOneCustomerComponent implements OnInit {
  @Input() private id: string = '';

  private readonly customerService = inject(CustomerService);

  public customer = signal<Customer>({} as Customer);

  ngOnInit(): void {
    this.getCustomerById(this.id);
  }

  private getCustomerById(id: string): void {
    this.customerService.getCustomerById(id).subscribe((customer) => {
      this.customer.set(customer);
    });
  }
}
