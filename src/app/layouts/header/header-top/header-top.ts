import { Component, inject } from '@angular/core';
import { AuthService, AuthStateService } from '@app/core/auth/services';
import { SvgIcon } from '@app/shared/components/svg-icon/svg-icon';
import { LoginDialogService } from '@app/shared/dialogs/login-dialog/services/login-dialog.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-header-top',
    imports: [SvgIcon, ButtonModule],
    templateUrl: './header-top.html',
    styleUrl: './header-top.scss',
})
export class HeaderTop {
    authService = inject(AuthService);
    authStateService = inject(AuthStateService);
    loginDialogService = inject(LoginDialogService);
}
