import { Component, input } from '@angular/core';
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
    pageType = input.required<PageType>();
    adverts = input.required<ShortAdvert[]>();
    isLoading = input<boolean>(false);

    catName = input<string | null | undefined>(null);
    authorName = input<string | null>(null);
    newBtn = input<boolean>(false);
}
