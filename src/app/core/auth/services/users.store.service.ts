import { inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService, UsersService } from '@app/core/auth/services';
import { of, shareReplay, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersStoreService {
    private readonly usersService = inject(UsersService);
    private readonly authStateService = inject(AuthStateService);

    // выполняем запрос на получение текущего пользователя только если авторизованы
    private readonly currentUser$ = toObservable(this.authStateService.isAuth).pipe(
        switchMap((isAuth) => (isAuth ? this.usersService.currentUser() : of(null))),
        shareReplay(1),
    );

    readonly currentUser = toSignal(this.currentUser$, { initialValue: null });
}
