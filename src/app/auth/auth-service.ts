import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    http = inject(HttpClient);
    router = inject(Router);
    cookieService = inject(CookieService);

    loginDialogOpen = signal(false);
    baseApiUrl = 'http://dzitskiy.ru:5000/Auth/';

    token = signal<string | null>(this.cookieService.get('token') || null);

    get isAuth() {
        return !!this.token();
    }

    private redirectUrl: string | null = null;

    setRedirectUrl(url: string) {
        this.redirectUrl = url;
    }

    getRedirectUrl() {
        return this.redirectUrl;
    }

    clearRedirectUrl() {
        this.redirectUrl = null;
    }

    login(payload: { login: string; password: string }) {
        return this.http
            .post<string>(`${this.baseApiUrl}Login`, payload)
            .pipe(tap((val) => this.saveTokens(val)));
    }

    saveTokens(res: string) {
        this.token.set(res);
        this.cookieService.set('token', res);

        if (this.redirectUrl) {
            this.router.navigateByUrl(this.redirectUrl);
            this.clearRedirectUrl();
        } else {
            this.router.navigate(['']);
        }
    }

    logout() {
        this.cookieService.delete('token');
        this.token.set(null);
        this.router.navigate(['']);
    }

    openLoginDialog() {
        this.loginDialogOpen.set(true);
    }

    closeLoginDialog() {
        this.loginDialogOpen.set(false);
    }
}
