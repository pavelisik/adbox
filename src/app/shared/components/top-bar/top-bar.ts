import { Component, inject } from '@angular/core';
import { AuthService, AuthStateService, UsersFacade } from '@app/core/auth/services';
import { SvgIcon } from '@app/shared/components';
import { LoginDialogService, RegisterDialogService } from '@app/shared/services';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-top-bar',
    imports: [SvgIcon, ButtonModule, RouterLink, TieredMenuModule, ProgressSpinnerModule],
    templateUrl: './top-bar.html',
    styleUrl: './top-bar.scss',
})
export class TopBar {
    private readonly authService = inject(AuthService);
    private readonly authStateService = inject(AuthStateService);
    private readonly usersFacade = inject(UsersFacade);
    private readonly loginDialogService = inject(LoginDialogService);
    private readonly registerDialogService = inject(RegisterDialogService);

    readonly isAuth = this.authStateService.isAuth;
    readonly currentUser = this.usersFacade.currentUser;

    menuItems: MenuItem[] = [
        { label: 'Мои объявления', routerLink: '/user/adverts' },
        { label: 'Настройки', routerLink: '/user/settings' },
        {
            label: 'Выйти',
            command: () => this.authService.logout(),
            styleClass: 'p-tieredmenu-item-logout',
        },
    ];

    openLoginDialog() {
        this.loginDialogService.openLoginDialog();
    }

    openRegisterDialog() {
        this.registerDialogService.openRegisterDialog();
    }
}
