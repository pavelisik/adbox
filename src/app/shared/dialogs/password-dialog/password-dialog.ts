import { Component, inject, model, signal } from '@angular/core';
import { PasswordInput, ControlError } from '@app/shared/components/forms';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService, UsersFacade } from '@app/core/auth/services';
import { MessageModule } from 'primeng/message';
import { DialogService } from '@app/core/dialog';

interface PasswordConfirmForm {
    password: FormControl<string>;
}

@Component({
    selector: 'app-password-dialog',
    imports: [PasswordInput, ReactiveFormsModule, ButtonModule, ControlError, MessageModule],
    templateUrl: './password-dialog.html',
    styleUrl: './password-dialog.scss',
})
export class PasswordDialog {
    private readonly authService = inject(AuthService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly dialogService = inject(DialogService);
    private readonly fb = inject(FormBuilder);

    readonly currentUser = this.usersFacade.currentUser;

    confirmedPassword = model<string | null>(null);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    formError = signal<string>('');
    isPasswordVisible = signal<boolean>(false);

    passwordConfirmForm: FormGroup<PasswordConfirmForm> = this.fb.nonNullable.group({
        password: ['', Validators.required],
    });

    isControlsCompleted(): boolean {
        const { password } = this.passwordConfirmForm.value;
        return !!password;
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.passwordConfirmForm.get(controlName);
        return !!(control?.errors && this.isSubmitted());
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.passwordConfirmForm.markAllAsTouched();

        if (this.passwordConfirmForm.invalid) return;

        this.isLoading.set(true);
        this.formError.set('');

        const confirmPasswordRequest = {
            login: this.currentUser()?.login,
            ...this.passwordConfirmForm.getRawValue(),
        };

        this.authService.confirmPassword(confirmPasswordRequest).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.confirmedPassword.set(this.passwordConfirmForm.getRawValue().password);
                this.dialogService.close();
            },
            error: (error) => {
                this.isLoading.set(false);
                switch (error.status) {
                    case 400:
                        this.formError.set('Неверный пароль. Попробуйте снова');
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
