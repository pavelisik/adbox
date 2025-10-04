import { Component, inject, input } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PhoneFormatPipe } from '@app/shared/pipes';
import { DialogService } from '@app/core/dialog';

@Component({
    selector: 'app-info-dialog',
    imports: [DividerModule, PhoneFormatPipe],
    templateUrl: './info-dialog.html',
    styleUrl: './info-dialog.scss',
})
export class InfoDialog {
    dialogService = inject(DialogService);
    userName = input<string>('');
    phoneNumber = input<string>('');
}
