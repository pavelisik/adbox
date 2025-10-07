import { Component, effect, inject, signal, untracked } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { passwordsMatchValidator } from '@app/shared/validators';
import { ControlError, PasswordInput, FormMessage } from '@app/shared/components/forms';
import { UsersFacade, UsersService } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';
import { PasswordConfirmService } from '@app/core/confirmation';

interface PasswordChangeForm {
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-password-form',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        ControlError,
        PasswordInput,
        FormMessage,
    ],
    templateUrl: './password-form.html',
    styleUrl: './password-form.scss',
})
export class PasswordForm {
    private readonly usersService = inject(UsersService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly dialogService = inject(DialogService);
    private readonly passwordConfirmService = inject(PasswordConfirmService);
    private readonly fb = inject(FormBuilder);

    readonly currentUser = this.usersFacade.currentUser;

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    successMessage = signal<string | null>(null);
    errorMessage = signal<string | null>(null);
    isPasswordVisible = signal<boolean>(false);

    passwordForm: FormGroup<PasswordChangeForm> = this.fb.nonNullable.group({
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        confirmPassword: [
            '',
            [Validators.required, Validators.minLength(8), Validators.maxLength(50)],
        ],
    });

    // проверка на первое заполнение обязательных полей
    isAllRequiredCompleted(): boolean {
        const { newPassword, confirmPassword } = this.passwordForm.value;
        return !!newPassword && !!confirmPassword;
    }

    isControlInvalid(controlName: string): boolean {
        return !!this.passwordForm.get(controlName)?.errors && this.isSubmitted();
    }

    private resetFormState() {
        this.passwordForm.reset();
        this.isSubmitted.set(false);
        this.errorMessage.set(null);
        this.isPasswordVisible.set(false);
    }

    private resetMessages() {
        this.errorMessage.set(null);
        this.successMessage.set(null);
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.passwordForm.markAllAsTouched();

        if (this.passwordForm.invalid) return;

        this.resetMessages();

        this.passwordConfirmService.setActiveForm('password');
        this.dialogService.open('password');
    }

    constructor() {
        // подключаем кастомный валидатор
        this.passwordForm.setValidators(
            passwordsMatchValidator(
                this.passwordForm.controls.newPassword,
                this.passwordForm.controls.confirmPassword,
            ),
        );
        effect(() => {
            const isPasswordConfirmed = this.passwordConfirmService.isPasswordConfirmed();
            const activeForm = this.passwordConfirmService.activeForm();

            if (isPasswordConfirmed && activeForm === 'password') {
                untracked(() => {
                    const userId = this.currentUser()?.id;
                    if (!userId) return;

                    const name = this.currentUser()?.name;
                    const login = this.currentUser()?.login;
                    if (!name || !login) return;

                    const password = this.passwordForm.getRawValue().newPassword;

                    this.isLoading.set(true);

                    this.usersService.updateUser(userId, { name, login, password }).subscribe({
                        next: (res) => {
                            this.isLoading.set(false);
                            this.passwordConfirmService.reset();
                            this.resetFormState();
                            this.successMessage.set('Пароль изменен');
                        },
                        error: (error) => {
                            this.isLoading.set(false);
                            this.passwordConfirmService.reset();
                            switch (error.status) {
                                case 400:
                                    this.errorMessage.set(
                                        'Ошибка обновления данных. Попробуйте снова',
                                    );
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
                });
            }
        });
    }
}
