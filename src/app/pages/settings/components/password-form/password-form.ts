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
import { passwordsMatchValidator } from '@app/shared/validators';
import { ControlError, PasswordInput } from '@app/shared/components/forms';

interface PasswordChangeForm {
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-password-form',
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, ControlError, PasswordInput],
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
        // надо пробовать ПО НАЖАТИЮ НА САБМИТ с текущим логином и этим паролем сделать запрос авторизации
        // на кнопке "Проверка пароля" и загрузку
        // в случае успеха выводить дальше окно подтверждения
        // в случае ошибки авторизации - выводить ошибку "Неверный текущий пароль. Попробуйте снова" (выводить как основную ошибку формы)

        currentPassword: ['', Validators.required],
        newPassword: [
            '',
            {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(50),
                ],
            },
        ],
        confirmPassword: [
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

    // проверка на заполнение обязательных полей (необходима перед первым нажатием onSubmit)
    isAllControlsCompleted(): boolean {
        const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
        return !!currentPassword && !!newPassword && !!confirmPassword;
    }

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
