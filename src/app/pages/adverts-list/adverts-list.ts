import { Component, computed, inject, signal } from '@angular/core';
import { AdGrid, AdSidebarFilters, AdTopFilters, AdTitle } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { AdvertsQueryParams } from '@app/pages/adverts-list/domains';
import { UsersStoreService } from '@app/core/auth/services';

@Component({
    selector: 'app-adverts-list',
    imports: [AdGrid, AdSidebarFilters, AdTopFilters, ButtonModule, AdTitle],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
    private readonly advertService = inject(AdvertService);
    private readonly route = inject(ActivatedRoute);
    usersStoreService = inject(UsersStoreService);

    readonly currentUser = this.usersStoreService.currentUser;
    readonly isLoading = signal<boolean>(false);

    // определяем тип страницы в зависимости от route.data
    readonly pageType = toSignal(
        this.route.data.pipe(
            map((data) => {
                if (data['isMain']) return 'main';
                if (data['isUserAdverts']) return 'user';
                return 'search';
            }),
        ),
        { initialValue: 'search' },
    );

    // серверные параметры (необходимые для запроса поиска)
    serverQueryParams$ = this.route.queryParams.pipe(
        map((params) => ({
            search: params['search'] ?? '',
            showNonActive: params['showNonActive'] ?? true,
            category: params['catId'] ?? null,
        })),
        // фильтруем только серверные параметры
        distinctUntilChanged(
            (prev, curr) =>
                prev.search === curr.search &&
                prev.showNonActive === curr.showNonActive &&
                prev.category === curr.category,
        ),
    );

    // клиентские параметры (дополнительные параметры сортировки и цены)
    readonly clientQueryParams = toSignal(
        this.route.queryParams.pipe(
            map((params) => ({
                sortType: params['sort'] ?? 'date',
                minPrice: params['minPrice'] ? Number(params['minPrice']) : null,
                maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : null,
            })),
        ),
        { initialValue: { sortType: 'date', minPrice: null, maxPrice: null } },
    );

    readonly catName = toSignal(
        this.route.queryParams.pipe(map((params) => params['catName'] ?? null)),
        { initialValue: null },
    );

    readonly adverts = toSignal(
        // приходится повторно обращаться к route.data для условного выполнения запроса searchAdverts
        this.route.data.pipe(
            switchMap((data) => {
                // если страница с объявлениями пользователя - не делаем запрос searchAdverts
                if (data['isUserAdverts']) return of([]);
                this.isLoading.set(true);
                return this.serverQueryParams$.pipe(
                    switchMap((params) =>
                        this.advertService
                            .searchAdverts(params, 10)
                            .pipe(tap(() => this.isLoading.set(false))),
                    ),
                );
            }),
        ),
        { initialValue: [] },
    );

    // фильтруем массив с объявлениями для страницы поиска
    readonly filteredAdverts = computed(() => {
        if (this.pageType() !== 'search') return this.adverts();

        const { minPrice, maxPrice, sortType } = this.clientQueryParams();

        // фильтр по цене
        let result = this.adverts().filter((advert) => {
            if (minPrice !== null && advert.cost < minPrice) return false;
            if (maxPrice !== null && advert.cost > maxPrice) return false;
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
}
