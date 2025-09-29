import { Component, input } from '@angular/core';
import type { ShortAdvert } from '@app/pages/adverts-list/domains';
import { AdGridItem } from './ad-grid-item/ad-grid-item';
import { SvgIcon } from '@app/shared/components';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-ad-grid',
    imports: [AdGridItem, SvgIcon, RouterLink],
    templateUrl: './ad-grid.html',
    styleUrl: './ad-grid.scss',
})
export class AdGrid {
    adverts = input<ShortAdvert[]>([]);
    width = input<'full' | 'short'>('full');
    newBtn = input<boolean>(false);
}
