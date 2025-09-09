import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@app/core/auth/services';
import { LoginDialogService } from '@app/shared/dialogs/login-dialog/services/login-dialog.service';

export const canActivateAuth: CanActivateFn = (route, state) => {
    const authStateService = inject(AuthStateService);
    const loginDialogService = inject(LoginDialogService);

    const router = inject(Router);

    if (authStateService.isAuth) {
        return true;
    }

    // сохраняем url на который хотим попасть
    loginDialogService.redirectUrl.set(state.url);
    loginDialogService.openLoginDialog();

    return router.createUrlTree(['']);
};
