import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PasswordConfirmService {
    private readonly _confirmedPassword = signal<string | null>(null);
    readonly isPasswordConfirmed = signal<boolean>(false);
    readonly activeForm = signal<string | null>(null);

    confirm() {
        this.isPasswordConfirmed.set(true);
    }

    reset() {
        this.isPasswordConfirmed.set(false);
    }

    savePassword(password: string) {
        this._confirmedPassword.set(password);
    }

    private deletePassword() {
        this._confirmedPassword.set(null);
    }

    // плохо так делать, но серверу необходимо заполненное поле password
    consumePassword(): string | null {
        const pwd = this._confirmedPassword();
        this.deletePassword();
        return pwd;
    }

    setActiveForm(form: string) {
        this.activeForm.set(form);
    }
}
