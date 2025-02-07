import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const noRepeatValidator = (lastValue: string | null): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentValue = control.value;
    console.log(lastValue, currentValue);

    if (lastValue && currentValue === lastValue) {
      return { repeatValue: true }; // Error de valor repetido
    }

    return null; // No hay error
  };
};
