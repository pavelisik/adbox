import { DestroyRef, effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService, UsersService, UsersStoreService } from '@app/core/auth/services';
import { catchError, of, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersFacade {
    private readonly authState = inject(AuthStateService);
    private readonly usersService = inject(UsersService);
    private readonly usersStore = inject(UsersStoreService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        effect(() => {
            // выполняем запрос на получение текущего пользователя только если авторизованы
            if (this.authState.isAuth()) {
                this.usersService
                    .currentUser()
                    .pipe(
                        tap((user) => this.usersStore.setCurrentUser(user)),
                        catchError(() => {
                            this.usersStore.clearCurrentUser();
                            return of(null);
                        }),
                        takeUntilDestroyed(this.destroyRef),
                    )
                    .subscribe();
            } else {
                this.usersStore.clearCurrentUser();
            }
        });
    }

    readonly currentUser = this.usersStore.currentUser;
}
