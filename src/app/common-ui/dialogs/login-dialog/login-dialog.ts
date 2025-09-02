import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@app/auth/auth-service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-login-dialog',
    imports: [DialogModule, ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule],
    templateUrl: './login-dialog.html',
    styleUrl: './login-dialog.scss',
})
export class LoginDialog {
    authService = inject(AuthService);
    fb = inject(FormBuilder);
    visible = this.authService.loginDialogOpen;

    loginForm = this.fb.nonNullable.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    });

    isInvalid(controlName: string): boolean {
        const control = this.loginForm.get(controlName);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    onShow() {
        this.loginForm.reset();
    }

    close() {
        this.loginForm.reset();
        this.authService.closeLoginDialog();
    }

    onLogin() {
        this.loginForm.markAllAsTouched();
        this.loginForm.updateValueAndValidity();

        if (this.loginForm.invalid) return;

        const { username, password } = this.loginForm.value;
        console.log('Выполнен вход:', username, password);

        this.close();
    }
}
