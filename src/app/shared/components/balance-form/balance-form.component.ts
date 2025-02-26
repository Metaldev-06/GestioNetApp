import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-balance-form',
  imports: [
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiInputModule,
  ],
  templateUrl: './balance-form.component.html',
  styleUrl: './balance-form.component.css',
})
export class BalanceFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  public customerForm!: FormGroup;

  ngOnInit(): void {
    this.customerForm = this.initLoginForm();
  }

  initLoginForm(): FormGroup {
    return this.formBuilder.group({
      amount: ['', [Validators.required]],
      type: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      description: ['', []],
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    //this.createCustomer(this.customerForm.getRawValue());

    console.log(this.customerForm.getRawValue());
  }
}
