import { inject, Injectable } from '@angular/core';
import { UsersApiService } from '@app/infrastructure/users/services';
import { Observable, tap } from 'rxjs';
import { ShortUser, User, UserUpdateRequest } from '@app/core/auth/domains';
import { NotificationService } from '@app/core/notification';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly apiService = inject(UsersApiService);
    private readonly notify = inject(NotificationService);

    authUser(): Observable<User> {
        return this.apiService.currentUser();
    }

    updateUser(id: string, params: UserUpdateRequest): Observable<ShortUser> {
        return this.apiService.updateUser(id, params).pipe(
            tap((userData) => {
                this.notify.success('Обновление данных', 'Данные пользователя успешно изменены');
            }),
        );
    }

    getUser(id: string): Observable<User> {
        return this.apiService.getUser(id);
    }

    deleteUser(id: string): Observable<void> {
        return this.apiService.deleteUser(id).pipe(
            tap(() => {
                this.notify.success('Удаление пользователя', 'Пользователь успешно удален');
            }),
        );
    }
}
