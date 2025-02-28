import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BalanceFormComponent } from '../../../shared/components/balance-form/balance-form.component';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerSanitized } from '../../../core/interfaces/customer-sanitized.interface';

@Component({
  selector: 'app-modify-balance',
  imports: [BalanceFormComponent],
  templateUrl: './modify-balance.component.html',
  styleUrl: './modify-balance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModifyBalanceComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  public customers = signal<CustomerSanitized[]>([]);

  ngOnInit(): void {
    this.getAllCustomers();
  }

  private getAllCustomers() {
    this.customerService.getCustomerSanitized().subscribe((response) => {
      this.customers.set(response);
    });
  }
}
