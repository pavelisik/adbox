import { inject, Injectable, signal } from '@angular/core';
import { UserFromDTOAdapter } from '@app/core/auth/adapters/user.adapter';
import { User } from '@app/core/auth/domains';
import { UsersApiService } from '@app/infrastructure/users/services';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserProfileStoreService {
    private readonly apiService = inject(UsersApiService);
    userProfile = signal<User | null>(null);

    currentUser(): Observable<User> {
        return this.apiService.currentUser().pipe(map((res) => UserFromDTOAdapter(res)));
    }
}
