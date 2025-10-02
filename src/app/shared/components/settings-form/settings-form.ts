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
import { ControlError } from '@app/shared/forms/control-error/control-error';

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
        name: ['', Validators.required],
        login: ['', Validators.required],
        address: [''],
    });

    isControlInvalid(controlName: string) {
        return computed(() => {
            const control = this.settingsForm.get(controlName);
            return !!(control?.errors && this.isSubmitted());
        });
    }

    // вывод ошибок валидации для каждого поля
    // getControlError(controlName: string): string | null {
    //     const control = this.settingsForm.get(controlName);
    //     if (!control || !control.errors || !this.isSubmitted()) return null;

    //     if (control.errors['required']) {
    //         return controlName === 'name' ? 'Введите имя' : 'Введите логин';
    //     }

    //     return 'Неверное значение';
    // }

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
