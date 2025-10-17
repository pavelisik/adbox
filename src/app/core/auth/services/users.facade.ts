import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
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
    private readonly usersStore = inject(UsersStoreService);
    private readonly usersService = inject(UsersService);
    private readonly localUserStore = inject(LocalUserStoreService);
    private readonly localUserService = inject(LocalUserService);
    private readonly destroyRef = inject(DestroyRef);

    readonly authUser = this.usersStore.authUser;
    readonly localUser = this.localUserStore.localUser;

    private readonly refreshAuthUserTrigger = signal<number>(0);

    readonly currentUser = computed<FullUser | null>(() => {
        const user = this.authUser();
        const localUserData = this.localUser();
        return user ? { ...user, ...localUserData } : null;
    });

    constructor() {
        effect(() => {
            const isAuth = this.authState.isAuth();
            const refresh = this.refreshAuthUserTrigger();

            // выполняем запрос на получение текущего пользователя только если авторизованы
            if (isAuth) {
                this.usersService
                    .authUser()
                    .pipe(
                        tap((user) => {
                            this.usersStore.set(user);
                            this.localUserService.loadDataFromCookie(user.id);
                        }),
                        catchError(() => {
                            this.usersStore.clear();
                            this.localUserService.clearStore();
                            return of(null);
                        }),
                        takeUntilDestroyed(this.destroyRef),
                    )
                    .subscribe();
            } else {
                this.usersStore.clear();
                // по хорошему локальные данные надо из кукис тоже удалять, но они отсутствуют на сервере
                this.localUserService.clearStore();
            }
        });
    }

    // принудительно обновляем текущего пользователя новым запросом на сервер
    refreshAuthUser(): void {
        this.refreshAuthUserTrigger.update((v) => v + 1);
    }
}
