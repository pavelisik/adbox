import { computed, inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private readonly cookieService = inject(CookieService);
    readonly token = signal<string | null>(this.cookieService.get('token') || null);

    readonly isAuth = computed(() => !!this.token());

    saveToken(token: string, rememberMe: boolean) {
        this.token.set(token);
        if (rememberMe) {
            this.cookieService.set('token', token, 30);
        } else {
            this.cookieService.set('token', token);
        }
    }

    deleteToken() {
        this.token.set(null);
        this.cookieService.delete('token');
    }
}
