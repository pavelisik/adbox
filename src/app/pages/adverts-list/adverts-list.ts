import { Component, computed, inject } from '@angular/core';
import { AdGrid, AdSidebarFilters, AdTopFilters, AdTitle } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { AdvertsQueryParams } from '@app/pages/adverts-list/domains';

@Component({
    selector: 'app-adverts-list',
    imports: [AdGrid, AdSidebarFilters, AdTopFilters, ButtonModule, AdTitle],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
    private readonly advertService = inject(AdvertService);
    private readonly route = inject(ActivatedRoute);

    readonly isMain = toSignal(
        this.route.data.pipe(map((data) => (data['isMain'] as boolean) ?? false)),
        { initialValue: false },
    );

    readonly queryParams = toSignal(this.route.queryParams, {
        initialValue: {} as AdvertsQueryParams,
    });

    adverts$ = this.route.queryParams.pipe(
        switchMap((params) =>
            this.advertService.searchAdverts(
                {
                    search: params['search'] ?? '',
                    showNonActive: params['showNonActive'] ?? true,
                    category: params['catId'] ?? null,
                },
                10,
            ),
        ),
    );

    advertsRaw = toSignal(this.adverts$, { initialValue: [] });

    filteredAdverts = computed(() => {
        const minPrice = this.queryParams().minPrice ? Number(this.queryParams().minPrice) : null;
        const maxPrice = this.queryParams().maxPrice ? Number(this.queryParams().maxPrice) : null;
        const sortType = this.queryParams().sort ?? 'date';

        // фильтр по цене
        let result = this.advertsRaw().filter((advert) => {
            if (minPrice !== null && advert.cost < minPrice) return false;
            if (maxPrice !== null && advert.cost > maxPrice) return false;
            return true;
        });

        // выбранная сортировка
        switch (sortType) {
            case 'cheaper':
                result = [...result].sort((a, b) => a.cost - b.cost);
                break;
            case 'expensive':
                result = [...result].sort((a, b) => b.cost - a.cost);
                break;
            default:
                result = [...result].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
        }

        return result;
    });
}
