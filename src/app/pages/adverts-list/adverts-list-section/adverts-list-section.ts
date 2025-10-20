import { Component, computed, input } from '@angular/core';
import { ShortAdvert } from '@app/pages/adverts-list/domains';
import { AdGrid } from '../../../shared/components/ad-grid/ad-grid';
import { Spinner } from '@app/shared/components';
import { AdGridSkeleton } from '@app/shared/components/skeletons';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-adverts-list-section',
    imports: [AdGrid, Spinner, AdGridSkeleton, RouterLink],
    templateUrl: './adverts-list-section.html',
    styleUrl: './adverts-list-section.scss',
})
export class AdvetsListSection {
    adverts = input<ShortAdvert[] | undefined>(undefined);
    title = input<string | null>(null);
    count = input<number | undefined>(undefined);
    isLoading = input<boolean>(false);
    newBtn = input<boolean>(false);
    link = input<string | null>(null);
}
