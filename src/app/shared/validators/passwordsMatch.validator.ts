import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
    passwordKey: string,
    confirmPasswordKey: string,
): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const password = group.get(passwordKey);
        const confirmPassword = group.get(confirmPasswordKey);

        if (!password || !confirmPassword) {
            return null;
        }

        const mismatch = password.value !== confirmPassword.value;
        const errors = confirmPassword.errors || {};

        if (mismatch) {
            confirmPassword.setErrors({ ...errors, mismatch: true });
        } else if ('mismatch' in errors) {
            delete errors['mismatch'];
            confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
        }

        return mismatch ? { mismatch: true } : null;
    };
}
