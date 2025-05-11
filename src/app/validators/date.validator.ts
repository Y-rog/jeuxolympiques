import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateInFutureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Si la valeur est vide, on ne valide pas
    }

    const today = new Date();
    const selectedDate = new Date(control.value);

    // Si la date sélectionnée est avant aujourd'hui, on renvoie une erreur
    return selectedDate <= today ? { 'dateInPast': { value: control.value } } : null;
  };
}

