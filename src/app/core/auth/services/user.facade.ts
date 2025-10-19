import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    AuthStateService,
    LocalUserStateService,
    UserService,
    UserStateService,
} from '@app/core/auth/services';
import { LocalUserService } from './local-user.service';
import { catchError, of, tap } from 'rxjs';
import { FullUser } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UserFacade {
    private readonly authState = inject(AuthStateService);
    private readonly userStateService = inject(UserStateService);
    private readonly userService = inject(UserService);
    private readonly localUserState = inject(LocalUserStateService);
    private readonly localUserService = inject(LocalUserService);
    private readonly destroyRef = inject(DestroyRef);

    readonly authUser = this.userStateService.authUser;
    readonly localUser = this.localUserState.localUser;

    private readonly refreshAuthUserTrigger = signal<number>(0);

    isLoading = signal<boolean>(false);

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
                this.userService
                    .authUser()
                    .pipe(
                        tap((user) => {
                            this.userStateService.set(user);
                            this.localUserService.loadDataFromCookie(user.id);
                        }),
                        catchError(() => {
                            this.userStateService.clear();
                            this.localUserService.clearState();
                            return of(null);
                        }),
                        takeUntilDestroyed(this.destroyRef),
                    )
                    .subscribe();
            } else {
                this.userStateService.clear();
                // по хорошему локальные данные надо из кукис тоже удалять, но они отсутствуют на сервере
                this.localUserService.clearState();
            }
        });
    }

    // принудительно обновляем текущего пользователя новым запросом на сервер
    refreshAuthUser(): void {
        this.refreshAuthUserTrigger.update((v) => v + 1);
    }
}
