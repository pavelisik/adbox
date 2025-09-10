import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoginRequestToDTOAdapter } from '@app/core/auth/adapters';
import { AuthLoginRequest } from '@app/core/auth/domains';
import { AuthStateService } from '@app/core/auth/services';
import { AuthApiService } from '@app/infrastructure/authorization/services';
import { LoginDialogService } from '@app/shared/services';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly apiService = inject(AuthApiService);
    private readonly authStateService = inject(AuthStateService);
    private readonly loginDialogService = inject(LoginDialogService);
    router = inject(Router);

    login(params: AuthLoginRequest): Observable<string> {
        const request = AuthLoginRequestToDTOAdapter(params);
        return this.apiService.login(request).pipe(
            tap((val) => {
                this.authStateService.saveToken(val);
                this.loginDialogService.loginRedirect();
            })
        );
    }

    logout() {
        this.authStateService.deleteToken();
        this.router.navigate(['']);
    }
}
