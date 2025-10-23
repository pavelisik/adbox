import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '@app/core/auth/services';
import { DialogService } from '@app/core/dialog';

export const canActivateAuth: CanActivateFn = (route, state) => {
    const authFacade = inject(AuthFacade);
    const dialogService = inject(DialogService);
    const router = inject(Router);

    if (authFacade.isAuth()) {
        return true;
    }

    // сохраняем url на который хотим попасть
    authFacade.setRedirectUrl(state.url);

    dialogService.skipNextClose();
    dialogService.open('login');

    return router.createUrlTree(['']);
};
