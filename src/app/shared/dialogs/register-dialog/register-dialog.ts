import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '@app/core/auth/services';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { passwordsMatchValidator } from '@app/shared/validators';
import { ControlError, PasswordInput, FormMessage } from '@app/shared/components/forms';
import { DialogService } from '@app/core/dialog';
import { AuthLoginRequest, AuthRegisterRequest } from '@app/core/auth/domains';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegisterForm } from './domains';

@Component({
    selector: 'app-register-dialog',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        ControlError,
        PasswordInput,
        FormMessage,
    ],
    templateUrl: './register-dialog.html',
    styleUrl: './register-dialog.scss',
})
export class RegisterDialog {
    private readonly authService = inject(AuthService);
    private readonly dialogService = inject(DialogService);
    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string | null>(null);
    isPasswordVisible = signal<boolean>(false);

    registerForm: FormGroup<RegisterForm> = this.fb.nonNullable.group(
        {
            login: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
            name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],

            // passwords: this.fb.group(
            //     {
            //         password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
            //         confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
            //     },
            //     { validators: passwordsMatchValidator('password', 'confirmPassword') },
            // ),

            password: [
                '',
                [Validators.required, Validators.minLength(8), Validators.maxLength(50)],
            ],
            confirmPassword: ['', Validators.required],
        },
        // { validators: this.passwordsMatchValidator },
    );

    constructor() {
        // подключаем кастомный валидатор
        this.registerForm.setValidators(
            passwordsMatchValidator(
                this.registerForm.controls.password,
                this.registerForm.controls.confirmPassword,
            ),
        );
    }

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { login, name, password, confirmPassword } = this.registerForm.value;
        return !!login && !!name && !!password && !!confirmPassword;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.registerForm.get(controlName)?.errors && this.isSubmitted();
    }

    private buildRequest(type: 'login' | 'register'): AuthLoginRequest | AuthRegisterRequest {
        const { login, name, password } = this.registerForm.getRawValue();

        return type === 'login' ? { login, password } : { login, name, password };
    }

    private setErrorMessage(error: HttpErrorResponse, type: 'login' | 'register') {
        const message = (() => {
            switch (error.status) {
                case 400:
                    return type === 'login'
                        ? 'Неверный логин или пароль. Попробуйте снова'
                        : 'Невалидные данные. Попробуйте снова';
                case 500:
                    return 'Ошибка сервера. Попробуйте позже';
                default:
                    return 'Произошла ошибка. Попробуйте позже';
            }
        })();
        this.errorMessage.set(message);
    }

    // кастомный валидатор для проверки совпадения паролей
    // passwordsMatchValidator(control: AbstractControl) {
    //     const formGroup = control as FormGroup<RegisterForm>;
    //     const passwordControl = formGroup.controls.password;
    //     const confirmPasswordControl = formGroup.controls.confirmPassword;

    //     if (
    //         passwordControl?.value &&
    //         confirmPasswordControl?.value &&
    //         passwordControl?.value !== confirmPasswordControl.value
    //     ) {
    //         confirmPasswordControl?.setErrors({ mismatch: true });
    //     } else {
    //         if (confirmPasswordControl?.hasError('mismatch')) {
    //             confirmPasswordControl.setErrors(null);
    //         }
    //     }

    //     return null;
    // }

    onSubmit() {
        this.isSubmitted.set(true);
        this.registerForm.markAllAsTouched();

        if (this.registerForm.invalid) return;

        this.isLoading.set(true);

        this.authService
            .register(this.buildRequest('register'))
            .pipe(
                // при успешной регистрации автоматически залогиниваем нового пользователя
                switchMap(() =>
                    this.authService.login(this.buildRequest('login'), false).pipe(
                        tap(() => {
                            this.dialogService.close();
                        }),
                        catchError((error: HttpErrorResponse) => {
                            this.setErrorMessage(error, 'login');
                            return of(null);
                        }),
                    ),
                ),
                catchError((error: HttpErrorResponse) => {
                    this.setErrorMessage(error, 'register');
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
