import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ShortUserDTO, UserDTO, UserUpdateRequestDTO } from '@app/infrastructure/users/dto';
import {
    ShortUserFromDTOAdapter,
    UserFromDTOAdapter,
    UserUpdateRequestToDTOAdapter,
} from '@app/infrastructure/users/adapters';
import { ShortUser, User, UserUpdateRequest } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class UsersApiService {
    private readonly http = inject(HttpClient);

    authUser(): Observable<User> {
        return this.http
            .get<UserDTO>(`${environment.baseApiURL}/Users/current`)
            .pipe(map((res) => UserFromDTOAdapter(res)));
    }

    updateUser(id: string, params: UserUpdateRequest): Observable<ShortUser> {
        const request: UserUpdateRequestDTO = UserUpdateRequestToDTOAdapter(params);
        const formData = new FormData();
        formData.append('Name', request.name);
        formData.append('Login', request.login);
        formData.append('Password', request.password);
        return this.http
            .put<ShortUserDTO>(`${environment.baseApiURL}/Users/${id}`, formData)
            .pipe(map((res) => ShortUserFromDTOAdapter(res)));
    }

    getUser(id: string): Observable<User> {
        return this.http
            .get<UserDTO>(`${environment.baseApiURL}/Users/${id}`)
            .pipe(map((res) => UserFromDTOAdapter(res)));
    }
}
