import { Component, Input } from '@angular/core';
import type { ShortAdvert } from '@app/pages/adverts-list/domains';
import { AdGridItem } from '@app/shared/components/ad-grid-item/ad-grid-item';

@Component({
    selector: 'app-ad-grid',
    imports: [AdGridItem],
    templateUrl: './ad-grid.html',
    styleUrl: './ad-grid.scss',
})
export class AdGrid {
    @Input() adverts: ShortAdvert[] = [];
    @Input() width: 'full' | 'short' = 'full';
}
