import { Component, input } from '@angular/core';
import { AdvertsCountPipe } from '../../pipes/adverts-count.pipe';

@Component({
    selector: 'app-ad-title',
    imports: [AdvertsCountPipe],
    templateUrl: './ad-title.html',
    styleUrl: './ad-title.scss',
})
export class AdTitle {
    advertsCount = input<number | null>(null);
    catQuery = input<string | null>(null);
}
