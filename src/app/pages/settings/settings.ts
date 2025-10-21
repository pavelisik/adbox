import { Component, effect, inject } from '@angular/core';
import { UserFacade } from '@app/core/auth/services';
import { ConfirmService, PasswordConfirmService } from '@app/core/confirmation';
import { DialogService } from '@app/core/dialog';
import { PasswordForm, SettingsForm } from '@app/pages/settings/components';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-settings',
    imports: [SettingsForm, PasswordForm, ButtonModule],
    templateUrl: './settings.html',
    styleUrl: './settings.scss',
})
export class Settings {
    private readonly userFacade = inject(UserFacade);
    private readonly confirm = inject(ConfirmService);
    private readonly passwordConfirmService = inject(PasswordConfirmService);
    private readonly dialogService = inject(DialogService);

    readonly currentUser = this.userFacade.currentUser;
    readonly isDeleteLoading = this.userFacade.isDeleteLoading;

    constructor() {
        effect(() => {
            const isPasswordConfirmed = this.passwordConfirmService.isPasswordConfirmed();
            const activeForm = this.passwordConfirmService.activeForm();

            if (isPasswordConfirmed && activeForm === 'deleteUser') {
                this.onDeleteUser();
                this.passwordConfirmService.reset();
            }
        });
    }

    onPasswordConfirm() {
        this.passwordConfirmService.setActiveForm('deleteUser');
        this.dialogService.open('password');
    }

    private onDeleteUser() {
        const userId = this.currentUser()?.id;
        if (!userId) return;

        this.confirm.confirm('deleteUser', () => {
            this.userFacade.deleteUser(userId);
        });
    }
}
