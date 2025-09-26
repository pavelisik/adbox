import { AuthStateService } from '@app/core/auth/services';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
    });
};

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authStateService = inject(AuthStateService);
    const token = authStateService.token();

    // игнорируем запросы авторизации и регистрации
    if (req.url.includes('/Auth/Login') || req.url.includes('/Auth/Register')) {
        return next(req);
    }

    if (token) {
        return next(addToken(req, token));
    }

    return next(req);
};
