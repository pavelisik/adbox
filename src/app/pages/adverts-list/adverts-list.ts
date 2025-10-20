import { Component, computed, effect, inject, untracked } from '@angular/core';
import { AdGrid, AdSidebarFilters, AdTopFilters, AdTitle, Spinner } from '@app/shared/components';
import { AdvertsListFacade } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService, UserFacade } from '@app/core/auth/services';
import { SkeletonModule } from 'primeng/skeleton';
import { AdvetsListSection } from './adverts-list-section/adverts-list-section';
import { categoryNameFromId, sortAdvertsByDate } from '@app/shared/utils';
import catWithAdverts from '@app/shared/data/cat-with-adverts.json';

export type AdvertsPageTypes = 'main' | 'search' | 'user-adverts' | 'my-adverts';

@Component({
    selector: 'app-adverts-list',
    imports: [
        AdGrid,
        AdSidebarFilters,
        AdTopFilters,
        AdTitle,
        Spinner,
        SkeletonModule,
        AdvetsListSection,
    ],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
    private readonly advertsListFacade = inject(AdvertsListFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly userFacade = inject(UserFacade);
    private readonly authStateService = inject(AuthStateService);

    readonly adverts = this.advertsListFacade.adverts;
    readonly advertsAuthor = this.advertsListFacade.advertsAuthor;
    readonly currentUser = this.userFacade.currentUser;
    readonly isAuth = this.authStateService.isAuth;
    readonly isLoading = this.advertsListFacade.isLoading;
    readonly isUserLoading = this.userFacade.isLoading;

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

    // определяем имя избранной категории
    readonly favCategoryName = computed(() => {
        return categoryNameFromId(this.currentUser()?.favoriteCategory ?? '');
    });

    // формируем отсортированные по дате объявления
    readonly sortedAdverts = computed(() => {
        if (this.pageType() !== 'main') return [];
        return sortAdvertsByDate(this.adverts());
    });

    // формируем объявления текущего пользователя
    readonly myAdverts = computed(() => {
        if (this.pageType() !== 'my-adverts' && this.pageType() !== 'main') return [];
        const myAdverts = this.currentUser()?.adverts ?? [];
        return sortAdvertsByDate(myAdverts!);
    });

    // фильтруем объявления из избранной категории
    readonly favoriteCategoryAdverts = computed(() => {
        if (this.pageType() !== 'main') return [];

        const favCategory = this.currentUser()?.favoriteCategory;
        if (!favCategory) return [];

        // по нормальному с бэка должны приходить данные объявлений с указанием категории в adverts.category.id
        // но приходится использовать статический файл catWithAdverts с соответствиями всех категорий размещенным в них объявлениям
        const advertsInFavCategory =
            catWithAdverts
                .find((cat) => cat.catId === favCategory)
                ?.adverts.map((advert) => advert.id) ?? [];
        if (!advertsInFavCategory.length) return [];

        const filtered = this.adverts().filter((advert) =>
            advertsInFavCategory.includes(advert.id),
        );

        return sortAdvertsByDate(filtered);
    });

    // фильтруем объявления для страницы поиска
    readonly filteredAdverts = computed(() => {
        if (this.pageType() !== 'search') return [];

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
                return sortAdvertsByDate(result);
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
                        this.advertsListFacade.searchAdverts();
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
