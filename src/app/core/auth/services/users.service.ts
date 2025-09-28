import { inject, Injectable } from '@angular/core';
import { UsersApiService } from '@app/infrastructure/users/services';
import { Observable } from 'rxjs';
import { User } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    private readonly apiService = inject(UsersApiService);

    currentUser(): Observable<User> {
        return this.apiService.currentUser();
    }
}
