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

    loginDialogOpen = signal<boolean>(false);
    redirectUrl = signal<string | null>(null);
    baseApiUrl = 'http://dzitskiy.ru:5000/Auth/';

    token = signal<string | null>(this.cookieService.get('token') || null);

    get isAuth() {
        return !!this.token();
    }

    login(payload: { login: string; password: string }) {
        return this.http
            .post<string>(`${this.baseApiUrl}Login`, payload)
            .pipe(tap((val) => this.saveToken(val)));
    }

    saveToken(res: string) {
        this.token.set(res);
        this.cookieService.set('token', res);

        const url = this.redirectUrl();

        if (url) {
            this.router.navigateByUrl(url);
            this.redirectUrl.set(null);
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
