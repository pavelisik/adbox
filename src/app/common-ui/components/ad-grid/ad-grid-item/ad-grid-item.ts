import { Component, Input } from '@angular/core';
import type { AdvertDemo } from '@app/data/interfaces/advert';

@Component({
    selector: 'li[app-ad-grid-item]',
    imports: [],
    templateUrl: './ad-grid-item.html',
    styleUrl: './ad-grid-item.scss',
})
export class AdGridItem {
    @Input() advert: AdvertDemo | null = null;
}
