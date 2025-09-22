import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private readonly cookieService = inject(CookieService);
    readonly token = signal<string | null>(this.cookieService.get('token') || null);
    readonly isOnProtectedRoute = signal<boolean>(false);

    get isAuth() {
        return !!this.token();
    }

    saveToken(token: string) {
        this.token.set(token);
        this.cookieService.set('token', token);
    }

    deleteToken() {
        this.token.set(null);
        this.cookieService.delete('token');
    }
}
