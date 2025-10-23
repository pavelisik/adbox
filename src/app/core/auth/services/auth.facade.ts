import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '@app/core/auth/services';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    private readonly authStateService = inject(AuthStateService);
    private readonly router = inject(Router);
    private readonly cookieService = inject(CookieService);

    readonly isAuth = this.authStateService.isAuth;
    readonly token = this.authStateService.token;
    readonly redirectUrl = this.authStateService.redirectUrl;

    saveToken(token: string, rememberMe: boolean) {
        this.authStateService.setToken(token);

        if (rememberMe) {
            this.cookieService.set('token', token, { expires: 30, path: '/' });
        } else {
            this.cookieService.set('token', token, { path: '/' });
        }
    }

    deleteToken() {
        this.authStateService.clearToken();
        this.cookieService.delete('token', '/');
    }

    setRedirectUrl(url: string) {
        this.authStateService.setRedirectUrl(url);
    }

    clearRedirectUrl() {
        this.authStateService.clearRedirectUrl();
    }

    redirectAfterLogin() {
        const url = this.redirectUrl();
        if (!url) return;

        this.router.navigateByUrl(url);
        this.clearRedirectUrl();
    }

    initFromCookie() {
        const token = this.cookieService.get('token') || null;
        this.authStateService.setToken(token);
    }
}
