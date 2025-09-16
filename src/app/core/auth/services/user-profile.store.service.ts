import { inject, Injectable, signal } from '@angular/core';
import { UsersApiService } from '@app/infrastructure/users/services';
import { catchError, Observable, tap, throwError, EMPTY, of } from 'rxjs';
import { User } from '@app/core/auth/domains';
import { AuthService } from '@app/core/auth/services';

@Injectable({
    providedIn: 'root',
})
export class UserProfileStoreService {
    private readonly apiService = inject(UsersApiService);
    private readonly authService = inject(AuthService);
    userProfile = signal<User | null>(null);

    currentUser(): Observable<User> {
        return this.apiService.currentUser();
    }
}
