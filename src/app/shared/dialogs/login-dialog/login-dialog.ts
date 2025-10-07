import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AuthService } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ControlError, PasswordInput, FormMessage } from '@app/shared/components/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

interface LoginForm {
    login: FormControl<string>;
    password: FormControl<string>;
    rememberMe: FormControl<boolean>;
}

@Component({
    selector: 'app-login-dialog',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ControlError,
        PasswordInput,
        CheckboxModule,
        RouterLink,
        MessageModule,
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
        const control = this.loginForm.get(controlName);
        return !!(control?.errors && this.isSubmitted());
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.loginForm.markAllAsTouched();

        if (this.loginForm.invalid) return;

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const rememberMe = this.loginForm.value.rememberMe ?? false;

        this.authService.login(this.loginForm.getRawValue(), rememberMe).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.dialogService.close();
            },
            error: (error) => {
                this.isLoading.set(false);
                switch (error.status) {
                    case 400:
                        this.errorMessage.set('Неверный логин или пароль. Попробуйте снова');
                        break;
                    case 500:
                        this.errorMessage.set('Ошибка сервера. Попробуйте позже');
                        break;
                    default:
                        this.errorMessage.set('Произошла ошибка. Попробуйте позже');
                        break;
                }
            },
        });
    }
}
