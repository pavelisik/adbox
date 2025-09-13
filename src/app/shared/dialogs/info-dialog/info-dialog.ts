import { Component, inject, input } from '@angular/core';
import { InfoDialogService } from '@app/shared/services/info-dialog.service';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { PhoneFormatPipe } from '../../pipes/phone-format.pipe';

@Component({
    selector: 'app-info-dialog',
    imports: [DialogModule, DividerModule, PhoneFormatPipe],
    templateUrl: './info-dialog.html',
    styleUrl: './info-dialog.scss',
})
export class InfoDialog {
    infoDialogService = inject(InfoDialogService);
    userName = input<string>('');
    phoneNumber = input<string>('');

    visible = this.infoDialogService.infoDialogOpen;

    onClose() {
        this.infoDialogService.closeDialog();
    }
}
