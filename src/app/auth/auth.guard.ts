import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/auth-service';

export const canActivateAuth: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuth) {
        return true;
    }

    // сохраняем url на который хотим попасть
    authService.redirectUrl.set(state.url);
    authService.openLoginDialog();

    return router.createUrlTree(['']);
};
