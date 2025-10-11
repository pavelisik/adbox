import { inject, Injectable } from '@angular/core';
import { UsersApiService } from '@app/infrastructure/users/services';
import { Observable, tap } from 'rxjs';
import { ShortUser, User, UserUpdateRequest } from '@app/core/auth/domains';
import { NotificationService } from '@app/core/notification';
import { UsersStoreService } from './users.store.service';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private readonly apiService = inject(UsersApiService);
    private readonly usersStore = inject(UsersStoreService);
    private readonly notify = inject(NotificationService);

    authUser(): Observable<User> {
        return this.apiService.authUser();
    }

    updateUser(id: string, params: UserUpdateRequest): Observable<ShortUser> {
        return this.apiService.updateUser(id, params).pipe(
            tap((userData) => {
                this.notify.success('Обновление данных', 'Данные пользователя успешно изменены');
            }),
        );
    }
}
