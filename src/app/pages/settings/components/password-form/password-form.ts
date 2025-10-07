import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { passwordsMatchValidator } from '@app/shared/validators';
import { ControlError, PasswordInput, FormMessage } from '@app/shared/components/forms';
import { UsersFacade, UsersService } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { PasswordConfirmService } from '@app/core/confirmation';
import { UserUpdateRequest } from '@app/core/auth/domains';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface PasswordChangeForm {
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-password-form',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        ControlError,
        PasswordInput,
        FormMessage,
    ],
    templateUrl: './password-form.html',
    styleUrl: './password-form.scss',
})
export class PasswordForm {
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
    isPasswordVisible = signal<boolean>(false);

    passwordForm: FormGroup<PasswordChangeForm> = this.fb.nonNullable.group({
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        confirmPassword: [
            '',
            [Validators.required, Validators.minLength(8), Validators.maxLength(50)],
        ],
    });

    constructor() {
        // подключаем кастомный валидатор
        this.passwordForm.setValidators(
            passwordsMatchValidator(
                this.passwordForm.controls.newPassword,
                this.passwordForm.controls.confirmPassword,
            ),
        );
        effect(() => {
            const isPasswordConfirmed = this.passwordConfirmService.isPasswordConfirmed();
            const activeForm = this.passwordConfirmService.activeForm();

            if (isPasswordConfirmed && activeForm === 'password') {
                const userId = this.currentUser()?.id;
                if (!userId) return;

                const request = this.buildRequest();
                if (!request) return;

                this.isLoading.set(true);

                this.usersService
                    .updateUser(userId, request)
                    .pipe(
                        tap((res) => {
                            this.successMessage.set('Пароль изменен');
                            this.passwordConfirmService.reset();
                            this.resetFormState();
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

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { newPassword, confirmPassword } = this.passwordForm.value;
        return !!newPassword && !!confirmPassword;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.passwordForm.get(controlName)?.errors && this.isSubmitted();
    }

    private resetFormState() {
        this.passwordForm.reset();
        this.isSubmitted.set(false);
        this.errorMessage.set(null);
        this.isPasswordVisible.set(false);
    }

    private resetMessages() {
        this.errorMessage.set(null);
        this.successMessage.set(null);
    }

    private buildRequest(): UserUpdateRequest | null {
        const name = this.currentUser()?.name;
        const login = this.currentUser()?.login;
        const password = this.passwordForm.getRawValue().newPassword;

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
        this.passwordForm.markAllAsTouched();

        if (this.passwordForm.invalid) return;

        this.resetMessages();

        this.passwordConfirmService.setActiveForm('password');
        this.dialogService.open('password');
    }
}
