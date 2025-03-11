import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Customer } from '../../../../../core/interfaces/customers-response.interface';

@Component({
  selector: 'app-customer-info',
  imports: [CurrencyPipe],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerInfoComponent {
  public customer = input.required<Customer>();
}
