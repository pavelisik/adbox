import { ValidationErrors, FormControl } from '@angular/forms';

export function passwordsMatchValidator(
    password: FormControl<string>,
    confirmPassword: FormControl<string>,
) {
    return (): ValidationErrors | null => {
        if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ mismatch: true });
        } else if (confirmPassword.hasError('mismatch')) {
            confirmPassword.setErrors(null);
        }

        return null;
    };
}
