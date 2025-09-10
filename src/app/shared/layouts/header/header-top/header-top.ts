import { Component, inject } from '@angular/core';
import { AuthService, AuthStateService } from '@app/core/auth/services';
import { SvgIcon } from '@app/shared/components';
import { LoginDialogService } from '@app/shared/services';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header-top',
    imports: [SvgIcon, ButtonModule, RouterLink],
    templateUrl: './header-top.html',
    styleUrl: './header-top.scss',
})
export class HeaderTop {
    authService = inject(AuthService);
    authStateService = inject(AuthStateService);
    loginDialogService = inject(LoginDialogService);
}
