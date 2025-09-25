import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoginRequest, AuthRegisterRequest } from '@app/core/auth/domains';
import { AuthStateService } from '@app/core/auth/services';
import { NotificationService } from '@app/core/notification';
import { AuthApiService } from '@app/infrastructure/authorization/services';
import { LoginDialogService } from '@app/shared/services';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly apiService = inject(AuthApiService);
    private readonly authStateService = inject(AuthStateService);
    private readonly loginDialogService = inject(LoginDialogService);
    private readonly notify = inject(NotificationService);
    router = inject(Router);

    login(params: AuthLoginRequest): Observable<string> {
        return this.apiService.login(params).pipe(
            tap((val) => {
                this.authStateService.saveToken(val);
                this.loginDialogService.loginRedirect();
                this.notify.success('Авторизация', 'Вы успешно вошли в систему');
            }),
        );
    }

    register(params: AuthRegisterRequest): Observable<string> {
        return this.apiService.register(params).pipe(
            tap(() => {
                this.notify.success('Регистрация', 'Регистрация прошла успешно');
            }),
        );
    }

    logout() {
        this.authStateService.deleteToken();
        this.router.navigate(['']);
        this.notify.info('Авторизация', 'Вы вышли из системы');
    }
}
