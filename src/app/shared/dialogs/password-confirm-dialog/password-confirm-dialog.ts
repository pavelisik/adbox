import { Component, inject, model, signal } from '@angular/core';
import { PasswordConfirmDialogService } from '@app/shared/services/password-confirm-dialog.service';
import { DialogModule } from 'primeng/dialog';
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

interface PasswordConfirmForm {
    password: FormControl<string>;
}

@Component({
    selector: 'app-password-confirm-dialog',
    imports: [
        DialogModule,
        PasswordInput,
        ReactiveFormsModule,
        ButtonModule,
        ControlError,
        MessageModule,
    ],
    templateUrl: './password-confirm-dialog.html',
    styleUrl: './password-confirm-dialog.scss',
})
export class PasswordConfirmDialog {
    private readonly authService = inject(AuthService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly passwordConfirmDialogService = inject(PasswordConfirmDialogService);
    private readonly fb = inject(FormBuilder);

    readonly currentUser = this.usersFacade.currentUser;

    confirmedPassword = model<string | null>(null);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    formError = signal<string>('');
    isPasswordVisible = signal<boolean>(false);

    visible = this.passwordConfirmDialogService.passwordConfirmDialogOpen;

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

    resetFormState() {
        this.isSubmitted.set(false);
        this.passwordConfirmForm.reset();
        this.formError.set('');
        this.isPasswordVisible.set(false);
    }

    onShow() {
        this.resetFormState();
    }

    onClose() {
        this.resetFormState();
        this.passwordConfirmDialogService.closeDialog();
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
                this.onClose();
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
