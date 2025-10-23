import { Component, inject } from '@angular/core';
import { AuthFacade, AuthService, UserFacade } from '@app/core/auth/services';
import { SvgIcon } from '@app/shared/components';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmService } from '@app/core/confirmation';
import { DialogService } from '@app/core/dialog';

@Component({
    selector: 'app-top-bar',
    imports: [SvgIcon, ButtonModule, RouterLink, TieredMenuModule, ProgressSpinnerModule],
    templateUrl: './top-bar.html',
    styleUrl: './top-bar.scss',
})
export class TopBar {
    private readonly authService = inject(AuthService);
    private readonly authFacade = inject(AuthFacade);
    private readonly userFacade = inject(UserFacade);
    private readonly dialogService = inject(DialogService);
    private readonly confirm = inject(ConfirmService);

    readonly isAuth = this.authFacade.isAuth;
    readonly currentUser = this.userFacade.currentUser;

    menuItems: MenuItem[] = [
        { label: 'Мои объявления', routerLink: '/user/adverts' },
        { label: 'Избранное', routerLink: '/user/favorites' },
        { label: 'Настройки', routerLink: '/user/settings' },
        {
            label: 'Выйти',
            command: () => {
                this.confirm.confirm('logout', () => this.authService.logout());
            },
            styleClass: 'p-tieredmenu-item-logout',
        },
    ];

    openLoginDialog() {
        this.dialogService.open('login');
    }

    openRegisterDialog() {
        this.dialogService.open('register');
    }
}
