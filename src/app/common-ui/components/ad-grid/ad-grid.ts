import { Component, Input } from '@angular/core';
import { Advert } from '@app/data/interfaces/advert';
import { AdGridItem } from './ad-grid-item/ad-grid-item';

@Component({
    selector: 'app-ad-grid',
    imports: [AdGridItem],
    templateUrl: './ad-grid.html',
    styleUrl: './ad-grid.scss',
})
export class AdGrid {
    @Input() adverts: Advert[] = [];
    @Input() width: 'full' | 'short' = 'full';
}
