import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginDialog, RegisterDialog } from '@app/shared/dialogs';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoginDialog, RegisterDialog, ToastModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {}
