import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@app/auth/auth-service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-login-dialog',
    imports: [DialogModule, ReactiveFormsModule, ButtonModule, InputTextModule],
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

    close() {
        this.authService.closeLoginDialog();
    }

    onLogin() {
        if (this.loginForm.invalid) return;

        const { username, password } = this.loginForm.value;
        console.log('Выполнен вход:', username, password);

        this.close();
    }
}
