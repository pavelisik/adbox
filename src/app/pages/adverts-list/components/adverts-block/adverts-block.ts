import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdGridSkeleton } from '@app/shared/components/skeletons';
import { AdGrid } from '@app/shared/components';
import { ShortAdvert } from '@app/pages/adverts-list/domains';
import { ButtonModule } from 'primeng/button';

export type BlockType = 'favCat' | 'favAds' | 'myAds' | 'lastAds';

@Component({
    selector: 'app-adverts-block',
    imports: [RouterLink, AdGridSkeleton, AdGrid, ButtonModule],
    templateUrl: './adverts-block.html',
    styleUrl: './adverts-block.scss',
})
export class AdvertsBlock {
    blockType = input.required<BlockType>();
    adverts = input.required<ShortAdvert[]>();
    advertsCount = input.required<number>();
    isLoading = input<boolean>(false);

    favCategoryName = input<string | null>(null);
    favCategoryId = input<string | null>(null);
    isAuth = input<boolean>(false);
}
