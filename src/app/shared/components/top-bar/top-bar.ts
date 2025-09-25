import { Component, inject } from '@angular/core';
import { AuthService, AuthStateService, UserProfileStoreService } from '@app/core/auth/services';
import { SvgIcon } from '@app/shared/components';
import { LoginDialogService, RegisterDialogService } from '@app/shared/services';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-top-bar',
    imports: [
        SvgIcon,
        ButtonModule,
        RouterLink,
        AsyncPipe,
        TieredMenuModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './top-bar.html',
    styleUrl: './top-bar.scss',
})
export class TopBar {
    authService = inject(AuthService);
    authStateService = inject(AuthStateService);
    userProfileStoreService = inject(UserProfileStoreService);
    loginDialogService = inject(LoginDialogService);
    registerDialogService = inject(RegisterDialogService);

    currentUser$ = this.userProfileStoreService.currentUser();

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
