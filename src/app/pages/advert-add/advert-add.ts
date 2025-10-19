import { Component, DestroyRef, effect, inject, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvertDraftStateService, AdvertService, CategoryFacade } from '@app/shared/services';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import {
    ControlError,
    FormMessage,
    AddressBlock,
    ImagesUpload,
} from '@app/shared/components/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, filter, finalize, of, skip, take, tap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DialogService } from '@app/core/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { UploadImage } from '@app/shared/components/forms/images-upload/domains';
import { AdvertAddForm, NewAdvertRequest } from './domains';
import { ConfirmService } from '@app/core/confirmation';
import { UserFacade } from '@app/core/auth/services';
import { Spinner } from '@app/shared/components';

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
        Spinner,
        AddressBlock,
    ],
    templateUrl: './advert-add.html',
    styleUrl: './advert-add.scss',
})
export class AdvertAdd {
    private readonly advertDraftState = inject(AdvertDraftStateService);
    private readonly categoryFacade = inject(CategoryFacade);
    private readonly advertService = inject(AdvertService);
    private readonly userFacade = inject(UserFacade);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly dialogService = inject(DialogService);
    private readonly confirm = inject(ConfirmService);
    private readonly destroyRef = inject(DestroyRef);

    // только при помощи any[] решается баг с типизацией options в p-cascadeselect
    readonly categories: Signal<any[]> = this.categoryFacade.allCategories;

    readonly currentUser = this.userFacade.currentUser;

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
        if (advertDraft) {
            this.advertAddForm.patchValue(advertDraft);
            this.uploadImages.set(this.advertDraftState.restoreImages());
        }

        // сохраняем изменения формы в черновик
        this.advertAddForm.valueChanges
            .pipe(
                debounceTime(1000),
                tap(() => this.advertDraftState.updateData(this.advertAddForm.getRawValue())),
                takeUntilDestroyed(),
            )
            .subscribe();

        // сохраняем изображения в черновик при изменении
        effect(() => {
            this.advertDraftState.updateImages(this.uploadImages());
        });

        // подставляем адрес из данных пользователя
        effect(() => {
            const address = this.currentUser()?.address;
            if (address) {
                this.advertAddForm.patchValue({ address });
            }
        });

        // вот только так из черновика данные подгружаются в категории
        // надо писать асинхронный метод как в настройках и в нем патчить значения (но скорей сего на паузу ставить во время запросов сохранение в черновик)
        // effect(() => {
        //     const category = this.advertDraftState.advertDraft().category;
        //     console.log('category:', category);
        //     if (category) {
        //         setTimeout(() => {
        //             this.advertAddForm.get('category')!.setValue(category);
        //         }, 1000);
        //     }
        // });
    }

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { title, address, price, phone } = this.advertAddForm.value;
        return !!title && !!address && !!price && !!phone;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.advertAddForm.get(controlName)?.errors && this.isSubmitted();
    }

    isCleanForm(): boolean {
        const formValue = this.advertAddForm.getRawValue();
        const isEmptyForm = Object.values(formValue).every(
            (value) => value === '' || value === null,
        );
        const noImages = this.uploadImages().length === 0;
        return isEmptyForm && noImages;
    }

    private formatPhone(phone: string): string {
        return phone.replace(/[ ()]/g, '');
    }

    openTermsOfServiceDialog() {
        this.dialogService.open('terms-of-service');
    }

    onResetFormData() {
        this.confirm.confirm('resetForm', () => {
            this.advertDraftState.clear();
            this.uploadImages.set([]);
            this.advertAddForm.reset();
            this.isSubmitted.set(true);
        });
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

        this.isLoading.set(true);

        this.advertService
            .newAdvert(this.buildRequest())
            .pipe(
                tap((res) => {
                    this.userFacade.refreshAuthUser();
                    this.successMessage.set('Объявление успешно создано');

                    setTimeout(() => {
                        this.router.navigate(['/advert/', res.id]).then(() => {
                            this.advertDraftState.clear();
                        });
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
