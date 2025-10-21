import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    AuthService,
    AuthStateService,
    LocalUserStateService,
    UserService,
    UserStateService,
} from '@app/core/auth/services';
import { LocalUserService } from './local-user.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { FullUser } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UserFacade {
    private readonly authState = inject(AuthStateService);
    private readonly userStateService = inject(UserStateService);
    private readonly userService = inject(UserService);
    private readonly authService = inject(AuthService);
    private readonly localUserState = inject(LocalUserStateService);
    private readonly localUserService = inject(LocalUserService);
    private readonly destroyRef = inject(DestroyRef);

    readonly authUser = this.userStateService.authUser;
    readonly localUser = this.localUserState.localUser;

    private readonly refreshAuthUserTrigger = signal<number>(0);

    readonly isLoading = signal<boolean>(false);
    readonly isDeleteLoading = signal<boolean>(false);

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
                this.isLoading.set(true);

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
                        finalize(() => this.isLoading.set(false)),
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

    // проверка, добавлено ли объявление в избранное
    isAdvertInFavorites(advertId: string): boolean {
        return this.currentUser()?.favoritesAdverts?.includes(advertId) ?? false;
    }

    // сохранение объявления в избранное
    addAdvertToFavorite(advertId: string) {
        const user = this.currentUser();
        if (!user) return;

        const favoritesAdverts = new Set(user.favoritesAdverts ?? []);
        favoritesAdverts.add(advertId);

        this.localUserService.updateData(user.id, {
            favoritesAdverts: Array.from(favoritesAdverts),
        });
    }

    // удаление объявления из избранного
    removeAdvertFromFavorite(advertId: string) {
        const user = this.currentUser();
        if (!user) return;

        const favoritesAdverts = new Set(user.favoritesAdverts ?? []);
        favoritesAdverts.delete(advertId);

        this.localUserService.updateData(user.id, {
            favoritesAdverts: Array.from(favoritesAdverts),
        });
    }

    deleteUser(userId: string) {
        this.isDeleteLoading.set(true);

        this.userService
            .deleteUser(userId)
            .pipe(
                tap(() => {
                    this.authService.logout();
                }),
                catchError((error) => {
                    console.error(error);
                    return of(null);
                }),
                finalize(() => this.isDeleteLoading.set(false)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
