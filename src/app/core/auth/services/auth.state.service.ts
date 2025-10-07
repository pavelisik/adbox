import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private readonly router = inject(Router);
    private readonly cookieService = inject(CookieService);
    readonly token = signal<string | null>(this.cookieService.get('token') || null);
    readonly redirectUrl = signal<string | null>(null);

    readonly isAuth = computed(() => !!this.token());

    saveToken(token: string, rememberMe: boolean) {
        this.token.set(token);
        const expires = rememberMe ? 30 : undefined;
        this.cookieService.set('token', token, expires, '/');
    }

    deleteToken() {
        this.token.set(null);
        this.cookieService.delete('token', '/');
    }

    setRedirectUrl(url: string) {
        this.redirectUrl.set(url);
    }

    clearRedirectUrl() {
        this.redirectUrl.set(null);
    }

    redirectAfterLogin() {
        const url = this.redirectUrl();
        if (url) {
            this.router.navigateByUrl(url);
            this.clearRedirectUrl();
        }
    }
}
