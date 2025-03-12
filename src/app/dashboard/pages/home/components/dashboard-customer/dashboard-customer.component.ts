import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Customer } from '../../../../../core/interfaces/customers-response.interface';

@Component({
  selector: 'app-dashboard-customer',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './dashboard-customer.component.html',
  styleUrl: './dashboard-customer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCustomerComponent {
  public customers = input<Customer[]>([]);
}
