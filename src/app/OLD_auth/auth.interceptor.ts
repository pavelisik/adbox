import { AuthService } from '@app/core/auth/services';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
    });
};

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.token();

    if (req.url.includes('/Auth/Login')) {
        return next(req);
    }

    if (token) {
        return next(addToken(req, token));
    }

    return next(req);
};
