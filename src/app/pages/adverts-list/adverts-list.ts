import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AdGrid, Sidebar, AdGridHeader } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-adverts-list',
    imports: [AdGrid, AsyncPipe, Sidebar, AdGridHeader],
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

    readonly searchQuery = toSignal(this.route.queryParams.pipe(map((p) => p['search'] ?? '')), {
        initialValue: '',
    });

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
