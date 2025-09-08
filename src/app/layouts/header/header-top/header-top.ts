import { Component, inject } from '@angular/core';
import { AuthService } from '@app/core/auth/services';
import { SvgIcon } from '@app/shared/components/svg-icon/svg-icon';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-header-top',
    imports: [SvgIcon, ButtonModule],
    templateUrl: './header-top.html',
    styleUrl: './header-top.scss',
})
export class HeaderTop {
    authService = inject(AuthService);

    openLoginDialog() {
        this.authService.openLoginDialog();
    }
}
