import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsersFacade, UsersService } from '@app/core/auth/services';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ControlError, FormMessage } from '@app/shared/components/forms';
import { DialogService } from '@app/core/dialog';
import { PasswordConfirmService } from '@app/core/confirmation';
import { UserUpdateRequest } from '@app/core/auth/domains';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, never, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SettingsChangeForm } from './domains';
import { LocalUserService } from '@app/core/auth/services';
import { NotificationService } from '@app/core/notification';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DadataService } from '@app/shared/services';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

@Component({
    selector: 'app-settings-form',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        ControlError,
        FormMessage,
        ProgressSpinnerModule,
        AutoCompleteModule,
    ],
    templateUrl: './settings-form.html',
    styleUrl: './settings-form.scss',
})
export class SettingsForm {
    private readonly usersService = inject(UsersService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly localUserService = inject(LocalUserService);
    private readonly dialogService = inject(DialogService);
    private readonly passwordConfirmService = inject(PasswordConfirmService);
    private readonly dadataService = inject(DadataService);
    private readonly notify = inject(NotificationService);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    readonly currentUser = this.usersFacade.currentUser;

    readonly addressSuggestions = signal<string[]>([]);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    successMessage = signal<string | null>(null);
    errorMessage = signal<string | null>(null);

    settingsForm: FormGroup<SettingsChangeForm> = this.fb.nonNullable.group({
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
        login: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
        address: [''],
    });

    constructor() {
        effect(() => {
            const user = this.currentUser();
            if (!user) return;

            const nameControl = this.settingsForm.get('name');
            const loginControl = this.settingsForm.get('login');
            const addressControl = this.settingsForm.get('address');

            if (nameControl && !nameControl.dirty)
                nameControl.setValue(user.name ?? '', { emitEvent: false });
            if (loginControl && !loginControl.dirty)
                loginControl.setValue(user.login ?? '', { emitEvent: false });
            if (addressControl && !addressControl.dirty && user.address)
                addressControl.setValue(user.address ?? '', { emitEvent: false });
        });
        effect(() => {
            const isPasswordConfirmed = this.passwordConfirmService.isPasswordConfirmed();
            const activeForm = this.passwordConfirmService.activeForm();

            if (isPasswordConfirmed && activeForm === 'settings') {
                const userId = this.currentUser()?.id;
                if (!userId) return;

                const request = this.buildRequest();
                if (!request) return;

                this.isLoading.set(true);

                this.usersService
                    .updateUser(userId, request)
                    .pipe(
                        tap((res) => {
                            this.usersFacade.refreshAuthUser();
                            this.successMessage.set('Изменения сохранены');
                            this.passwordConfirmService.reset();
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
        });
    }

    // проверка изменения серверных полей (login и name)
    isAuthUserDataChanged(): boolean {
        const user = this.currentUser();
        if (!user) return false;

        const { name, login } = this.settingsForm.getRawValue();
        return name !== user.name || login !== user.login;
    }

    // проверка изменения локальных полей
    isLocalUserDataChanged(): boolean {
        const user = this.currentUser();
        if (!user) return false;

        const { address } = this.settingsForm.getRawValue();
        return address !== user.address;
    }

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { name, login } = this.settingsForm.value;
        return !!name && !!login;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.settingsForm.get(controlName)?.errors && this.isSubmitted();
    }

    private buildRequest(): UserUpdateRequest | null {
        const { name, login } = this.settingsForm.getRawValue();
        // очень плохо так делать, но серверу необходимо заполненное поле password
        const password = this.passwordConfirmService.consumePassword();

        return name && login && password ? { name, login, password } : null;
    }

    private setErrorMessage(error: HttpErrorResponse) {
        const message = (() => {
            switch (error.status) {
                case 400:
                    return 'Ошибка обновления данных. Попробуйте снова';
                case 500:
                    return 'Ошибка сервера. Попробуйте позже';
                default:
                    return 'Произошла ошибка. Попробуйте позже';
            }
        })();
        this.errorMessage.set(message);
    }

    // поиск адреса с автокомплитом из DaData
    searchAddress(event: AutoCompleteCompleteEvent) {
        this.dadataService
            .getAddressStrings(event.query)
            .pipe(
                tap((res) => this.addressSuggestions.set(res)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private localDataUpdate() {
        const user = this.currentUser();
        if (!user) return;

        const { address } = this.settingsForm.getRawValue();
        this.localUserService.updateData(user.id, { address });

        // выводить сообщение только если серверные поля не изменены (чтобы не было дубля)
        if (!this.isAuthUserDataChanged()) {
            this.successMessage.set('Изменения сохранены');
            this.notify.success('Обновление данных', 'Данные пользователя успешно изменены');
        }
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.settingsForm.markAllAsTouched();

        if (this.settingsForm.invalid) return;

        // обновляем серверные поля с запросом подтверждения пароля
        if (this.isAuthUserDataChanged()) {
            this.passwordConfirmService.setActiveForm('settings');
            this.dialogService.open('password');
        }

        // обновляем локальные поля
        if (this.isLocalUserDataChanged()) {
            this.localDataUpdate();
        }
    }
}
