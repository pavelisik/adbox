import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStateService } from '@app/core/auth/services';

export const canActivatePublic: CanActivateFn = () => {
    const authStateService = inject(AuthStateService);
    authStateService.isOnProtectedRoute.set(false);
    return true;
};
