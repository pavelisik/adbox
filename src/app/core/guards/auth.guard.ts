import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';

export const canActivateAuth: CanActivateFn = (route, state) => {
    const authStateService = inject(AuthStateService);
    const dialogService = inject(DialogService);
    const router = inject(Router);

    if (authStateService.isAuth()) {
        return true;
    }

    // сохраняем url на который хотим попасть
    authStateService.setRedirectUrl(state.url);
    dialogService.open('login');

    return router.createUrlTree(['']);
};
