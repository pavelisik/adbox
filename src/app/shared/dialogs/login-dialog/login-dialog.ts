import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ControlError, PasswordInput, FormMessage } from '@app/shared/components/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthLoginRequest } from '@app/core/auth/domains';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginForm } from './domains';

@Component({
    selector: 'app-login-dialog',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ControlError,
        PasswordInput,
        CheckboxModule,
        RouterLink,
        ButtonModule,
        FormMessage,
    ],
    templateUrl: './login-dialog.html',
    styleUrl: './login-dialog.scss',
})
export class LoginDialog {
    private readonly authService = inject(AuthService);
    private readonly dialogService = inject(DialogService);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    isPasswordVisible = signal<boolean>(false);

    loginForm: FormGroup<LoginForm> = this.fb.nonNullable.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
        rememberMe: [false],
    });

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { login, password } = this.loginForm.value;
        return !!login && !!password;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.loginForm.get(controlName)?.errors && this.isSubmitted();
    }

    private buildRequest(): AuthLoginRequest {
        return this.loginForm.getRawValue();
    }

    private setErrorMessage(error: HttpErrorResponse) {
        const message = (() => {
            switch (error.status) {
                case 400:
                    return 'Неверный логин или пароль. Попробуйте снова';
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
        this.loginForm.markAllAsTouched();

        if (this.loginForm.invalid) return;

        this.errorMessage.set(null);
        this.isLoading.set(true);

        const rememberMe = this.loginForm.value.rememberMe ?? false;

        this.authService
            .login(this.buildRequest(), rememberMe)
            .pipe(
                tap((res) => {
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
