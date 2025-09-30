import { Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsersFacade } from '@app/core/auth/services';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-settings-form',
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
    templateUrl: './settings-form.html',
    styleUrl: './settings-form.scss',
})
export class SettingsForm {
    private readonly usersFacade = inject(UsersFacade);
    private readonly fb = inject(FormBuilder);

    readonly currentUser = this.usersFacade.currentUser;

    settingsForm = this.fb.nonNullable.group({
        name: ['', Validators.required],
        login: ['', Validators.required],
        address: [''],
    });

    onSubmit() {
        const { name, login, address } = this.settingsForm.value;
        console.log('Отправлены имя, логин и адрес:', name, login, address);
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
