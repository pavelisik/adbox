import { Component, DestroyRef, inject, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvertDraftStateService, AdvertService, CategoryFacade } from '@app/shared/services';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { ControlError, FormMessage } from '@app/shared/components/forms';
import { NewAdvertRequest } from '@app/pages/adverts-list/domains';
import { Router } from '@angular/router';
import { catchError, debounceTime, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from '@app/core/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagesUpload } from '@app/shared/components/forms/images-upload/images-upload';
import { UploadImage } from '@app/shared/components/forms/images-upload/domains';
import { AdvertAddForm } from './domains';

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
        ControlError,
        FormMessage,
        ImagesUpload,
    ],
    templateUrl: './advert-add.html',
    styleUrl: './advert-add.scss',
})
export class AdvertAdd {
    private readonly advertDraftState = inject(AdvertDraftStateService);
    private readonly categoryFacade = inject(CategoryFacade);
    private readonly advertService = inject(AdvertService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly dialogService = inject(DialogService);
    private readonly destroyRef = inject(DestroyRef);

    readonly categories = this.categoryFacade.allCategories;

    // только при помощи any[] решается баг с типизацией options в p-cascadeselect
    readonly categoriesForSelect: Signal<any[]> = this.categories;

    uploadImages = signal<UploadImage[]>([]);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    successMessage = signal<string | null>(null);
    errorMessage = signal<string | null>(null);

    advertAddForm: FormGroup<AdvertAddForm> = this.fb.nonNullable.group({
        category: ['', Validators.required],
        title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
        description: ['', Validators.maxLength(250)],
        address: ['', [Validators.required, Validators.maxLength(100)]],
        price: ['', [Validators.required, Validators.max(1000000000)]],
        phone: ['', Validators.required],
        email: ['', [Validators.email, Validators.maxLength(50)]],
    });

    constructor() {
        // восстановление данных из черновика
        const advertDraft = this.advertDraftState.advertDraft();
        if (advertDraft) this.advertAddForm.patchValue(advertDraft);

        // сохраняем изменения формы в черновик
        this.advertAddForm.valueChanges
            .pipe(
                debounceTime(1000),
                tap(() => this.advertDraftState.updateData(this.advertAddForm.getRawValue())),
                takeUntilDestroyed(),
            )
            .subscribe();
    }

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { title, address, price, phone } = this.advertAddForm.value;
        return !!title && !!address && !!price && !!phone;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.advertAddForm.get(controlName)?.errors && this.isSubmitted();
    }

    private formatPhone(phone: string): string {
        const digits = phone.replace(/[ ()]/g, '');
        return digits;
    }

    openTermsOfServiceDialog() {
        this.dialogService.open('terms-of-service');
    }

    private resetMessages() {
        this.errorMessage.set(null);
        this.successMessage.set(null);
    }

    private buildRequest(): NewAdvertRequest {
        const { title, description, price, email, phone, address, category } =
            this.advertAddForm.getRawValue();

        return {
            title,
            description: description || undefined,
            images: this.uploadImages().map((image) => image.file) || undefined,
            cost: Number(price),
            email: email || undefined,
            phone: this.formatPhone(phone),
            location: address,
            category,
        };
    }

    private setErrorMessage(error: HttpErrorResponse) {
        const message = (() => {
            switch (error.status) {
                case 400:
                    return 'Ошибка создания объявления. Попробуйте снова';
                case 500:
                    return 'Ошибка сервера. Попробуйте позже';
                default:
                    return 'Произошла ошибка. Попробуйте позже';
            }
        })();
        this.errorMessage.set(message);
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.advertAddForm.markAllAsTouched();

        if (this.advertAddForm.invalid) return;

        this.resetMessages();
        this.isLoading.set(true);

        this.advertService
            .newAdvert(this.buildRequest())
            .pipe(
                tap((res) => {
                    this.successMessage.set('Объявление успешно создано');
                    this.advertDraftState.clear();

                    setTimeout(() => {
                        this.router.navigate(['/advert/', res.id]);
                    }, 1000);
                }),
                catchError((error: HttpErrorResponse) => {
                    this.setErrorMessage(error);
                    return of(null);
                }),
                finalize(() => {
                    this.isLoading.set(false);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
