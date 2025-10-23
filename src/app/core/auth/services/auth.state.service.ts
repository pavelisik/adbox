import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private readonly _token = signal<string | null>(null);
    private readonly _redirectUrl = signal<string | null>(null);

    readonly token = this._token.asReadonly();
    readonly redirectUrl = this._redirectUrl.asReadonly();
    readonly isAuth = computed(() => !!this._token());

    setToken(token: string | null): void {
        this._token.set(token);
    }

    setRedirectUrl(url: string | null) {
        this._redirectUrl.set(url);
    }

    clearToken() {
        this._token.set(null);
    }

    clearRedirectUrl() {
        this._redirectUrl.set(null);
    }
}
