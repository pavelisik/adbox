import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdGrid, Sidebar, AdGridHeader } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-search',
    imports: [AdGrid, AsyncPipe, Sidebar, AdGridHeader],
    templateUrl: './search.html',
    styleUrl: './search.scss',
})
export class Search {
    advertService = inject(AdvertService);
    route = inject(ActivatedRoute);

    adverts$ = this.route.queryParams.pipe(
        switchMap((params) =>
            this.advertService.searchAdverts(
                {
                    search: params['search'] ?? '',
                    showNonActive: params['showNonActive'] ?? true,
                    category: params['category'] ?? null,
                },
                10,
            ),
        ),
    );
}
