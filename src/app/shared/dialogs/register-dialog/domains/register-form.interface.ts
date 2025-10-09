import { FormControl } from '@angular/forms';

export interface RegisterForm {
    login: FormControl<string>;
    name: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}
