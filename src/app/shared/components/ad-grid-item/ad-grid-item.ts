import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ShortAdvert } from '@app/pages/adverts-list/domains';
import { RelativeDatePipe, PricePipe } from '@app/shared/pipes';
import { Image } from '@app/shared/components/image/image';
import { ImageService } from '@app/shared/services';

@Component({
    selector: 'li[app-ad-grid-item]',
    imports: [RelativeDatePipe, RouterLink, PricePipe, AsyncPipe, Image],
    templateUrl: './ad-grid-item.html',
    styleUrl: './ad-grid-item.scss',
})
export class AdGridItem {
    @Input() advert: ShortAdvert | null = null;
    imageService = inject(ImageService);

    image$: Observable<string> | null = null;

    ngOnInit() {
        const firstImageId = this.advert?.imagesIds[0];
        if (firstImageId) {
            this.image$ = this.imageService.getImage(firstImageId);
        }
    }
}
