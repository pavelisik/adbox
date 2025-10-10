import { computed, DestroyRef, effect, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    AuthStateService,
    LocalUserStoreService,
    UsersService,
    UsersStoreService,
} from '@app/core/auth/services';
import { LocalUserService } from './local-user.service';
import { catchError, of, tap } from 'rxjs';
import { FullUser } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UsersFacade {
    private readonly authState = inject(AuthStateService);
    private readonly usersService = inject(UsersService);
    private readonly usersStore = inject(UsersStoreService);
    private readonly localUserService = inject(LocalUserService);
    private readonly localUserStore = inject(LocalUserStoreService);
    private readonly destroyRef = inject(DestroyRef);

    readonly authUser = this.usersStore.authUser;
    readonly localUser = this.localUserStore.localUser;

    readonly currentUser = computed<FullUser | null>(() => {
        const user = this.authUser();
        const localUserData = this.localUser();
        return user ? { ...user, ...localUserData } : null;
    });

    constructor() {
        effect(() => {
            // выполняем запрос на получение текущего пользователя только если авторизованы
            if (this.authState.isAuth()) {
                this.usersService
                    .authUser()
                    .pipe(
                        tap((user) => {
                            this.usersStore.setAuthUser(user);
                            this.localUserService.loadDataFromCookie(user.id);
                        }),
                        catchError(() => {
                            this.usersStore.clearAuthUser();
                            this.localUserService.clearStore();
                            return of(null);
                        }),
                        takeUntilDestroyed(this.destroyRef),
                    )
                    .subscribe();
            } else {
                this.usersStore.clearAuthUser();
                // по хорошему локальные данные надо из кукис тоже удалять, но они отсутствуют на сервере
                this.localUserService.clearStore();
            }
        });
    }
}
