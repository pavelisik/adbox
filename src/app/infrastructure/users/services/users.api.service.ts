import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { UserDTO } from '@app/infrastructure/users/dto';

@Injectable({
    providedIn: 'root',
})
export class UsersApiService {
    private readonly http = inject(HttpClient);

    currentUser(): Observable<UserDTO> {
        return this.http.get<UserDTO>(`${environment.baseApiURL}/Users/current`);
    }
}
