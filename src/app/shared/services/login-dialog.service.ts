import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class LoginDialogService {
    router = inject(Router);
    loginDialogOpen = signal<boolean>(false);
    redirectUrl = signal<string | null>(null);

    openLoginDialog() {
        this.loginDialogOpen.set(true);
    }

    closeLoginDialog() {
        this.loginDialogOpen.set(false);
    }

    loginRedirect() {
        const url = this.redirectUrl();
        if (url) {
            this.router.navigateByUrl(url);
            this.redirectUrl.set(null);
        }
    }
}
