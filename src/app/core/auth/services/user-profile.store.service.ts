import { inject, Injectable, signal } from '@angular/core';
import { UsersApiService } from '@app/infrastructure/users/services';
import { Observable } from 'rxjs';
import { User } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UserProfileStoreService {
    private readonly apiService = inject(UsersApiService);
    userProfile = signal<User | null>(null);

    currentUser(): Observable<User> {
        return this.apiService.currentUser();
    }
}
