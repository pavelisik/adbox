import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserDTO } from '@app/infrastructure/users/dto';
import { UserFromDTOAdapter } from '@app/infrastructure/users/adapters';
import { User } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UsersApiService {
    private readonly http = inject(HttpClient);

    currentUser(): Observable<User> {
        return this.http
            .get<UserDTO>(`${environment.baseApiURL}/Users/current`)
            .pipe(map((res) => UserFromDTOAdapter(res)));
    }
}
