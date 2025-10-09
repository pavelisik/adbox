import { FormControl } from '@angular/forms';

export interface PasswordChangeForm {
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}
