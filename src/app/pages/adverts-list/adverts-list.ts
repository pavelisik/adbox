import { Component, inject, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AdGrid } from '@app/shared/components';
import { AdvertService } from '@app/shared/services';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-adverts-list',
    imports: [ButtonModule, AdGrid, AsyncPipe],
    templateUrl: './adverts-list.html',
    styleUrl: './adverts-list.scss',
})
export class AdvertsList {
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
