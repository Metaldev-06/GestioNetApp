import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TuiAlertService, TuiError } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'Este campo es requerido',
      email: 'Ingrese un email válido',
      pattern:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número',
    }),
  ],
})
export default class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);
  private readonly router = inject(Router);

  public loginForm!: FormGroup;
  public typeInput = signal<string>('password');

  ngOnInit(): void {
    this.loginForm = this.initLoginForm();
  }

  initLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
          ),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.login(this.loginForm.getRawValue());
  }

  login(loginData: any): void {
    this.authService
      .login(loginData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loginForm.reset();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.alerts
            .open(`${error.error.message}`, {
              label: `${error.error.error}`,
              appearance: 'error',
              closeable: true,
              autoClose: 0,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
          console.log(error);
        },
      });
  }

  changeTypePassword() {
    this.typeInput.update((prev) =>
      prev === 'password' ? 'text' : 'password',
    );
  }
}
