import { Component, computed, effect, inject, untracked } from '@angular/core';
import { AdGrid, AdSidebarFilters, AdTopFilters, AdTitle, Spinner } from '@app/shared/components';
import { AdvertsListFacade } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserFacade } from '@app/core/auth/services';
import { SkeletonModule } from 'primeng/skeleton';

export type AdvertsPageTypes = 'main' | 'search' | 'user-adverts' | 'my-adverts';

@Component({
    selector: 'app-adverts-list',
    imports: [AdGrid, AdSidebarFilters, AdTopFilters, AdTitle, Spinner, SkeletonModule],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
    private readonly advertsListFacade = inject(AdvertsListFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly userFacade = inject(UserFacade);

    readonly adverts = this.advertsListFacade.adverts;
    readonly advertsAuthor = this.advertsListFacade.advertsAuthor;
    readonly currentUser = this.userFacade.currentUser;
    readonly isLoading = this.advertsListFacade.isLoading;

    // определяем тип страницы в зависимости от route.data
    readonly pageType = toSignal<AdvertsPageTypes>(
        this.route.data.pipe(map((data) => data['pageType'] ?? 'search')),
    );

    // определяем userId для страницы с объявлениями пользователя
    readonly userId = toSignal<string | null>(
        this.route.paramMap.pipe(map((params) => params.get('id'))),
    );

    // все возможные параметры
    readonly searchParam = toSignal<string>(
        this.route.queryParams.pipe(map((params) => params['search'])),
    );
    readonly catIdParam = toSignal<string>(
        this.route.queryParams.pipe(map((params) => params['catId'])),
    );
    readonly catNameParam = toSignal<string>(
        this.route.queryParams.pipe(map((params) => params['catName'])),
    );
    readonly sortTypeParam = toSignal<string>(
        this.route.queryParams.pipe(map((params) => params['sort'])),
    );
    readonly minPriceParam = toSignal<string>(
        this.route.queryParams.pipe(map((params) => params['minPrice'])),
    );
    readonly maxPriceParam = toSignal<string>(
        this.route.queryParams.pipe(map((params) => params['maxPrice'])),
    );

    // фильтруем массив с объявлениями для страницы поиска
    readonly filteredAdverts = computed(() => {
        const minPrice = Number(this.minPriceParam());
        const maxPrice = Number(this.maxPriceParam());
        const sortType = this.sortTypeParam() ?? 'date';

        // фильтр по цене
        let result = this.adverts().filter((advert) => {
            if (minPrice && advert.cost < minPrice) return false;
            if (maxPrice && advert.cost > maxPrice) return false;
            return true;
        });

        // выбранная сортировка
        switch (sortType) {
            case 'cheaper':
                return [...result].sort((a, b) => a.cost - b.cost);
            case 'expensive':
                return [...result].sort((a, b) => b.cost - a.cost);
            default:
                return [...result].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
        }
    });

    constructor() {
        effect(() => {
            const pageType = this.pageType();
            const search = this.searchParam();
            const catId = this.catIdParam();
            const userId = this.userId();

            untracked(() => {
                switch (pageType) {
                    case 'main':
                        this.advertsListFacade.searchAdverts('', '', 30);
                        break;
                    case 'search':
                        this.advertsListFacade.searchAdverts(search, catId);
                        break;
                    case 'user-adverts':
                        if (userId) this.advertsListFacade.loadUserAdverts(userId);
                        break;
                }
            });
        });
    }
}
