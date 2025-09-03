import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AdGrid } from '@app/common-ui/components/ad-grid/ad-grid';
import { AdvertService } from '@app/data/services/advert-service';

@Component({
    selector: 'app-home-page',
    imports: [ButtonModule, AdGrid, AsyncPipe],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
})
export class HomePage {
    advertService = inject(AdvertService);

    advert$ = this.advertService.getAdvert('24fefe92-753f-48fb-99c6-5ba7f5060ad6');
}
