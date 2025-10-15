import { Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { PhoneFormatPipe } from '@app/shared/pipes';
import { DialogService } from '@app/core/dialog';
import { AdvertFacade } from '@app/shared/services';

@Component({
    selector: 'app-info-dialog',
    imports: [DividerModule, PhoneFormatPipe],
    templateUrl: './info-dialog.html',
    styleUrl: './info-dialog.scss',
})
export class InfoDialog {
    dialogService = inject(DialogService);
    advertFacade = inject(AdvertFacade);

    advert = this.advertFacade.advert;
}
