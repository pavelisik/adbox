import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    Validators,
    ReactiveFormsModule,
    AbstractControl,
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

interface RegisterForm {
    login: FormControl<string>;
    name: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

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
    formError = signal<string>('');

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

    // вывод ошибок валидации для каждого поля
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
                case 'confirmPassword':
                    return 'Подтвердите пароль';
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

        if (control.errors['mismatch']) {
            return 'Пароли не совпадают';
        }

        return 'Неверное значение';
    }

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
