import { Component, input, output } from '@angular/core';
import { ShortAdvert } from '@app/pages/adverts-list/domains';
import { AdTitle, AdSidebarFilters, AdTopFilters, Spinner, AdGrid } from '@app/shared/components';

export type PageType = 'favAds' | 'myAds' | 'authorAds' | 'filteredAds';

@Component({
    selector: 'app-adverts-page',
    imports: [AdTitle, AdSidebarFilters, AdTopFilters, Spinner, AdGrid],
    templateUrl: './adverts-page.html',
    styleUrl: './adverts-page.scss',
})
export class AdvertsPage {
    readonly pageType = input.required<PageType>();
    readonly adverts = input.required<ShortAdvert[]>();
    readonly isLoading = input<boolean>(false);

    readonly catName = input<string | null | undefined>(null);
    readonly authorName = input<string | null>(null);
    readonly newBtn = input<boolean>(false);

    readonly addFavorite = output<{ advertId: string }>();
    readonly removeFavorite = output<{ advertId: string }>();
    readonly deleteAdvert = output<{ advertId: string }>();
}
