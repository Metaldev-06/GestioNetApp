import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { map } from 'rxjs';

import { CustomerService } from '../../../core/services/customer.service';
import { DashboardInfoComponent } from './components/dashboard-info/dashboard-info.component';
import { DashboardCustomerComponent } from './components/dashboard-customer/dashboard-customer.component';

@Component({
  selector: 'app-home',
  imports: [DashboardInfoComponent, DashboardCustomerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  private readonly customerService = inject(CustomerService);

  public customers = rxResource({
    loader: () =>
      this.customerService
        .getAllCustomers()
        .pipe(map((customers) => customers.data)),
  });

  public customerSummary = rxResource({
    loader: () => this.customerService.getCustomerSummary(),
  });
}
