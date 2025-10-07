import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { UsersFacade, UsersService } from '@app/core/auth/services';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ControlError, FormMessage } from '@app/shared/components/forms';
import { DialogService } from '@app/core/dialog';
import { PasswordConfirmService } from '@app/core/confirmation';
import { UserUpdateRequest } from '@app/core/auth/domains';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface SettingsChangeForm {
    name: FormControl<string>;
    login: FormControl<string>;
    address: FormControl<string>;
}

@Component({
    selector: 'app-settings-form',
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, ControlError, FormMessage],
    templateUrl: './settings-form.html',
    styleUrl: './settings-form.scss',
})
export class SettingsForm {
    private readonly usersService = inject(UsersService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly dialogService = inject(DialogService);
    private readonly passwordConfirmService = inject(PasswordConfirmService);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    readonly currentUser = this.usersFacade.currentUser;

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
            const currentUser = this.currentUser();
            if (!currentUser) return;

            const nameControl = this.settingsForm.get('name');
            const loginControl = this.settingsForm.get('login');
            if (nameControl && !nameControl.dirty) {
                nameControl.setValue(currentUser.name ?? '', { emitEvent: false });
            }
            if (loginControl && !loginControl.dirty) {
                loginControl.setValue(currentUser.login ?? '', { emitEvent: false });
            }
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

    // проверка на отличие данных в форме от текущих данных пользователя
    isFormChanged(): boolean {
        const user = this.currentUser();
        if (!user) return false;

        const name = this.settingsForm.get('name')?.value;
        const login = this.settingsForm.get('login')?.value;

        return name !== user.name || login !== user.login;
    }

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { name, login } = this.settingsForm.value;
        return !!name && !!login;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.settingsForm.get(controlName)?.errors && this.isSubmitted();
    }

    private resetMessages() {
        this.errorMessage.set(null);
        this.successMessage.set(null);
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

    onSubmit() {
        this.isSubmitted.set(true);
        this.settingsForm.markAllAsTouched();

        if (this.settingsForm.invalid) return;

        this.resetMessages();

        this.passwordConfirmService.setActiveForm('settings');
        this.dialogService.open('password');
    }
}
