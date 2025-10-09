import { FormControl } from '@angular/forms';

export interface SettingsChangeForm {
    name: FormControl<string>;
    login: FormControl<string>;
    address: FormControl<string>;
}
