import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BalanceFormComponent } from '../../../shared/components/balance-form/balance-form.component';
import { CustomerService } from '../../../core/services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-balance',
  imports: [BalanceFormComponent],
  templateUrl: './modify-balance.component.html',
  styleUrl: './modify-balance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModifyBalanceComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  ngOnInit(): void {
    this.getAllCustomers();
  }

  private getAllCustomers() {
    this.customerService.getAllCustomers().subscribe((response) => {
      console.log(response);
    });
  }
}
