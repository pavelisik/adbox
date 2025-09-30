import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-password-form',
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
    templateUrl: './password-form.html',
    styleUrl: './password-form.scss',
})
export class PasswordForm {
    private readonly fb = inject(FormBuilder);

    passwordForm = this.fb.nonNullable.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
    });

    onSubmit() {
        const { currentPassword, newPassword } = this.passwordForm.value;
        console.log('Отправлены старый и новый пароль:', currentPassword, newPassword);
    }
}
