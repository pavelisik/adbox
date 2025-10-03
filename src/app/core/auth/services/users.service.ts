import { inject, Injectable } from '@angular/core';
import { UsersApiService } from '@app/infrastructure/users/services';
import { Observable, tap } from 'rxjs';
import { ShortUser, User, UserUpdateRequest } from '@app/core/auth/domains';
import { NotificationService } from '@app/core/notification';
import { UsersStoreService } from '@app/core/auth/services/users.store.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private readonly apiService = inject(UsersApiService);
    private readonly usersStore = inject(UsersStoreService);
    private readonly notify = inject(NotificationService);

    currentUser(): Observable<User> {
        return this.apiService.currentUser();
    }

    updateUser(id: string, params: UserUpdateRequest): Observable<ShortUser> {
        return this.apiService.updateUser(id, params).pipe(
            tap((userData) => {
                this.updateCurrentUser(userData);
                this.notify.success('Обновление данных', 'Данные пользователя успешно изменены');
            }),
        );
    }

    private updateCurrentUser(userData: ShortUser) {
        const current = this.usersStore.currentUser();
        if (current) {
            this.usersStore.setCurrentUser({
                ...current,
                name: userData.name,
                login: userData.login,
            });
        }
    }
}
