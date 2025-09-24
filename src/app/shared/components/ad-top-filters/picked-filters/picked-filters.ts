import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PriceFormatPipe } from '@app/shared/pipes';
import { AdvertsQueryParams } from '@app/pages/adverts-list/domains';

@Component({
    selector: 'app-picked-filters',
    imports: [ButtonModule, PriceFormatPipe],
    templateUrl: './picked-filters.html',
    styleUrl: './picked-filters.scss',
})
export class PickedFilters {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly queryParams = toSignal(this.route.queryParams, {
        initialValue: {} as AdvertsQueryParams,
    });

    // очищаем параметр из строки запроса
    clearQuery(params: string[]) {
        const updatedParams = { ...this.route.snapshot.queryParams };
        params.forEach((param) => delete updatedParams[param]);
        this.router.navigate([], { relativeTo: this.route, queryParams: updatedParams });
    }
}
