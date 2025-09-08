import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RelativeDatePipe } from '@app/helpers/pipes/relative-date-pipe';
import type { Advert } from '@app/data/interfaces/advert';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ImagesService } from '@app/data/services/images-service';
import { PricePipe } from '@app/helpers/pipes/price-pipe';

@Component({
    selector: 'li[app-ad-grid-item]',
    imports: [RelativeDatePipe, AsyncPipe, RouterLink, PricePipe],
    templateUrl: './ad-grid-item.html',
    styleUrl: './ad-grid-item.scss',
})
export class AdGridItem {
    @Input() advert: Advert | null = null;
    imagesService = inject(ImagesService);

    image$?: Observable<string>;

    ngOnInit() {
        const firstImageId = this.advert?.imagesIds?.[0];
        if (firstImageId) {
            this.image$ = this.imagesService.getImage(firstImageId);
        }
    }
}
