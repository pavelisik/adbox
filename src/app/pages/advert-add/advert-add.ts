import { Component, effect, inject, signal, Signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AdvertService, CategoryFacade } from '@app/shared/services';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SvgIcon } from '@app/shared/components';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { ControlError } from '@app/shared/components/forms';
import { MessageModule } from 'primeng/message';
import { NewAdvertRequest } from '@app/pages/adverts-list/domains';
import { Router } from '@angular/router';

interface advertAddForm {
    category: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    address: FormControl<string>;
    price: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
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
        InputMaskModule,
        SvgIcon,
        ControlError,
        MessageModule,
    ],
    templateUrl: './advert-add.html',
    styleUrl: './advert-add.scss',
})
export class AdvertAdd {
    private readonly categoryFacade = inject(CategoryFacade);
    private readonly advertService = inject(AdvertService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    readonly categories = this.categoryFacade.allCategories;

    // только при помощи any[] решается баг с типизацией options в p-cascadeselect
    readonly categoriesForSelect: Signal<any[]> = this.categories;

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    formError = signal<string>('');

    advertAddForm: FormGroup<advertAddForm> = this.fb.nonNullable.group({
        category: ['', Validators.required],
        title: [
            '',
            {
                validators: [Validators.required, Validators.maxLength(100)],
            },
        ],
        description: ['', Validators.maxLength(250)],
        address: [
            '',
            {
                validators: [Validators.required, Validators.maxLength(100)],
            },
        ],
        price: [
            '',
            {
                validators: [Validators.required, Validators.max(1000000000)],
            },
        ],
        phone: ['', Validators.required],
        email: [
            '',
            {
                validators: [Validators.email, Validators.maxLength(50)],
            },
        ],
    });

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { category, title, address, price, phone } = this.advertAddForm.value;
        return !!category && !!title && !!address && !!price && !!phone;
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.advertAddForm.get(controlName);
        return !!(control?.errors && this.isSubmitted());
    }

    private formatPhone(phone: string): string {
        const digits = phone.replace(/\D/g, '');
        return '+' + digits;
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.advertAddForm.markAllAsTouched();

        if (this.advertAddForm.invalid) return;

        this.isLoading.set(true);
        this.formError.set('');

        const { title, description, price, email, phone, address, category } =
            this.advertAddForm.getRawValue();

        const request: NewAdvertRequest = {
            title,
            description: description || undefined,
            cost: Number(price),
            email: email || undefined,
            phone: this.formatPhone(phone),
            location: address,
            category,
        };

        this.advertService.newAdvert(request).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                console.log('Объявление добавлено');
                this.router.navigate(['/advert/', res.id]);
            },
            error: (error) => {
                this.isLoading.set(false);
                switch (error.status) {
                    case 400:
                        this.formError.set('Ошибка создания объявления. Попробуйте снова');
                        break;
                    case 500:
                        this.formError.set('Ошибка сервера. Попробуйте позже');
                        break;
                    default:
                        this.formError.set('Произошла ошибка. Попробуйте позже');
                        break;
                }
            },
        });
    }
}
