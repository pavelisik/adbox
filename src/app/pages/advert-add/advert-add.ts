import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
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
import { CookieService } from 'ngx-cookie-service';
import { debounceTime, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface AdvertAddForm {
    category: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    address: FormControl<string>;
    price: FormControl<string>;
    phone: FormControl<string>;
    email: FormControl<string>;
}

const COOKIE_KEY = 'newAdvertDraft';

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
    private readonly cookieService = inject(CookieService);

    readonly categories = this.categoryFacade.allCategories;

    // только при помощи any[] решается баг с типизацией options в p-cascadeselect
    readonly categoriesForSelect: Signal<any[]> = this.categories;

    formSuccess = signal<string | null>(null);
    formError = signal<string | null>(null);
    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);

    advertAddForm: FormGroup<AdvertAddForm> = this.fb.nonNullable.group({
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
        const { title, address, price, phone } = this.advertAddForm.value;
        return !!title && !!address && !!price && !!phone;
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.advertAddForm.get(controlName);
        return !!(control?.errors && this.isSubmitted());
    }

    private formatPhone(phone: string): string {
        const digits = phone.replace(/[ ()]/g, '');
        return digits;
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.advertAddForm.markAllAsTouched();

        if (this.advertAddForm.invalid) return;

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

        this.formError.set(null);
        this.formSuccess.set(null);
        this.isLoading.set(true);

        this.advertService.newAdvert(request).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.formSuccess.set('Объявление успешно создано');
                this.cookieService.delete(COOKIE_KEY, '/');

                setTimeout(() => {
                    this.router.navigate(['/advert/', res.id]);
                }, 1000);
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

    // восстановление данных из cookies
    private patchDraft() {
        const draft = this.cookieService.get(COOKIE_KEY);
        if (draft) {
            this.advertAddForm.patchValue(JSON.parse(draft));
        }
    }

    // сохраняем изменения формы в cookie
    private saveDraft() {
        if (this.advertAddForm.dirty) {
            const values = this.advertAddForm.getRawValue();
            this.cookieService.set(COOKIE_KEY, JSON.stringify(values), { path: '/' });
        }
    }

    constructor() {
        this.patchDraft();
        this.advertAddForm.valueChanges
            .pipe(debounceTime(2000), takeUntilDestroyed())
            .subscribe(() => this.saveDraft());
    }
}
