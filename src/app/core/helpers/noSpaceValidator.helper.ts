import { AbstractControl, ValidationErrors } from '@angular/forms';

export const noSpaceValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value as string;

  if (value?.trim().length === 0) {
    return { noOnlySpaces: true };
  }
  return null;
};
