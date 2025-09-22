import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AdGrid, AdSidebarFilters, AdTopFilters, AdTitle } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-adverts-list',
    imports: [AdGrid, AsyncPipe, AdSidebarFilters, AdTopFilters, ButtonModule, AdTitle],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
    private readonly advertService = inject(AdvertService);
    private readonly route = inject(ActivatedRoute);

    readonly isMain = toSignal(
        this.route.data.pipe(map((data) => (data['isMain'] as boolean) ?? false)),
        {
            initialValue: false,
        },
    );

    searchQuery = toSignal(this.route.queryParams.pipe(map((p) => p['search'] ?? '')), {
        initialValue: '',
    });

    catName = toSignal(this.route.queryParams.pipe(map((p) => p['catName'] ?? '')), {
        initialValue: '',
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
}
