import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PasswordConfirmDialogService {
    passwordConfirmDialogOpen = signal<boolean>(false);

    openDialog() {
        this.passwordConfirmDialogOpen.set(true);
    }

    closeDialog() {
        this.passwordConfirmDialogOpen.set(false);
    }
}
