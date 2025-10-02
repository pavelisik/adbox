import { Component, inject, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { ConfirmService } from '@app/core/confirmation';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ControlError } from '@app/shared/forms/control-error/control-error';
import { passwordsMatchValidator } from '@app/shared/validators';

interface PasswordChangeForm {
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-password-form',
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, ControlError],
    templateUrl: './password-form.html',
    styleUrl: './password-form.scss',
})
export class PasswordForm {
    private readonly fb = inject(FormBuilder);
    private readonly confirm = inject(ConfirmService);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    formError = signal<string>('');
    isPasswordVisible = signal<boolean>(false);

    passwordForm: FormGroup<PasswordChangeForm> = this.fb.nonNullable.group({
        // тут будет еще асинхронный валидатор (проверяем совпадает ли текущий пароль)
        // или что еще проще сравнивать с паролем текущего пользователя
        // КАК ЕГО ВООБЩЕ ПРОВЕРЯТЬ?????
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
    });

    isControlInvalid(controlName: string): boolean {
        const control = this.passwordForm.get(controlName);
        return !!(control?.errors && this.isSubmitted());
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.passwordForm.markAllAsTouched();

        if (this.passwordForm.invalid) return;

        this.confirm.confirm('password', () => this.saveChanges());
    }

    private saveChanges() {
        this.isLoading.set(true);
        this.formError.set('');

        // имитация сохранения
        setTimeout(() => {
            this.isLoading.set(false);
            const { currentPassword, newPassword } = this.passwordForm.value;
            console.log('Отправлены старый и новый пароль:', currentPassword, newPassword);
        }, 1500);
    }

    constructor() {
        // подключаем кастомный валидатор
        this.passwordForm.setValidators(
            passwordsMatchValidator(
                this.passwordForm.controls.newPassword,
                this.passwordForm.controls.confirmPassword,
            ),
        );
    }
}
