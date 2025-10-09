import { FormControl } from '@angular/forms';

export interface AdvertAddForm {
    category: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    address: FormControl<string>;
    price: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
}
