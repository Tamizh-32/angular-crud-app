import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenNameValidator(forbiddenNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    return forbiddenNames.includes(value) ? { forbiddenName: { value: control.value } } : null;
  };
}
