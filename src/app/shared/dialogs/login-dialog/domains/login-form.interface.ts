import { FormControl } from '@angular/forms';

export interface LoginForm {
    login: FormControl<string>;
    password: FormControl<string>;
    rememberMe: FormControl<boolean>;
}
