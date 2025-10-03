import { effect, inject, Injectable } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService, UsersService, UsersStoreService } from '@app/core/auth/services';
import { take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersFacade {
    private readonly authState = inject(AuthStateService);
    private readonly usersService = inject(UsersService);
    private readonly usersStore = inject(UsersStoreService);

    constructor() {
        effect(() => {
            // выполняем запрос на получение текущего пользователя только если авторизованы
            if (this.authState.isAuth()) {
                this.usersService.currentUser().subscribe({
                    next: (user) => this.usersStore.setCurrentUser(user),
                    error: () => this.usersStore.clearCurrentUser(),
                });
            } else {
                this.usersStore.clearCurrentUser();
            }
        });
    }

    readonly currentUser = this.usersStore.currentUser;
}
