import { AuthService, AuthStateService } from '@app/core/auth/services';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
    });
};

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const authStateService = inject(AuthStateService);
    const token = authStateService.token();

    // игнорируем запросы
    if (
        req.url.includes('/Auth/Login') ||
        req.url.includes('/Auth/Register') ||
        req.url.includes('dadata.ru')
    ) {
        return next(req);
    }

    if (token) {
        return next(addToken(req, token)).pipe(
            catchError((error: HttpErrorResponse) => {
                // если токен просроченый разлогиниваем принудительно
                if ((error.status === 0 && !!token) || (error.status === 401 && !!token)) {
                    authService.logout();
                    return throwError(() => error);
                }
                return throwError(() => error);
            }),
        );
    }

    return next(req);
};
