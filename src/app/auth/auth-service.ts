import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    http = inject(HttpClient);
    loginDialogOpen = signal(false);
    baseApiUrl = 'http://dzitskiy.ru:5000/Auth/';

    token: string | null = null;

    login(payload: { login: string; password: string }) {
        return this.http.post<string>(`${this.baseApiUrl}Login`, payload).pipe(
            tap((val) => {
                console.log(val);
            })
        );
    }

    openLoginDialog() {
        this.loginDialogOpen.set(true);
    }

    closeLoginDialog() {
        this.loginDialogOpen.set(false);
    }
}
