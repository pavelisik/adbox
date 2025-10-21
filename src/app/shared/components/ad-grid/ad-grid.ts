import { Component, input, output } from '@angular/core';
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
    readonly adverts = input<ShortAdvert[]>([]);
    readonly width = input<'full' | 'short'>('full');
    readonly newBtn = input<boolean>(false);

    readonly addFavorite = output<{ advertId: string }>();
    readonly removeFavorite = output<{ advertId: string }>();
    readonly deleteAdvert = output<{ advertId: string }>();
}
