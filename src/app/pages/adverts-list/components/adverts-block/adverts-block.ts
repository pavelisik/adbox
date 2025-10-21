import { Component, input, output } from '@angular/core';
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
    readonly blockType = input.required<BlockType>();
    readonly adverts = input.required<ShortAdvert[]>();
    readonly advertsCount = input.required<number>();
    readonly isLoading = input<boolean>(false);

    readonly favCategoryName = input<string | null>(null);
    readonly favCategoryId = input<string | null>(null);
    readonly isAuth = input<boolean>(false);

    readonly addFavorite = output<{ advertId: string }>();
    readonly removeFavorite = output<{ advertId: string }>();
    readonly deleteAdvert = output<{ advertId: string }>();
}
