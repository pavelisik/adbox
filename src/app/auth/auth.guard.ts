import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@app/auth/auth-service';

export const canActivateAuth: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);

    if (authService.isAuth) {
        return true;
    }

    authService.setRedirectUrl(state.url);

    authService.openLoginDialog();

    return false;
};
