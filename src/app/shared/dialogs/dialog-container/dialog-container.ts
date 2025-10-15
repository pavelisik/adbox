import { Component, computed, effect, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from '@app/core/dialog';
import { InfoDialog } from '@app/shared/dialogs/info-dialog/info-dialog';
import { LoginDialog } from '@app/shared/dialogs/login-dialog/login-dialog';
import { PasswordDialog } from '@app/shared/dialogs/password-dialog/password-dialog';
import { RegisterDialog } from '@app/shared/dialogs/register-dialog/register-dialog';
import { TermsOfService } from '@app/shared/dialogs/terms-of-service/terms-of-service';
import { AddressOnMap } from '@app/shared/dialogs/address-on-map/address-on-map';
import { AdvertFacade } from '@app/shared/services';

@Component({
    selector: 'app-dialog-container',
    imports: [
        DialogModule,
        LoginDialog,
        RegisterDialog,
        PasswordDialog,
        InfoDialog,
        TermsOfService,
        AddressOnMap,
    ],
    templateUrl: './dialog-container.html',
    styleUrl: './dialog-container.scss',
})
export class DialogContainer {
    readonly dialogService = inject(DialogService);
    readonly advertFacade = inject(AdvertFacade);

    advert = this.advertFacade.advert;

    readonly visible = signal(false);

    readonly userName = computed<string>(() => this.advert()?.user.name ?? '');

    readonly header = computed(() => {
        switch (this.dialogService.current()) {
            case 'login':
                return 'Авторизация';
            case 'register':
                return 'Регистрация';
            case 'info':
                return this.userName();
            case 'password':
                return 'Подтверждение';
            case 'terms-of-service':
                return 'Правила использования';
            case 'address-on-map':
                return 'Адрес на карте';
            default:
                return '';
        }
    });

    constructor() {
        effect(() => {
            const current = this.dialogService.current();
            this.visible.set(!!current);
        });
    }

    onClose() {
        this.dialogService.close();
    }
}
