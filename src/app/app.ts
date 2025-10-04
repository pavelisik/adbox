import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogContainer } from '@app/shared/dialogs';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule, DialogContainer],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {}
