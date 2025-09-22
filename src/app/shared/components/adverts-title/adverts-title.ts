import { Component, input } from '@angular/core';
import { AdvertsCountPipe } from '../../pipes/adverts-count.pipe';

@Component({
    selector: 'app-adverts-title',
    imports: [AdvertsCountPipe],
    templateUrl: './adverts-title.html',
    styleUrl: './adverts-title.scss',
})
export class AdvertsTitle {
    advertsCount = input<number | null>(null);
    catQuery = input<string | null>(null);
}
