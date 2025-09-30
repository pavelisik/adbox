import { Component } from '@angular/core';
import { SettingsForm, PasswordForm } from '@app/shared/components';

@Component({
    selector: 'app-settings',
    imports: [SettingsForm, PasswordForm],
    templateUrl: './settings.html',
    styleUrl: './settings.scss',
})
export class Settings {}
