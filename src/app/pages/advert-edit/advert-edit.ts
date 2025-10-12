import { Component, DestroyRef, effect, inject, OnInit, signal, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    AdvertDraftStateService,
    AdvertService,
    CategoryFacade,
    ImageService,
} from '@app/shared/services';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { ControlError, FormMessage } from '@app/shared/components/forms';
import { NewAdvertRequest } from '@app/pages/adverts-list/domains';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, finalize, map, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DialogService } from '@app/core/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagesUpload } from '@app/shared/components/forms/images-upload/images-upload';
import { UploadImage } from '@app/shared/components/forms/images-upload/domains';
import { AdvertEditForm } from './domains';
import { ConfirmService } from '@app/core/confirmation';
import { UsersFacade } from '@app/core/auth/services';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NotificationService } from '@app/core/notification';
import { environment } from '@env/environment';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-advert-edit',
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
        RadioButtonModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './advert-edit.html',
    styleUrl: './advert-edit.scss',
})
export class AdvertEdit {
    // private readonly advertDraftState = inject(AdvertDraftStateService);
    private readonly categoryFacade = inject(CategoryFacade);
    private readonly advertService = inject(AdvertService);
    private readonly imageService = inject(ImageService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly dialogService = inject(DialogService);
    private readonly confirm = inject(ConfirmService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly route = inject(ActivatedRoute);
    private readonly notify = inject(NotificationService);

    readonly categories = this.categoryFacade.allCategories;
    // только при помощи any[] решается баг с типизацией options в p-cascadeselect
    readonly categoriesForSelect: Signal<any[]> = this.categories;

    readonly currentUser = this.usersFacade.currentUser;

    readonly advertId = this.route.snapshot.paramMap.get('id');

    uploadImages = signal<UploadImage[]>([]);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    successMessage = signal<string | null>(null);
    errorMessage = signal<string | null>(null);

    isDataLoading = signal<boolean>(false);
    isFictiveImageAdd = signal<boolean>(false);

    advertEditForm: FormGroup<AdvertEditForm> = this.fb.nonNullable.group({
        category: ['', Validators.required],
        title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
        description: ['', Validators.maxLength(250)],
        address: ['', [Validators.required, Validators.maxLength(100)]],
        price: ['', [Validators.required, Validators.max(1000000000)]],
        phone: ['', Validators.required],
        email: ['', [Validators.email, Validators.maxLength(50)]],
    });

    constructor() {
        this.loadAdvertForEdit();

        // effect(() => {
        //     console.log(this.uploadImages());
        // });
        // восстановление данных из черновика
        // const advertDraft = this.advertDraftState.advertDraft();
        // if (advertDraft) {
        //     this.advertChangeForm.patchValue(advertDraft);
        //     this.uploadImages.set(this.advertDraftState.restoreImages());
        // }
        // сохраняем изменения формы в черновик
        // this.advertChangeForm.valueChanges
        //     .pipe(
        //         debounceTime(1000),
        //         tap(() => this.advertDraftState.updateData(this.advertChangeForm.getRawValue())),
        //         takeUntilDestroyed(),
        //     )
        //     .subscribe();
        // сохраняем изображения в черновик при изменении
        // effect(() => {
        //     this.advertDraftState.updateImages(this.uploadImages());
        // });
    }

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { title, address, price, phone } = this.advertEditForm.value;
        return !!title && !!address && !!price && !!phone;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.advertEditForm.get(controlName)?.errors && this.isSubmitted();
    }

    isCleanForm(): boolean {
        const formValue = this.advertEditForm.getRawValue();
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
            // this.advertDraftState.clear();
            this.uploadImages.set([]);
            this.isSubmitted.set(false);
            this.isFictiveImageAdd.set(false);
            this.advertEditForm.reset();
        });
    }

    private buildRequest(): NewAdvertRequest {
        const { title, description, price, email, phone, address, category } =
            this.advertEditForm.getRawValue();

        let images = this.uploadImages().map((image) => image.file);

        // сервер не принимает updateAdvert без изображений
        // если не было выбрано изображений - добавляем фиктивный файл
        if (images.length === 0) {
            const emptyFile = new File([''], 'empty.jpg', { type: 'image/jpeg' });
            images = [emptyFile];
            this.isFictiveImageAdd.set(true);
        }

        return {
            title,
            description: description || undefined,
            images: images || undefined,
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
                    return 'Ошибка редактирования объявления. Попробуйте снова';
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
        this.advertEditForm.markAllAsTouched();

        if (this.advertEditForm.invalid) return;

        this.isLoading.set(true);

        const advertId = this.advertId;
        if (!advertId) return;

        this.advertService
            .updateAdvert(advertId, this.buildRequest())
            .pipe(
                switchMap((res) => {
                    // если было добавлено фиктивное изображение
                    if (this.isFictiveImageAdd() && res.imagesIds?.length === 1) {
                        this.notify.info(
                            'Редактирование объявления',
                            'Фиктивное изображение создано',
                        );
                        const fakeImageId = res.imagesIds[0];
                        // сразу удаляем фиктивное изображение
                        return this.imageService.deleteImage(fakeImageId).pipe(
                            tap(() => {
                                this.notify.info(
                                    'Редактирование объявления',
                                    'Фиктивное изображение удалено',
                                );
                                this.isFictiveImageAdd.set(false);
                            }),
                            map(() => res),
                        );
                    }
                    return of(res);
                }),
                tap((res) => {
                    this.usersFacade.refreshAuthUser();
                    this.successMessage.set('Объявление успешно отредактировано');

                    setTimeout(() => {
                        this.router.navigate(['/advert/', res.id]).then(() => {
                            // this.advertDraftState.clear();
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

    private loadAdvertForEdit(): void {
        const advertId = this.advertId;
        if (!advertId) return;

        this.isDataLoading.set(true);

        this.advertService
            .getAdvert(advertId)
            .pipe(
                tap((advert) => {
                    // заполняем форму
                    this.advertEditForm.patchValue({
                        category: advert.category.id,
                        title: advert.name,
                        description: advert.description,
                        address: advert.location,
                        price: advert.cost.toString(),
                        phone: advert.phone,
                        email: advert.email,
                    });

                    // подставляем уже загруженные изображения
                    const existingImages: UploadImage[] = advert.imagesIds.map((id) => ({
                        id,
                        file: new File([], ''), // фиктивный пустой файл (чтобы тип совпадал)
                        fileUrl: `${environment.baseApiURL}/images/${id}`, // URL к изображению
                        fileName: `image_${id}.jpg`,
                        fileType: 'image/jpeg',
                        fileSize: 0,
                    }));

                    this.uploadImages.set(existingImages);
                }),
                catchError((err) => {
                    // this.errorMessage.set('Не удалось загрузить объявление');
                    console.error(err);
                    return of(null);
                }),
                finalize(() => {
                    this.isDataLoading.set(false);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
