import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ShortAdvert } from '@app/pages/adverts-list/domains';
import { DateFormatPipe, PriceFormatPipe, ImageFromIdPipe } from '@app/shared/pipes';
import { Image } from './image/image';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'li[app-ad-grid-item]',
    imports: [
        DateFormatPipe,
        RouterLink,
        PriceFormatPipe,
        AsyncPipe,
        Image,
        SkeletonModule,
        ImageFromIdPipe,
    ],
    templateUrl: './ad-grid-item.html',
    styleUrl: './ad-grid-item.scss',
})
export class AdGridItem {
    readonly advert = input<ShortAdvert | null>(null);
}
