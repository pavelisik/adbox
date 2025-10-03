import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AuthLoginRequestDTO, AuthRegisterRequestDTO } from '@app/infrastructure/authorization/dto';
import {
    AuthLoginRequestToDTOAdapter,
    AuthRegisterRequestToDTOAdapter,
} from '@app/infrastructure/authorization/adapters';
import { AuthLoginRequest, AuthRegisterRequest } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private readonly http = inject(HttpClient);

    login(params: AuthLoginRequest): Observable<string> {
        const request: AuthLoginRequestDTO = AuthLoginRequestToDTOAdapter(params);
        return this.http.post<string>(`${environment.baseApiURL}/Auth/Login`, request);
    }

    register(params: AuthRegisterRequest): Observable<string> {
        const request: AuthRegisterRequestDTO = AuthRegisterRequestToDTOAdapter(params);
        return this.http.post<string>(`${environment.baseApiURL}/Auth/Register`, request);
    }
}
