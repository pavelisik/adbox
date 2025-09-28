import { Component, inject } from '@angular/core';
import { AuthService, AuthStateService, UsersStoreService } from '@app/core/auth/services';
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
    authService = inject(AuthService);
    authStateService = inject(AuthStateService);
    usersStoreService = inject(UsersStoreService);
    loginDialogService = inject(LoginDialogService);
    registerDialogService = inject(RegisterDialogService);

    readonly currentUser = this.usersStoreService.currentUser;

    menuItems: MenuItem[] = [
        { label: 'Мои объявления', routerLink: '/user/profile' },
        { label: 'Настройки', routerLink: '/user/settings' },
        {
            label: 'Выйти',
            command: () => this.authService.logout(),
            styleClass: 'menu-item-logout',
        },
    ];
}
