import { Component, effect, inject, signal, untracked } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { UsersFacade, UsersService } from '@app/core/auth/services';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ControlError } from '@app/shared/components/forms';
import { SvgIcon } from '@app/shared/components';
import { DialogService } from '@app/core/dialog';

interface SettingsChangeForm {
    name: FormControl<string>;
    login: FormControl<string>;
    address: FormControl<string>;
}

@Component({
    selector: 'app-settings-form',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        MessageModule,
        ControlError,
        SvgIcon,
    ],
    templateUrl: './settings-form.html',
    styleUrl: './settings-form.scss',
})
export class SettingsForm {
    private readonly usersService = inject(UsersService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly dialogService = inject(DialogService);
    private readonly fb = inject(FormBuilder);

    successMessage = signal<string | null>(null);
    confirmedPassword = signal<string | null>(null);

    readonly currentUser = this.usersFacade.currentUser;

    isSubmitted = signal<boolean>(false);
    isLoading = signal<boolean>(false);
    formError = signal<string>('');

    settingsForm: FormGroup<SettingsChangeForm> = this.fb.nonNullable.group({
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
        address: [''],
    });

    // проверка на отличие данных в форме от текущих данных пользователя
    isFormChanged(): boolean {
        const user = this.currentUser();
        if (!user) return false;

        const name = this.settingsForm.get('name')?.value;
        const login = this.settingsForm.get('login')?.value;

        return name !== user.name || login !== user.login;
    }

    // проверка на заполнение обязательных полей (необходима перед первым нажатием onSubmit)
    isControlsCompleted(): boolean {
        const { name, login } = this.settingsForm.value;
        return !!name && !!login;
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.settingsForm.get(controlName);
        return !!(control?.errors && this.isSubmitted());
    }

    onSubmit() {
        this.isSubmitted.set(true);
        this.settingsForm.markAllAsTouched();

        if (this.settingsForm.invalid) return;

        // this.formError.set('');
        this.successMessage.set(null);

        this.dialogService.open('password', this.confirmedPassword);
    }

    constructor() {
        effect(() => {
            const currentUser = this.currentUser();
            if (currentUser) {
                this.settingsForm.patchValue({
                    name: currentUser.name,
                    login: currentUser.login,
                });
            }
        });
        effect(() => {
            const password = this.confirmedPassword();

            if (password) {
                untracked(() => {
                    const userId = this.currentUser()?.id;
                    if (!userId) return;

                    const { name, login } = this.settingsForm.getRawValue();

                    this.isLoading.set(true);
                    this.usersService.updateUser(userId, { name, login, password }).subscribe({
                        next: (res) => {
                            this.isLoading.set(false);
                            this.confirmedPassword.set(null);
                            this.successMessage.set('Изменения сохранены');
                        },
                        error: (error) => {
                            this.isLoading.set(false);
                            switch (error.status) {
                                case 400:
                                    this.formError.set(
                                        'Ошибка обновления данных. Попробуйте снова',
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
                });
            }
        });
    }
}
