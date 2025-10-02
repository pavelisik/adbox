import { LoginDialogService } from '@app/shared/services';
import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    Validators,
    ReactiveFormsModule,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { AuthService } from '@app/core/auth/services';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterLink } from '@angular/router';

interface LoginForm {
    login: FormControl<string>;
    password: FormControl<string>;
    rememberMe: FormControl<boolean>;
}

@Component({
    selector: 'app-login-dialog',
    imports: [
        DialogModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        MessageModule,
        CheckboxModule,
        RouterLink,
    ],
    templateUrl: './login-dialog.html',
    styleUrl: './login-dialog.scss',
})
export class LoginDialog {
    private readonly authService = inject(AuthService);
    private readonly loginDialogService = inject(LoginDialogService);
    private readonly fb = inject(FormBuilder);

    private isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    formError = signal<string>('');
    isPasswordVisible = signal<boolean>(false);

    visible = this.loginDialogService.loginDialogOpen;

    loginForm: FormGroup<LoginForm> = this.fb.nonNullable.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
        rememberMe: [false],
    });

    // вывод ошибок валидации для каждого поля
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
        this.formError.set('');
        this.isPasswordVisible.set(false);
    }

    onShow() {
        this.resetFormState();
    }

    onClose() {
        this.resetFormState();
        this.loginDialogService.closeLoginDialog();
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.loginForm.markAllAsTouched();

        if (this.loginForm.invalid) return;

        this.isLoading.set(true);
        this.formError.set('');

        const rememberMe = this.loginForm.value.rememberMe ?? false;

        this.authService.login(this.loginForm.getRawValue(), rememberMe).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.onClose();
            },
            error: (error) => {
                this.isLoading.set(false);
                switch (error.status) {
                    case 400:
                        this.formError.set('Неверный логин или пароль. Попробуйте снова');
                        break;
                    case 500:
                        this.formError.set('Ошибка сервера. Попробуйте позже');
                        break;
                    default:
                        this.formError.set('Произошла ошибка. Попробуйте позже');
                        break;
                }
            },
        });
    }
}
