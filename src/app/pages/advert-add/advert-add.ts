import { Component, effect, inject, Signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CategoryFacade } from '@app/shared/services';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { InputNumberModule } from 'primeng/inputnumber';

interface advertAddForm {
    category: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    address: FormControl<string>;
    price: FormControl<string>;
}

@Component({
    selector: 'app-advert-add',
    imports: [
        ReactiveFormsModule,
        CascadeSelectModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        InputNumberModule,
        SvgIcon,
    ],
    templateUrl: './advert-add.html',
    styleUrl: './advert-add.scss',
})
export class AdvertAdd {
    private readonly categoryFacade = inject(CategoryFacade);
    private readonly fb = inject(FormBuilder);

    readonly categories = this.categoryFacade.allCategories;

    // только при помощи any[] решается баг с типизацией options в p-cascadeselect
    readonly categoriesForSelect: Signal<any[]> = this.categories;

    advertAddForm: FormGroup<advertAddForm> = this.fb.nonNullable.group({
        category: ['', Validators.required],
        title: ['', Validators.required],
        description: [''],
        address: ['', Validators.required],
        price: [''],
    });

    onSubmit() {
        console.log(this.advertAddForm.getRawValue());
    }

    constructor() {
        effect(() => {
            const categories = this.categories();
            console.log(categories);
        });
    }
}
