import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginDialog } from '@app/shared/dialogs/login-dialog/login-dialog';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoginDialog],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {}
