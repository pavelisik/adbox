import { Component, input } from '@angular/core';
import type { ShortAdvert } from '@app/pages/adverts-list/domains';
import { AdGridItem } from './ad-grid-item/ad-grid-item';

@Component({
    selector: 'app-ad-grid',
    imports: [AdGridItem],
    templateUrl: './ad-grid.html',
    styleUrl: './ad-grid.scss',
})
export class AdGrid {
    adverts = input<ShortAdvert[]>([]);
    width = input<'full' | 'short'>('full');
}
