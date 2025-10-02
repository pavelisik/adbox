import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginDialog, RegisterDialog } from '@app/shared/dialogs';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoginDialog, RegisterDialog, ToastModule, ConfirmDialogModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {}
