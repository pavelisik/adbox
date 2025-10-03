import { Component, computed, effect, inject, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormBuilder,
    Validators,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { UsersFacade } from '@app/core/auth/services';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmService } from '@app/core/confirmation';
import { ControlError } from '@app/shared/components/forms';

interface SettingsChangeForm {
    name: FormControl<string>;
    login: FormControl<string>;
    address: FormControl<string>;
}

@Component({
    selector: 'app-settings-form',
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, MessageModule, ControlError],
    templateUrl: './settings-form.html',
    styleUrl: './settings-form.scss',
})
export class SettingsForm {
    private readonly usersFacade = inject(UsersFacade);
    private readonly fb = inject(FormBuilder);
    private readonly confirm = inject(ConfirmService);

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

        this.confirm.confirm('settings', () => this.saveChanges());
    }

    private saveChanges() {
        this.isLoading.set(true);
        this.formError.set('');

        // имитация сохранения
        setTimeout(() => {
            this.isLoading.set(false);
            const { name, login, address } = this.settingsForm.value;
            console.log('Отправлены имя, логин и адрес:', name, login, address);
        }, 1500);
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
    }
}
