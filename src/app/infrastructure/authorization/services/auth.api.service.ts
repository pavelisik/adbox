import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AuthLoginRequestDTO, AuthRegisterRequestDTO } from '@app/infrastructure/authorization/dto';
import { AuthLoginRequestToDTOAdapter } from '@app/infrastructure/authorization/adapters';
import { AuthLoginRequest } from '@app/core/auth/domains';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private readonly http = inject(HttpClient);

    login(params: AuthLoginRequest): Observable<string> {
        const request: AuthLoginRequestDTO = AuthLoginRequestToDTOAdapter(params);
        return this.http.post<string>(`${environment.baseApiURL}/Auth/Login`, request);
    }

    register(params: AuthRegisterRequestDTO): Observable<void> {
        return this.http.post<void>(`${environment.baseApiURL}/Auth/Register`, params);
    }
}
