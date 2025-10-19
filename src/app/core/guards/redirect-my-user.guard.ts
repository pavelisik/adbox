import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService, UserFacade } from '@app/core/auth/services';
import { filter, map, take } from 'rxjs';

export const redirectMyUser: CanActivateFn = (route) => {
    const authStateService = inject(AuthStateService);
    const userFacade = inject(UserFacade);
    const router = inject(Router);

    const userId = route.paramMap.get('id');

    if (!authStateService.isAuth()) return true;

    return toObservable(userFacade.currentUser).pipe(
        filter(Boolean),
        take(1),
        map((currentUser) => {
            if (currentUser.id === userId) {
                return router.createUrlTree(['/user/adverts']);
            }

            return true;
        }),
    );
};
