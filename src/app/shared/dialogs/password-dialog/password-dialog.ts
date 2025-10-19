import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PasswordInput, ControlError, FormMessage } from '@app/shared/components/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService, UserFacade } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { PasswordConfirmService } from '@app/core/confirmation';
import { AuthLoginRequest } from '@app/core/auth/domains';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PasswordConfirmForm } from './domains';

@Component({
    selector: 'app-password-dialog',
    imports: [PasswordInput, ReactiveFormsModule, ButtonModule, ControlError, FormMessage],
    templateUrl: './password-dialog.html',
    styleUrl: './password-dialog.scss',
})
export class PasswordDialog {
    private readonly authService = inject(AuthService);
    private readonly userFacade = inject(UserFacade);
    private readonly dialogService = inject(DialogService);
    private readonly passwordConfirmService = inject(PasswordConfirmService);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    readonly currentUser = this.userFacade.currentUser;

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    isPasswordVisible = signal<boolean>(false);

    passwordConfirmForm: FormGroup<PasswordConfirmForm> = this.fb.nonNullable.group({
        password: ['', Validators.required],
    });

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { password } = this.passwordConfirmForm.value;
        return !!password;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.passwordConfirmForm.get(controlName)?.errors && this.isSubmitted();
    }

    private buildRequest(): AuthLoginRequest {
        const login = this.currentUser()?.login;
        const password = this.passwordConfirmForm.getRawValue().password;

        return { login, password };
    }

    private setErrorMessage(error: HttpErrorResponse) {
        const message = (() => {
            switch (error.status) {
                case 400:
                    return 'Неверный пароль. Попробуйте снова';
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
        this.passwordConfirmForm.markAllAsTouched();

        if (this.passwordConfirmForm.invalid) return;

        this.isLoading.set(true);

        this.authService
            .confirmPassword(this.buildRequest())
            .pipe(
                tap((res) => {
                    this.passwordConfirmService.confirm();
                    // плохо так делать, но серверу необходимо заполненное поле password
                    this.passwordConfirmService.savePassword(
                        this.passwordConfirmForm.getRawValue().password,
                    );
                    this.dialogService.close();
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
