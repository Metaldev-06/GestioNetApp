import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CustomersSummaryResponse } from '../../../../../core/interfaces/customer-summary.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-info',
  imports: [CurrencyPipe],
  templateUrl: './dashboard-info.component.html',
  styleUrl: './dashboard-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardInfoComponent {
  public customerSummary = input<CustomersSummaryResponse | null>(
    {} as CustomersSummaryResponse,
  );
}
