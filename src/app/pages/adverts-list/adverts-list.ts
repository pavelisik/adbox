import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AdGrid, Sidebar, AdGridHeader } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdvertsTitlePipe } from '@app/shared/pipes';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-adverts-list',
    imports: [AdGrid, AsyncPipe, Sidebar, AdGridHeader, AdvertsTitlePipe, ButtonModule],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
    private readonly advertService = inject(AdvertService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
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

    // очищаем параметр из строки запроса
    clearQuery(params: string[]) {
        const queryParams = { ...this.route.snapshot.queryParams };
        params.forEach((param) => delete queryParams[param]);
        this.router.navigate(['/adverts'], {
            queryParams,
        });
    }
}
