import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    loginDialogOpen = signal(false);

    openLoginDialog() {
        this.loginDialogOpen.set(true);
    }

    closeLoginDialog() {
        this.loginDialogOpen.set(false);
    }
}
