import { Component, inject } from '@angular/core';
import { AuthService, AuthStateService, UserProfileStoreService } from '@app/core/auth/services';
import { SvgIcon } from '@app/shared/components';
import { LoginDialogService } from '@app/shared/services';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-header-top',
    imports: [SvgIcon, ButtonModule, RouterLink, AsyncPipe, TieredMenuModule],
    templateUrl: './header-top.html',
    styleUrl: './header-top.scss',
})
export class HeaderTop {
    authService = inject(AuthService);
    authStateService = inject(AuthStateService);
    userProfileStoreService = inject(UserProfileStoreService);
    loginDialogService = inject(LoginDialogService);

    currentUser$ = this.userProfileStoreService.currentUser();

    // переделать в виде шаблона наверное
    items: MenuItem[] = [];
    ngOnInit() {
        this.items = [
            { label: 'Мои объявления', routerLink: '/user/profile' },
            { label: 'Настройки', routerLink: '/user/settings' },
            { label: 'Выйти', command: () => this.authService.logout() },
        ];
    }
}
