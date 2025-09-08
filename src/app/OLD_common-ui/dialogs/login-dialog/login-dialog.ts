import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@app/core/auth/services';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-login-dialog',
    imports: [DialogModule, ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule],
    templateUrl: './login-dialog.html',
    styleUrl: './login-dialog.scss',
})
export class LoginDialog {
    authService = inject(AuthService);
    fb = inject(FormBuilder);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    isPasswordVisible = signal<boolean>(false);
    loginError = signal<string>('');

    visible = this.authService.loginDialogOpen;

    searchForm = this.fb.nonNullable.group({
        search: [''],
    });

    loginForm = this.fb.nonNullable.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
    });

    getControlError(controlName: string): string | null {
        const control = this.loginForm.get(controlName);
        if (!control || !control.errors || !this.isSubmitted()) return null;

        if (control.errors['required']) {
            return controlName === 'login' ? 'Введите логин' : 'Введите пароль';
        }

        return 'Неверное значение';
    }

    resetFormState() {
        this.isSubmitted.set(false);
        this.loginForm.reset();
        this.loginError.set('');
        this.isPasswordVisible.set(false);
    }

    onShow() {
        this.resetFormState();
    }

    onClose() {
        this.resetFormState();
        this.authService.closeLoginDialog();
    }

    onLogin() {
        this.isSubmitted.set(true);
        this.loginForm.markAllAsTouched();

        if (this.loginForm.invalid) return;

        this.isLoading.set(true);
        this.loginError.set('');

        const { login, password } = this.loginForm.value;
        console.log('Отправлены логин и пароль:', login, password);

        this.authService.login(this.loginForm.getRawValue()).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                console.log(`Получен токен: ${res}`);
                this.onClose();
            },
            error: (err) => {
                this.isLoading.set(false);

                if (err.status === 400) {
                    this.loginError.set('Неверный логин или пароль. Попробуйте снова');
                } else if (err.status === 500) {
                    this.loginError.set('Произошла ошибка. Попробуйте позже');
                } else {
                    this.loginError.set(
                        'Ошибка: ' + (err.message ?? 'Неизвестная ошибка. Попробуйте снова')
                    );
                }
                console.log('Ошибка авторизации:', err?.error?.errors?.[0] ?? err.message);
            },
        });
    }
}
