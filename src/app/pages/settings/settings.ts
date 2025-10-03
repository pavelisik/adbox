import { Component } from '@angular/core';
import { PasswordForm, SettingsForm } from '@app/pages/settings/components';

@Component({
    selector: 'app-settings',
    imports: [SettingsForm, PasswordForm],
    templateUrl: './settings.html',
    styleUrl: './settings.scss',
})
export class Settings {}
