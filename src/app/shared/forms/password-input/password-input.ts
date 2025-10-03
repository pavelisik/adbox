import { Component, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-password-input',
    imports: [ReactiveFormsModule, InputTextModule],
    templateUrl: './password-input.html',
    styleUrl: './password-input.scss',
})
export class PasswordInput {
    control = input.required<FormControl<string>>();
    isInvalid = input<boolean>(false);
    isPasswordVisible = model<boolean>(false);
    placeholder = input<string>('Введите пароль');

    togglePasswordVisibility() {
        this.isPasswordVisible.update((value) => !value);
    }
}
