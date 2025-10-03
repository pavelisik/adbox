import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    Validators,
    ReactiveFormsModule,
    FormGroup,
    FormControl,
} from '@angular/forms';
import { AuthService } from '@app/core/auth/services';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RegisterDialogService } from '@app/shared/services';
import { passwordsMatchValidator } from '@app/shared/validators';
import { ControlError, PasswordInput } from '@app/shared/forms';

interface RegisterForm {
    login: FormControl<string>;
    name: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-register-dialog',
    imports: [
        DialogModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        MessageModule,
        ControlError,
        PasswordInput,
    ],
    templateUrl: './register-dialog.html',
    styleUrl: './register-dialog.scss',
})
export class RegisterDialog {
    private readonly authService = inject(AuthService);
    private readonly registerDialogService = inject(RegisterDialogService);
    private readonly fb = inject(FormBuilder);

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    formError = signal<string>('');
    isPasswordVisible = signal<boolean>(false);

    visible = this.registerDialogService.registerDialogOpen;

    registerForm: FormGroup<RegisterForm> = this.fb.nonNullable.group(
        {
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
            // passwords: this.fb.group(
            //     {
            //         password: [
            //             '',
            //             {
            //                 validators: [
            //                     Validators.required,
            //                     Validators.minLength(8),
            //                     Validators.maxLength(50),
            //                 ],
            //             },
            //         ],
            //         confirmPassword: [
            //             '',
            //             {
            //                 validators: [
            //                     Validators.required,
            //                     Validators.minLength(8),
            //                     Validators.maxLength(50),
            //                 ],
            //             },
            //         ],
            //     },
            //     { validators: passwordsMatchValidator('password', 'confirmPassword') },
            // ),
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
            confirmPassword: [
                '',
                {
                    validators: [Validators.required],
                },
            ],
        },
        // { validators: this.passwordsMatchValidator },
    );

    // проверка на заполнение обязательных полей (необходима перед первым нажатием onSubmit)
    isAllControlsCompleted(): boolean {
        const { login, name, password, confirmPassword } = this.registerForm.value;
        return !!login && !!name && !!password && !!confirmPassword;
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.registerForm.get(controlName);
        return !!(control?.errors && this.isSubmitted());
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

    resetFormState() {
        this.isSubmitted.set(false);
        this.registerForm.reset();
        this.formError.set('');
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
        this.formError.set('');

        this.authService.register(this.registerForm.getRawValue()).subscribe({
            next: (res) => {
                // при успешной регистрации автоматически залогиниваем нового пользователя
                this.authService
                    .login(
                        {
                            login: this.registerForm.getRawValue().login,
                            password: this.registerForm.getRawValue().password,
                        },
                        false,
                    )
                    .subscribe({
                        next: (res) => {
                            this.isLoading.set(false);
                            this.onClose();
                        },
                        error: (error) => {
                            this.isLoading.set(false);
                            switch (error.status) {
                                case 400:
                                    this.formError.set(
                                        'Неверный логин или пароль. Попробуйте снова',
                                    );
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
            },
            error: (error) => {
                this.isLoading.set(false);
                switch (error.status) {
                    case 400:
                        this.formError.set('Невалидные данные. Попробуйте снова');
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

    constructor() {
        // подключаем кастомный валидатор
        this.registerForm.setValidators(
            passwordsMatchValidator(
                this.registerForm.controls.password,
                this.registerForm.controls.confirmPassword,
            ),
        );
    }
}
