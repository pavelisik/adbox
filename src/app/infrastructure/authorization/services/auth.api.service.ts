import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthLoginRequestDTO, AuthRegisterRequestDTO } from '../dto';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthApiService {
    private readonly http = inject(HttpClient);

    login(params: AuthLoginRequestDTO): Observable<string> {
        return this.http.post<string>(`${environment.baseApiURL}/Auth/Login`, params);
    }

    register(params: AuthRegisterRequestDTO): Observable<void> {
        return this.http.post<void>(`${environment.baseApiURL}/Auth/Register`, params);
    }
}
