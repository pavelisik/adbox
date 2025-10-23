import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoginRequest, AuthRegisterRequest } from '@app/core/auth/domains';
import { AuthFacade } from '@app/core/auth/services';
import { NotificationService } from '@app/core/notification';
import { AuthApiService } from '@app/infrastructure/authorization/services';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly apiService = inject(AuthApiService);
    private readonly authFacade = inject(AuthFacade);
    private readonly notify = inject(NotificationService);
    private readonly router = inject(Router);

    login(params: AuthLoginRequest, rememberMe: boolean): Observable<string> {
        return this.apiService.login(params).pipe(
            tap((val) => {
                this.authFacade.saveToken(val, rememberMe);
                this.authFacade.redirectAfterLogin();
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

    confirmPassword(params: AuthLoginRequest): Observable<string> {
        return this.apiService.login(params).pipe(
            tap(() => {
                this.notify.success('Подтверждение', 'Проверка пароля прошла успешно');
            }),
        );
    }

    logout() {
        this.authFacade.deleteToken();
        this.router.navigate(['']);
        this.notify.info('Авторизация', 'Вы вышли из системы');
    }
}
