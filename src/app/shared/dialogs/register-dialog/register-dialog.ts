import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@app/core/auth/services';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RegisterDialogService } from '@app/shared/services';

@Component({
    selector: 'app-register-dialog',
    imports: [DialogModule, ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule],
    templateUrl: './register-dialog.html',
    styleUrl: './register-dialog.scss',
})
export class RegisterDialog {
    private readonly authService = inject(AuthService);
    private readonly registerDialogService = inject(RegisterDialogService);
    private readonly fb = inject(FormBuilder);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    isPasswordVisible = signal<boolean>(false);
    registerError = signal<string>('');

    visible = this.registerDialogService.registerDialogOpen;

    registerForm = this.fb.nonNullable.group({
        login: [
            '',
            {
                validators: [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(64),
                ],
            },
        ],
        name: [
            '',
            {
                validators: [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(64),
                ],
            },
        ],
        password: [
            '',
            {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(50),
                ],
            },
        ],
    });

    getControlError(controlName: string): string | null {
        const control = this.registerForm.get(controlName);
        if (!control || !control.errors || !this.isSubmitted()) return null;

        if (control.errors['required']) {
            switch (controlName) {
                case 'login':
                    return 'Введите логин';
                case 'name':
                    return 'Введите имя';
                case 'password':
                    return 'Введите пароль';
                default:
                    return 'Заполните поле';
            }
        }

        if (control.errors['minlength']) {
            const requiredLength = control.errors['minlength'].requiredLength;
            const symbolWord = ['login', 'name'].includes(controlName) ? 'символа' : 'символов';
            return `Минимум ${requiredLength} ${symbolWord}`;
        }

        if (control.errors['maxlength']) {
            const requiredLength = control.errors['maxlength'].requiredLength;
            const symbolWord = ['login', 'name'].includes(controlName) ? 'символа' : 'символов';
            return `Максимум ${requiredLength} ${symbolWord}`;
        }

        return 'Неверное значение';
    }

    resetFormState() {
        this.isSubmitted.set(false);
        this.registerForm.reset();
        this.registerError.set('');
        this.isPasswordVisible.set(false);
    }

    onShow() {
        this.resetFormState();
    }

    onClose() {
        this.resetFormState();
        this.registerDialogService.closeRegisterDialog();
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.registerForm.markAllAsTouched();

        if (this.registerForm.invalid) return;

        this.isLoading.set(true);
        this.registerError.set('');

        // const { login, name, password } = this.registerForm.value;
        // console.log('Отправлены на регистрацию логин, имя и пароль:', login, name, password);

        this.authService.register(this.registerForm.getRawValue()).subscribe({
            next: (res) => {
                // console.log(`Зарегистрирован новый пользователь с id: ${res}`);
                this.authService
                    .login({
                        login: this.registerForm.getRawValue().login,
                        password: this.registerForm.getRawValue().password,
                    })
                    .subscribe({
                        next: (res) => {
                            this.isLoading.set(false);
                            // console.log(`Получен токен: ${res}`);
                            this.onClose();
                        },
                        error: (err) => {
                            this.isLoading.set(false);
                            if (err.status === 400) {
                                this.registerError.set(
                                    'Неверный логин или пароль. Попробуйте снова',
                                );
                            } else if (err.status === 500) {
                                this.registerError.set('Произошла ошибка. Попробуйте позже');
                            } else {
                                this.registerError.set(
                                    'Ошибка: ' +
                                        (err.message ?? 'Неизвестная ошибка. Попробуйте снова'),
                                );
                            }
                            // console.log(
                            //     'Ошибка авторизации:',
                            //     err?.error?.errors?.[0] ?? err.message,
                            // );
                        },
                    });
            },
            error: (err) => {
                this.isLoading.set(false);
                if (err.status === 400) {
                    this.registerError.set('Невалидные данные. Попробуйте снова');
                } else if (err.status === 500) {
                    this.registerError.set('Произошла ошибка. Попробуйте позже');
                } else {
                    this.registerError.set(
                        'Ошибка: ' + (err.message ?? 'Неизвестная ошибка. Попробуйте снова'),
                    );
                }
                // console.log('Ошибка регистрации:', err.error.errors[0]);
            },
        });
    }
}
